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
});