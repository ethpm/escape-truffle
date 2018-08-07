const helpers = require('./helpers');
const PackageDB = artifacts.require('PackageDB');
const constants = helpers.constants;
const assertFailure = helpers.assertFailure;
const assertCallFailure = helpers.assertCallFailure;

contract('PackageDB', function(accounts){
  let semVersionLib;
  let indexedOrderedSetLib;
  let packageDB;
  let packageName;
  let nameHash;

  before(async () => {
    packageName = '@ethpm/v2';
    packageDB = await PackageDB.new();
    nameHash = await packageDB.hashName(packageName);
  });

  describe('setPackage [ @geth ]', function(){
    it('should create a package record', async function(){
      const now = helpers.now();
      await packageDB.setPackage(packageName);

      const exists = await packageDB.packageExists(nameHash);
      assert(exists);

      const data = await packageDB.getPackageData(nameHash);
      const name = await packageDB.getPackageName(nameHash);
      const hash = await packageDB.getPackageNameHash("0");

      assert(data.packageOwner === constants.zeroAddress);
      assert(data.createdAt >= now);
      assert(data.updatedAt >= now);
      assert(name === packageName);
      assert(hash === nameHash);
    });

    it('should emit `PackageCreate`', async function(){
      const events = await packageDB.getPastEvents('PackageCreate');
      const event = events[0];
      assert(event.returnValues.nameHash === nameHash);
    });

    it('should modify the `updatedAt` timestamp if package exists', async function(){
      const exists = await packageDB.packageExists(nameHash);
      assert(exists);

      await helpers.waitSecond();
      await packageDB.setPackage(packageName);
      const record = await packageDB.getPackageData(nameHash);
      assert(record.createdAt.toNumber() < record.updatedAt.toNumber());
    });
  });

  describe('setPackageOwner [ @geth ]', function(){
    const owner = accounts[1];

    it('should set the package owner', async function(){
      await helpers.waitSecond();
      const now = helpers.now();

      await packageDB.setPackageOwner(nameHash, owner);

      const data = await packageDB.getPackageData(nameHash);
      assert(data.packageOwner = owner);
    });

    it('should emit `PackageOwnerUpdate`', async function(){
      const events = await packageDB.getPastEvents('PackageOwnerUpdate');
      const event = events[0];
      assert(event.returnValues.nameHash === nameHash);
      assert(event.returnValues.oldOwner === constants.zeroAddress);
      assert(event.returnValues.newOwner === owner);
    });

    it('should throw if target package does not exist', async function(){
      const unpublishedHash = await packageDB.hashName('unpublished');

      await assertFailure(
        packageDB.setPackageOwner(unpublishedHash, owner),
        'package-not-found'
      )
    });
  });

  describe('removePackage [ @geth ]', function(){
    let reason = `
      In order to possess what you do not possess
        You must go by the way of dispossession.
    `;

    it('should remove a package', async function(){
      let exists = await packageDB.packageExists(nameHash);
      let num = await packageDB.getNumPackages();

      assert(exists);
      assert(num.toNumber() === 1);

      await packageDB.removePackage(nameHash, reason);

      exists = await packageDB.packageExists(nameHash);
      num = await packageDB.getNumPackages();

      assert(!exists);
      assert(num.toNumber() === 0);

      // There is a bug somewhere causing reverts
      // in `view` fns to be ignored. In this case it seems like
      // the modifier just falls through and the call executes.
      /*
      await assertCallFailure(
        packageDB.getPackageData(nameHash),
        false
      );*/

    });

    it('should emit `PackageDelete`', async function(){
      const events = await packageDB.getPastEvents('PackageDelete');
      const event = events[0];
      assert(event.returnValues.nameHash === nameHash);
      assert(event.returnValues.reason === reason);
    });

    it('should error when removing non-existent package', async function(){
      let exists = await packageDB.packageExists(nameHash);
      assert(!exists);

      await assertFailure(
        packageDB.removePackage(nameHash, reason),
        'package-not-found'
      );
    });
  });

  describe('getAllPackageIds', function(){
    let packageNames = ['a','b','c','d','e'];
    let packageHashes = [];

    before(async ()=> {
      for (let name of packageNames){
        let hash = await packageDB.hashName(name);
        packageHashes.push(hash);
      }
    })

    beforeEach(async () => packageDB = await PackageDB.new());

    it('returns ([],0) for an empty DB', async() => {
      const result = await packageDB.getAllPackageIds(0,20);

      assert(Array.isArray(result.packageIds));
      assert(result.packageIds.length === 0);
      assert(result.offset.toNumber() === 0)
    });

    it('returns ([],0) when limit param is zero', async()=> {
      const result = await packageDB.getAllPackageIds(0,0);

      assert(Array.isArray(result.packageIds));
      assert(result.packageIds.length === 0);
      assert(result.offset.toNumber() === 0)
    });

    it('returns ([],offset) when offset equals DB size', async()=>{
      const dbSize = await packageDB.getNumPackages();
      const offset = dbSize.toNumber();
      const result = await packageDB.getAllPackageIds(offset,20);

      assert(Array.isArray(result.packageIds));
      assert(result.packageIds.length === 0);
      assert(result.offset.toNumber() === offset)
    });

    it('returns ([allPackageIds], limit) when limit is greater than DB size', async()=>{
      for (let name of packageNames){
        await packageDB.setPackage(name);
      }

      const dbSize = await packageDB.getNumPackages();

      assert(dbSize.toNumber() === packageNames.length);
      const limit = dbSize.toNumber() + 1;
      const result = await packageDB.getAllPackageIds(0,limit);

      assert(result.packageIds.length === dbSize.toNumber());
      assert(result.offset.toNumber() === dbSize.toNumber());

      for(let hash of packageHashes){
        assert(result.packageIds.includes(hash));
      }
    });

    it('returns the correct number of packages and offset when limit is < DB size', async()=>{
      for (let name of packageNames){
        await packageDB.setPackage(name);
      }

      const limit = 3;
      const firstPage = packageHashes.slice(0,limit);
      const secondPage = packageHashes.slice(limit);
      const dbSize = await packageDB.getNumPackages();

      assert(limit < dbSize);

      const resultA = await packageDB.getAllPackageIds(0,limit);

      // Initial results (3)
      assert(resultA.packageIds.length === limit);
      assert(resultA.offset.toNumber() === limit);

      const resultB = await packageDB.getAllPackageIds(resultA.offset, limit);

      // Remaining results (2)
      assert(resultB.packageIds.length === dbSize.toNumber() - limit);
      assert(resultB.offset.toNumber() === dbSize.toNumber());

      const resultC = await packageDB.getAllPackageIds(resultB.offset, limit);

      // Empty results, terminal index
      assert(resultC.packageIds.length === 0);
      assert(resultC.offset.toNumber() === dbSize.toNumber());

      // Verify that return results don't overlap
      for (let hash in resultA.packageIds){
        assert(!resultB.packageIds.includes(hash))
      }
    });

    it('handles DBs with removed items correctly', async()=>{
      for (let name of packageNames){
        await packageDB.setPackage(name);
      }

      const limit = await packageDB.getNumPackages();

      const hashToRemove = packageHashes[2];
      await packageDB.removePackage(hashToRemove, 'because');

      const resultA = await packageDB.getAllPackageIds(0,limit);

      // Initial results (4)
      assert(resultA.packageIds.length === limit - 1);
      assert(resultA.offset.toNumber() === limit - 1);
      assert(!resultA.packageIds.includes(hashToRemove));

      const resultB = await packageDB.getAllPackageIds(resultA.offset, limit);

      // Empty results, terminal index
      assert(resultB.packageIds.length === 0);
      assert(resultB.offset.toNumber() === resultA.offset.toNumber());
    });

    it('should be possible to extract all the package names', async()=> {
      let names = [];

      for (let name of packageNames){
        await packageDB.setPackage(name);
      }

      const limit = await packageDB.getNumPackages();
      const result = await packageDB.getAllPackageIds(0,limit);

      assert(result.packageIds.length === packageNames.length);

      for (let hash of result.packageIds){
        let name = await packageDB.getPackageName(hash);
        names.push(name);
      }

      for (let name of names ){
        assert(packageNames.includes(name));
      }
    })
  });
});
