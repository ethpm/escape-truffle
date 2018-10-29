/**
 * @author              Piper Merriam  - originally written in Python for ethpm/escape
 * @js-translation.     cgewecke
 */

const helpers = require('./helpers');
const constants = helpers.constants;
const assertFailure = helpers.assertFailure;

const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');
const PackageRegistry = artifacts.require('PackageRegistry');
const ReleaseValidator = artifacts.require('ReleaseValidator');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');

contract('PackageRegistry', function(accounts){
  let packageDB;
  let releaseDB;
  let packageRegistry;
  let releaseValidator;
  let authority
  let nameHash;

  async function assertRelease(
    name,
    version,
    manifestUri,
    receipt,
    releaseData,
  ){
    const block = await web3.eth.getBlock(receipt.blockHash);

    const nameHash = await packageDB.hashName(name)
    const versionHash = await releaseDB.hashVersion(version)
    const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)
    const ids = await packageRegistry.getAllReleaseIds(name, 0, 100);

    const exists = await packageRegistry.releaseExists(name, version);
    const generatedId = await packageRegistry.generateReleaseId(name, version);

    assert( ids.releaseIds.includes(releaseHash) );
    assert( generatedId === releaseHash );
    assert( exists );

    assert( releaseData.name === name);
    assert( releaseData.version === version);
    assert( releaseData.manifestURI === manifestUri );
  }

  describe('Initialization', function(){

    // Mocks a zeroAddress contract
    const nullContract = function(type){
      const abis = {
        'package': PackageDB.abi,
        'release': ReleaseDB.abi,
        'validator': ReleaseValidator.abi,
      }

      return {
        address: helpers.addressZero,
        setAuthority: () => {},
        abi: abis[type]
      }
    }

    beforeEach(async function(){
      packageRegistry = await PackageRegistry.new();
      authority = await WhitelistAuthority.new();
    })

    it('should release when initialized correctly [ @geth ]', async function(){
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      releaseValidator = await ReleaseValidator.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageRegistry,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', '1.2.3.a.b', 'ipfs://some-ipfs-uri'];

      await packageRegistry.release(...releaseInfo)
      assert( await packageRegistry.packageExists('test') === true );
    });

    it('should not release if not initialized with a PackageDB', async function(){
      packageDB = nullContract('package');
      releaseDB = await ReleaseDB.new();
      releaseValidator = await ReleaseValidator.new();

      await helpers.setPermissions(
        authority,
        packageRegistry,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', '1.2.3.a.b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageRegistry.release(...releaseInfo),
        'package-db-not-set'
      );
    });

    it('should not release if not initialized with a ReleaseDB', async function(){
      packageDB = await PackageDB.new();
      releaseDB = nullContract('release');
      releaseValidator = await ReleaseValidator.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageRegistry,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', '1.2.3.a.b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageRegistry.release(...releaseInfo),
        'release-db-not-set'
      );

      assert( await packageRegistry.packageExists('test') === false );
    });

    it('should not release if not initialized with a ReleaseValidator', async function(){
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      releaseValidator = nullContract('validator');
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageRegistry,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', '1.2.3.a.b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageRegistry.release(...releaseInfo),
        'release-validator-not-set'
      );

      assert( await packageRegistry.packageExists('test') === false );
    });

    it('should not release if the PackageDB has deauthorized the registry', async function(){
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      releaseValidator = await ReleaseValidator.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageRegistry,
        packageDB,
        releaseDB,
        releaseValidator
      );

      await packageDB.setAuthority(constants.zeroAddress);
      const releaseInfo = ['test', '1.2.3.a.b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageRegistry.release(...releaseInfo),
        'caller-not-authorized'
      );

      assert( await packageRegistry.packageExists('test') === false );
    });
  });

  describe('Methods', function(){
    beforeEach(async() => {
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      packageRegistry = await PackageRegistry.new();
      releaseValidator = await ReleaseValidator.new();
      authority = await WhitelistAuthority.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageRegistry,
        packageDB,
        releaseDB,
        releaseValidator
      );
    })

    describe('getters', function(){
      it('packageDb [ @geth ]', async function(){
        assert(await packageRegistry.getPackageDb() === packageDB.address);
      });

      it('releaseDb', async function(){
        assert(await packageRegistry.getReleaseDb() === releaseDB.address);
      });

      it('releaseValidator', async function(){
        assert(await packageRegistry.getReleaseValidator() === releaseValidator.address);
      });
    });

    describe('packages', function(){
      it('should retrieve all packages ids / package names', async function(){
        nameHash = await packageDB.hashName('test-r');

        const releaseInfoA = ['test-r', '1.2.3.t.u', 'ipfs://some-ipfs-uri']
        const releaseInfoB = ['test-r', '2.3.4.v.y', 'ipfs://some-other-ipfs-uri']

        const nameHashA = await packageDB.hashName(releaseInfoA[0]);
        const nameHashB = await packageDB.hashName(releaseInfoB[0]);

        await packageRegistry.release(...releaseInfoA)
        await packageRegistry.release(...releaseInfoB)

        const ids = await packageRegistry.getAllPackageIds(0,100);

        assert(ids.packageIds.includes(nameHashA));
        assert(ids.packageIds.includes(nameHashB));

        const nameA = await packageRegistry.methods['getPackageName(bytes32)'](nameHashA);
        const nameB = await packageRegistry.methods['getPackageName(bytes32)'](nameHashB);

        assert(nameA === releaseInfoA[0]);
        assert(nameB === releaseInfoB[0]);
      });
    })

    describe('releases', function(){

      it('should retrieve release by release id', async function(){
        const releaseInfoA = ['test', '1.2.3.r.s', 'ipfs://some-ipfs-uri']
        const releaseInfoB = ['test', '2.3.4.m.n', 'ipfs://some-other-ipfs-uri']

        const versionHashA = await releaseDB.hashVersion(releaseInfoA[1])
        const versionHashB = await releaseDB.hashVersion(releaseInfoB[1])

        const releaseHashA = await releaseDB.hashRelease(nameHash, versionHashA)
        const releaseHashB = await releaseDB.hashRelease(nameHash, versionHashB)

        const responseA = await packageRegistry.release(...releaseInfoA)
        const responseB = await packageRegistry.release(...releaseInfoB)

        const releaseDataA = await packageRegistry.getReleaseData(releaseHashA)
        const releaseDataB = await packageRegistry.getReleaseData(releaseHashB)

        await assertRelease(...releaseInfoA, responseA.receipt, releaseDataA)
        await assertRelease(...releaseInfoB, responseB.receipt, releaseDataB)
      });

      it('should retrieve a list of all release hashes', async function(){
        const nameHashA = await packageDB.hashName('test-a')
        const nameHashB = await packageDB.hashName('test-b')
        const nameHashC = await packageDB.hashName('test-c')

        const releaseInfoA = ['test-a', '1.2.3.a.b', 'ipfs://a']
        const releaseInfoB = ['test-b', '2.3.4.c.d', 'ipfs://b']
        const releaseInfoC = ['test-c', '3.4.5.e.f', 'ipfs://c']
        const releaseInfoD = ['test-c', '3.4.6.e.f', 'ipfs://d']
        const releaseInfoE = ['test-b', '2.4.5.c.d', 'ipfs://e']
        const releaseInfoF = ['test-c', '3.5.5.e.f', 'ipfs://f']

        const versionHashA = await releaseDB.hashVersion(releaseInfoA[1])
        const versionHashB = await releaseDB.hashVersion(releaseInfoB[1])
        const versionHashC = await releaseDB.hashVersion(releaseInfoC[1])
        const versionHashD = await releaseDB.hashVersion(releaseInfoD[1])
        const versionHashE = await releaseDB.hashVersion(releaseInfoE[1])
        const versionHashF = await releaseDB.hashVersion(releaseInfoF[1])

        const releaseHashA = await releaseDB.hashRelease(nameHashA, versionHashA)
        const releaseHashB = await releaseDB.hashRelease(nameHashB, versionHashB)
        const releaseHashC = await releaseDB.hashRelease(nameHashC, versionHashC)
        const releaseHashD = await releaseDB.hashRelease(nameHashC, versionHashD)
        const releaseHashE = await releaseDB.hashRelease(nameHashB, versionHashE)
        const releaseHashF = await releaseDB.hashRelease(nameHashC, versionHashF)

        await packageRegistry.release(...releaseInfoA)
        await packageRegistry.release(...releaseInfoB)
        await packageRegistry.release(...releaseInfoC)
        await packageRegistry.release(...releaseInfoD)
        await packageRegistry.release(...releaseInfoE)
        await packageRegistry.release(...releaseInfoF)

        const packageDataA = await packageRegistry.getPackageData('test-a');
        const packageDataB = await packageRegistry.getPackageData('test-b');
        const packageDataC = await packageRegistry.getPackageData('test-c');

        assert( packageDataA.numReleases.toNumber() === 1 )
        assert( packageDataB.numReleases.toNumber() === 2 )
        assert( packageDataC.numReleases.toNumber() === 3 )
      });
    });

    describe('getAllReleaseIds', function(){
      let releaseHashA;
      let releaseHashB;
      let releaseHashC;

      const releaseInfoA = ['test-r', '1.2.3.t.u', 'ipfs://some-ipfs-uri']
      const releaseInfoB = ['test-r', '2.3.4.v.y', 'ipfs://some-other-ipfs-uri']
      const releaseInfoC = ['test-r', '3.4.5.w.q', 'ipfs://yet-another-ipfs-uri']

      beforeEach(async function(){
        nameHash = await packageDB.hashName('test-r');

        const versionHashA = await releaseDB.hashVersion(releaseInfoA[1])
        const versionHashB = await releaseDB.hashVersion(releaseInfoB[1])
        const versionHashC = await releaseDB.hashVersion(releaseInfoC[1])

        releaseHashA = await releaseDB.hashRelease(nameHash, versionHashA)
        releaseHashB = await releaseDB.hashRelease(nameHash, versionHashB)
        releaseHashC = await releaseDB.hashRelease(nameHash, versionHashC)

        await packageRegistry.release(...releaseInfoA)
        await packageRegistry.release(...releaseInfoB)
        await packageRegistry.release(...releaseInfoC)
      })

      it('returns ([],0) for a non-existent release', async() => {
        const limit = 20;
        const result = await packageRegistry.getAllReleaseIds('test-none', 0, limit);

        assert(Array.isArray(result.releaseIds));
        assert(result.releaseIds.length === 0);
        assert(result.offset.toNumber() === 0)
      });

      it('returns ([],offset) when offset equals # of releases', async()=>{
        const limit = 20;
        const packageData = await packageRegistry.getPackageData('test-r');
        const numReleases = packageData.numReleases.toNumber();
        assert(numReleases === 3 );

        const offset = numReleases;
        const result = await packageRegistry.getAllReleaseIds('test-r', offset, limit);

        assert(Array.isArray(result.releaseIds));
        assert(result.releaseIds.length === 0);
        assert(result.offset.toNumber() === offset)
      });

      it('returns ([],0) when limit param is zero', async()=> {
        const result = await packageRegistry.getAllReleaseIds('test-r',0,0);

        assert(Array.isArray(result.releaseIds));
        assert(result.releaseIds.length === 0);
        assert(result.offset.toNumber() === 0)
      });

      it('returns ([allReleaseIds], limit) when limit is greater than # of releases', async function(){
        const packageData = await packageRegistry.getPackageData('test-r');
        assert(packageData.numReleases.toNumber() === 3 );

        const limit = packageData.numReleases.toNumber() + 1;
        const result = await packageRegistry.getAllReleaseIds('test-r', 0, limit);

        assert(result.offset.toNumber() === packageData.numReleases.toNumber());
        assert(result.releaseIds.length === packageData.numReleases.toNumber());
        assert(result.releaseIds.includes(releaseHashA));
        assert(result.releaseIds.includes(releaseHashB));
        assert(result.releaseIds.includes(releaseHashC));
      });

      it('returns releases and offset when limit is < # of releases', async function(){
        const packageData = await packageRegistry.getPackageData('test-r');
        const numReleases = packageData.numReleases.toNumber();
        assert(numReleases === 3 );

        const limit = 2;
        const resultA = await packageRegistry.getAllReleaseIds('test-r', 0, limit);

        // Initial results (2)
        assert(resultA.releaseIds.length === limit);
        assert(resultA.offset.toNumber() === limit);

        const resultB = await packageRegistry.getAllReleaseIds('test-r', resultA.offset, limit);

        // Remaining results (1)
        assert(resultB.releaseIds.length === numReleases - limit);
        assert(resultB.offset.toNumber() === numReleases);

        const resultC = await packageRegistry.getAllReleaseIds('test-r', resultB.offset, limit);

        // Empty results, terminal index
        assert(resultC.releaseIds.length === 0);
        assert(resultC.offset.toNumber() === numReleases);

        let allIds = resultA.releaseIds.concat(resultB.releaseIds);

        assert(allIds.length === numReleases);
        assert(allIds.includes(releaseHashA));
        assert(allIds.includes(releaseHashB));
        assert(allIds.includes(releaseHashC));
      });

      it('handles DBs with removed items correctly', async function(){
        const packageData = await packageRegistry.getPackageData('test-r');
        const numReleases = packageData.numReleases.toNumber();
        assert(numReleases === 3 );

        const limit = numReleases;
        await releaseDB.removeRelease(releaseHashB, 'because');

        const resultA = await packageRegistry.getAllReleaseIds('test-r', 0, limit);
        const offsetA = resultA.offset.toNumber();

        // Initial results (2)
        assert(resultA.releaseIds.length === limit - 1);
        assert(offsetA === limit - 1);
        assert(!resultA.releaseIds.includes(releaseHashB));

        const resultB = await packageRegistry.getAllReleaseIds('test-r', offsetA, limit);

        // Empty results, terminal index
        assert(resultB.releaseIds.length === 0);
        assert(resultB.offset.toNumber() === offsetA);
      });
    });

    describe('ownership [ @geth ]', function(){
      const info = ['test-a', '1.2.3','ipfs://some-ipfs-uri'];
      const owner = accounts[0];
      const newOwner = accounts[1];
      const notOwner = accounts[2];
      const name = info[0];

      beforeEach(async () => {
        assert( await packageRegistry.packageExists(name) === false );
      })

      it('should transfer ownership', async function(){
        await packageRegistry.release(...info, {from: owner});

        let packageData = await packageRegistry.getPackageData(name);
        assert(packageData.packageOwner === owner);

        await packageRegistry.transferPackageOwner(name, newOwner);

        packageData = await packageRegistry.getPackageData(name);
        assert(packageData.packageOwner === newOwner);
      });

      it('should not transfer package owned by null address', async function(){
        assert( await packageRegistry.packageExists(name) === false );

        await assertFailure(
          packageRegistry.transferPackageOwner(name, newOwner),
          'package-not-found'
        )
      });

      it('should not transfer package which is not owned by sender', async function(){
        await packageRegistry.release(...info, {from: owner});

        let packageData = await packageRegistry.getPackageData(name);
        assert(packageData.packageOwner === owner);

        await packageRegistry.transferPackageOwner(name, newOwner, {from: notOwner});

        packageData = await packageRegistry.getPackageData(name);
        assert(packageData.packageOwner === owner);
      });
    });
  });
});
