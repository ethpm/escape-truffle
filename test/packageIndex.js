/**
 * @author              Piper Merriam  - originally written in Python for ethpm/escape
 * @js-translation.     cgewecke
 */

const helpers = require('./helpers');
const constants = helpers.constants;
const assertFailure = helpers.assertFailure;

const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');
const PackageIndex = artifacts.require('PackageIndex');
const ReleaseValidator = artifacts.require('ReleaseValidator');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');

contract('PackageIndex', function(accounts){
  let packageDB;
  let releaseDB;
  let packageIndex;
  let releaseValidator;
  let authority
  let nameHash;

  async function assertRelease(
    name,
    major,
    minor,
    patch,
    preRelease,
    build,
    manifestUri,
    receipt,
    releaseData,
  ){
    const block = await web3.eth.getBlock(receipt.blockHash);
    const timestamp = block.timestamp;

    const nameHash = await packageDB.hashName(name)
    const versionHash = await releaseDB.hashVersion(major, minor, patch, preRelease, build)
    const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)
    const allHashes = await packageIndex.getAllPackageReleaseHashes(name);
    const exists = await packageIndex.releaseExists(name, major, minor, patch, preRelease, build)

    assert( allHashes.includes(releaseHash) );
    assert( exists );

    assert( releaseData.major.toNumber() === major);
    assert( releaseData.minor.toNumber() === minor );
    assert( releaseData.patch.toNumber() === patch );
    assert( releaseData.preRelease === preRelease );
    assert( releaseData.build === build );
    assert( releaseData.manifestURI === manifestUri );
    assert( releaseData.createdAt.toNumber() === timestamp );
    assert( releaseData.updatedAt.toNumber() === timestamp );
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
      packageIndex = await PackageIndex.new();
      authority = await WhitelistAuthority.new();
    })

    it('should release when initialized correctly [ @geth ]', async function(){
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      releaseValidator = await ReleaseValidator.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageIndex,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', 1, 2, 3, 'a', 'b', 'ipfs://some-ipfs-uri'];

      await packageIndex.release(...releaseInfo)
      assert( await packageIndex.packageExists('test') === true );
    });

    it('should not release if not initialized with a PackageDB', async function(){
      packageDB = nullContract('package');
      releaseDB = await ReleaseDB.new();
      releaseValidator = await ReleaseValidator.new();

      await helpers.setPermissions(
        authority,
        packageIndex,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', 1, 2, 3, 'a', 'b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageIndex.release(...releaseInfo),
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
        packageIndex,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', 1, 2, 3, 'a', 'b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageIndex.release(...releaseInfo),
        'release-db-not-set'
      );

      assert( await packageIndex.packageExists('test') === false );
    });

    it('should not release if not initialized with a ReleaseValidator', async function(){
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      releaseValidator = nullContract('validator');
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageIndex,
        packageDB,
        releaseDB,
        releaseValidator
      );

      const releaseInfo = ['test', 1, 2, 3, 'a', 'b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageIndex.release(...releaseInfo),
        'release-validator-not-set'
      );

      assert( await packageIndex.packageExists('test') === false );
    });

    it('should not release if the PackageDB has deauthorized the index', async function(){
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      releaseValidator = await ReleaseValidator.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageIndex,
        packageDB,
        releaseDB,
        releaseValidator
      );

      await packageDB.setAuthority(constants.zeroAddress);
      const releaseInfo = ['test', 1, 2, 3, 'a', 'b', 'ipfs://some-ipfs-uri']

      await assertFailure(
        packageIndex.release(...releaseInfo),
        'caller-not-authorized'
      );

      assert( await packageIndex.packageExists('test') === false );
    });
  });

  describe('Methods', function(){
    beforeEach(async() => {
      packageDB = await PackageDB.new();
      releaseDB = await ReleaseDB.new();
      packageIndex = await PackageIndex.new();
      releaseValidator = await ReleaseValidator.new();
      authority = await WhitelistAuthority.new();
      nameHash = await packageDB.hashName('test');

      await helpers.setPermissions(
        authority,
        packageIndex,
        packageDB,
        releaseDB,
        releaseValidator
      );
    })

    describe('getters', function(){
      it('packageDb [ @geth ]', async function(){
        assert(await packageIndex.getPackageDb() === packageDB.address);
      });

      it('releaseDb', async function(){
        assert(await packageIndex.getReleaseDb() === releaseDB.address);
      });

      it('releaseValidator', async function(){
        assert(await packageIndex.getReleaseValidator() === releaseValidator.address);
      });
    });

    describe('releases', function(){
      it('should retrieve release by index [ @geth ]', async function(){
        const releaseInfoA = ['test', 1, 2, 3, 'a', 'b', 'ipfs://some-ipfs-uri']
        const releaseInfoB = ['test', 2, 3, 4, 'c', 'd', 'ipfs://some-other-ipfs-uri']

        const versionHashA = await releaseDB.hashVersion(...releaseInfoA.slice(1, -1))
        const versionHashB = await releaseDB.hashVersion(...releaseInfoB.slice(1, -1))

        const releaseHashA = await releaseDB.hashRelease(nameHash, versionHashA)
        const releaseHashB = await releaseDB.hashRelease(nameHash, versionHashB)

        await packageIndex.release(...releaseInfoA)
        await packageIndex.release(...releaseInfoB)

        actualReleaseHashA = await packageIndex.getReleaseHashForPackage('test', 0)
        actualReleaseHashB = await packageIndex.getReleaseHashForPackage('test', 1)

        assert( actualReleaseHashA == releaseHashA )
        assert( actualReleaseHashB == releaseHashB )
      })

      it('should retrieve the manifest Uri', async function(){
        const releaseInfo = ['test', 2, 3, 4, 'c', 'e', 'ipfs://some--ipfs-uri']

        const versionHash = await releaseDB.hashVersion(...releaseInfo.slice(1, -1))
        const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)

        await packageIndex.release(...releaseInfo)
        const manifestUri = await packageIndex.getReleaseManifestURI(...releaseInfo.slice(0, -1))
        assert(manifestUri === releaseInfo.pop())
      });

      it('should retrieve release by release hash', async function(){
        const releaseInfoA = ['test', 1, 2, 3, 'r', 's', 'ipfs://some-ipfs-uri']
        const releaseInfoB = ['test', 2, 3, 4, 'm', 'n', 'ipfs://some-other-ipfs-uri']

        const versionHashA = await releaseDB.hashVersion(...releaseInfoA.slice(1, -1))
        const versionHashB = await releaseDB.hashVersion(...releaseInfoB.slice(1, -1))

        const releaseHashA = await releaseDB.hashRelease(nameHash, versionHashA)
        const releaseHashB = await releaseDB.hashRelease(nameHash, versionHashB)

        const responseA = await packageIndex.release(...releaseInfoA)
        const responseB = await packageIndex.release(...releaseInfoB)

        const releaseDataA = await packageIndex.getReleaseData(releaseHashA)
        const releaseDataB = await packageIndex.getReleaseData(releaseHashB)

        await assertRelease(...releaseInfoA, responseA.receipt, releaseDataA)
        await assertRelease(...releaseInfoB, responseB.receipt, releaseDataB)
      });

      it('should retrieve a list of release hashes', async function(){
        nameHash = await packageDB.hashName('test-r');

        const releaseInfoA = ['test-r', 1, 2, 3, 't', 'u', 'ipfs://some-ipfs-uri']
        const releaseInfoB = ['test-r', 2, 3, 4, 'v', 'y', 'ipfs://some-other-ipfs-uri']
        const releaseInfoC = ['test-r', 3, 4, 5, 'w', 'q', 'ipfs://yet-another-ipfs-uri']

        const versionHashA = await releaseDB.hashVersion(...releaseInfoA.slice(1, -1))
        const versionHashB = await releaseDB.hashVersion(...releaseInfoB.slice(1, -1))
        const versionHashC = await releaseDB.hashVersion(...releaseInfoC.slice(1, -1))

        const releaseHashA = await releaseDB.hashRelease(nameHash, versionHashA)
        const releaseHashB = await releaseDB.hashRelease(nameHash, versionHashB)
        const releaseHashC = await releaseDB.hashRelease(nameHash, versionHashC)

        await packageIndex.release(...releaseInfoA)
        await packageIndex.release(...releaseInfoB)
        await packageIndex.release(...releaseInfoC)

        const packageData =  await packageIndex.getPackageData('test-r');
        assert(packageData.numReleases.toNumber() === 3 );

        const releaseHashes = await packageIndex.getAllPackageReleaseHashes('test-r');

        assert(releaseHashes["0"] === releaseHashA);
        assert(releaseHashes["1"] === releaseHashB);
        assert(releaseHashes["2"] === releaseHashC);
      });

      it('should retrieve a list of ALL release hashes', async function(){
        const nameHashA = await packageDB.hashName('test-a')
        const nameHashB = await packageDB.hashName('test-b')
        const nameHashC = await packageDB.hashName('test-c')

        const releaseInfoA = ['test-a', 1, 2, 3, 'a', 'b', 'ipfs://a']
        const releaseInfoB = ['test-b', 2, 3, 4, 'c', 'd', 'ipfs://b']
        const releaseInfoC = ['test-c', 3, 4, 5, 'e', 'f', 'ipfs://c']
        const releaseInfoD = ['test-c', 3, 4, 6, 'e', 'f', 'ipfs://d']
        const releaseInfoE = ['test-b', 2, 4, 5, 'c', 'd', 'ipfs://e']
        const releaseInfoF = ['test-c', 3, 5, 5, 'e', 'f', 'ipfs://f']

        const versionHashA = await releaseDB.hashVersion(...releaseInfoA.slice(1, -1))
        const versionHashB = await releaseDB.hashVersion(...releaseInfoB.slice(1, -1))
        const versionHashC = await releaseDB.hashVersion(...releaseInfoC.slice(1, -1))
        const versionHashD = await releaseDB.hashVersion(...releaseInfoD.slice(1, -1))
        const versionHashE = await releaseDB.hashVersion(...releaseInfoE.slice(1, -1))
        const versionHashF = await releaseDB.hashVersion(...releaseInfoF.slice(1, -1))

        const releaseHashA = await releaseDB.hashRelease(nameHashA, versionHashA)
        const releaseHashB = await releaseDB.hashRelease(nameHashB, versionHashB)
        const releaseHashC = await releaseDB.hashRelease(nameHashC, versionHashC)
        const releaseHashD = await releaseDB.hashRelease(nameHashC, versionHashD)
        const releaseHashE = await releaseDB.hashRelease(nameHashB, versionHashE)
        const releaseHashF = await releaseDB.hashRelease(nameHashC, versionHashF)

        await packageIndex.release(...releaseInfoA)
        await packageIndex.release(...releaseInfoB)
        await packageIndex.release(...releaseInfoC)
        await packageIndex.release(...releaseInfoD)
        await packageIndex.release(...releaseInfoE)
        await packageIndex.release(...releaseInfoF)

        const packageDataA = await packageIndex.getPackageData('test-a');
        const packageDataB = await packageIndex.getPackageData('test-b');
        const packageDataC = await packageIndex.getPackageData('test-c');

        assert( packageDataA.numReleases.toNumber() === 1 )
        assert( packageDataB.numReleases.toNumber() === 2 )
        assert( packageDataC.numReleases.toNumber() === 3 )

        const allReleaseHashes = await packageIndex.getAllReleaseHashes();

        assert(allReleaseHashes['0'] === releaseHashA);
        assert(allReleaseHashes['1'] === releaseHashB);
        assert(allReleaseHashes['2'] === releaseHashC);
        assert(allReleaseHashes['3'] === releaseHashD);
        assert(allReleaseHashes['4'] === releaseHashE);
        assert(allReleaseHashes['5'] === releaseHashF);

        // Misc getters
        const numPackages = await packageIndex.getNumPackages();
        assert(numPackages.toNumber() === 3);

        const releaseHashAtZero = await packageIndex.getReleaseHash(0);
        assert(releaseHashAtZero === releaseHashA);

        const packageNameAtZero = await packageIndex.getPackageName(0);
        assert(packageNameAtZero === 'test-a');
      });

      it('checks latest releases (prerelease)', async function(){
        const releaseInfoA = ['test', 0, 0, 1, 'alpha.0', '', 'ipfs://a']
        const releaseInfoB = ['test', 0, 0, 2, '', '', 'ipfs://a']
        const releaseInfoC = ['test', 0, 0, 1, 'alpha.1', '', 'ipfs://a']

        await packageIndex.release(...releaseInfoA)
        await packageIndex.release(...releaseInfoB)
        await packageIndex.release(...releaseInfoC)

        assert( await packageIndex.releaseExists(...releaseInfoA.slice(0, -1)))
        assert( await packageIndex.releaseExists(...releaseInfoB.slice(0, -1)))
        assert( await packageIndex.releaseExists(...releaseInfoC.slice(0, -1)))
      })
    });

    describe('getAllReleaseIds', function(){
      let releaseHashA;
      let releaseHashB;
      let releaseHashC;

      const releaseInfoA = ['test-r', 1, 2, 3, 't', 'u', 'ipfs://some-ipfs-uri']
      const releaseInfoB = ['test-r', 2, 3, 4, 'v', 'y', 'ipfs://some-other-ipfs-uri']
      const releaseInfoC = ['test-r', 3, 4, 5, 'w', 'q', 'ipfs://yet-another-ipfs-uri']

      beforeEach(async function(){
        nameHash = await packageDB.hashName('test-r');

        const versionHashA = await releaseDB.hashVersion(...releaseInfoA.slice(1, -1))
        const versionHashB = await releaseDB.hashVersion(...releaseInfoB.slice(1, -1))
        const versionHashC = await releaseDB.hashVersion(...releaseInfoC.slice(1, -1))

        releaseHashA = await releaseDB.hashRelease(nameHash, versionHashA)
        releaseHashB = await releaseDB.hashRelease(nameHash, versionHashB)
        releaseHashC = await releaseDB.hashRelease(nameHash, versionHashC)

        await packageIndex.release(...releaseInfoA)
        await packageIndex.release(...releaseInfoB)
        await packageIndex.release(...releaseInfoC)
      })

      it('returns ([],0) for a non-existent release', async() => {
        const limit = 20;
        const result = await packageIndex.getAllReleaseIds('test-none', 0, limit);

        assert(Array.isArray(result.releaseIds));
        assert(result.releaseIds.length === 0);
        assert(result.offset.toNumber() === 0)
      });

      it('returns ([],offset) when offset equals # of releases', async()=>{
        const limit = 20;
        const packageData = await packageIndex.getPackageData('test-r');
        const numReleases = packageData.numReleases.toNumber();
        assert(numReleases === 3 );

        const offset = numReleases;
        const result = await packageIndex.getAllReleaseIds('test-r', offset, limit);

        assert(Array.isArray(result.releaseIds));
        assert(result.releaseIds.length === 0);
        assert(result.offset.toNumber() === offset)
      });

      it('returns ([],0) when limit param is zero', async()=> {
        const result = await packageIndex.getAllReleaseIds('test-r',0,0);

        assert(Array.isArray(result.releaseIds));
        assert(result.releaseIds.length === 0);
        assert(result.offset.toNumber() === 0)
      });

      it('returns ([allReleaseIds], limit) when limit is greater than # of releases', async function(){
        const packageData = await packageIndex.getPackageData('test-r');
        assert(packageData.numReleases.toNumber() === 3 );

        const limit = packageData.numReleases.toNumber() + 1;
        const result = await packageIndex.getAllReleaseIds('test-r', 0, limit);

        assert(result.offset.toNumber() === packageData.numReleases.toNumber());
        assert(result.releaseIds.length === packageData.numReleases.toNumber());
        assert(result.releaseIds.includes(releaseHashA));
        assert(result.releaseIds.includes(releaseHashB));
        assert(result.releaseIds.includes(releaseHashC));
      });

      it('returns releases and offset when limit is < # of releases', async function(){
        const packageData = await packageIndex.getPackageData('test-r');
        const numReleases = packageData.numReleases.toNumber();
        assert(numReleases === 3 );

        const limit = 2;
        const resultA = await packageIndex.getAllReleaseIds('test-r', 0, limit);

        // Initial results (2)
        assert(resultA.releaseIds.length === limit);
        assert(resultA.offset.toNumber() === limit);

        const resultB = await packageIndex.getAllReleaseIds('test-r', resultA.offset, limit);

        // Remaining results (1)
        assert(resultB.releaseIds.length === numReleases - limit);
        assert(resultB.offset.toNumber() === numReleases);

        const resultC = await packageIndex.getAllReleaseIds('test-r', resultB.offset, limit);

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
        const packageData = await packageIndex.getPackageData('test-r');
        const numReleases = packageData.numReleases.toNumber();
        assert(numReleases === 3 );

        const limit = numReleases;
        await releaseDB.removeRelease(releaseHashB, 'because');

        const resultA = await packageIndex.getAllReleaseIds('test-r', 0, limit);
        const offsetA = resultA.offset.toNumber();

        // Initial results (2)
        assert(resultA.releaseIds.length === limit - 1);
        assert(offsetA === limit - 1);
        assert(!resultA.releaseIds.includes(releaseHashB));

        const resultB = await packageIndex.getAllReleaseIds('test-r', offsetA, limit);

        // Empty results, terminal index
        assert(resultB.releaseIds.length === 0);
        assert(resultB.offset.toNumber() === offsetA);
      });
    });

    describe('Ownership [ @geth ]', function(){
      const info = ['test-a', 1, 2, 3, '', '', 'ipfs://some-ipfs-uri'];
      const owner = accounts[0];
      const newOwner = accounts[1];
      const notOwner = accounts[2];
      const name = info[0];

      beforeEach(async () => {
        assert( await packageIndex.packageExists(name) === false );
      })

      it('should transfer ownership', async function(){
        await packageIndex.release(...info, {from: owner});

        let packageData = await packageIndex.getPackageData(name);
        assert(packageData.packageOwner === owner);

        await packageIndex.transferPackageOwner(name, newOwner);

        packageData = await packageIndex.getPackageData(name);
        assert(packageData.packageOwner === newOwner);
      });

      it('should not transfer package owned by null address', async function(){
        assert( await packageIndex.packageExists(name) === false );

        await assertFailure(
          packageIndex.transferPackageOwner(name, newOwner),
          'package-not-found'
        )
      });

      it('should not transfer package which is not owned by sender', async function(){
        await packageIndex.release(...info, {from: owner});

        let packageData = await packageIndex.getPackageData(name);
        assert(packageData.packageOwner === owner);

        await packageIndex.transferPackageOwner(name, newOwner, {from: notOwner});

        packageData = await packageIndex.getPackageData(name);
        assert(packageData.packageOwner === owner);
      });
    });
  });
});
