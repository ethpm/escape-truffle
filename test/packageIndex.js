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

contract('ReleaseDB', function(accounts){
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
    lockfileUri,
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

    assert( releaseData.major === major.toString() );
    assert( releaseData.minor === minor.toString() );
    assert( releaseData.patch === patch.toString() );
    assert( releaseData.preRelease === preRelease.toString() );
    assert( releaseData.build === build );
    assert( releaseData.releaseLockfileURI === lockfileUri );
    assert( releaseData.createdAt === timestamp.toString() );
    assert( releaseData.updatedAt === timestamp.toString() );
  }


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

  it('should retrieve release by index', async function(){
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

  it('should retrieve the lockfile Uri', async function(){
    const releaseInfo = ['test', 2, 3, 4, 'c', 'e', 'ipfs://some--ipfs-uri']

    const versionHash = await releaseDB.hashVersion(...releaseInfo.slice(1, -1))
    const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)

    await packageIndex.release(...releaseInfo)
    const lockfileUri = await packageIndex.getReleaseLockfileURI(...releaseInfo.slice(0, -1))
    assert(lockfileUri === releaseInfo.pop())
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
    assert(packageData.numReleases === '3' );

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

    assert( packageDataA.numReleases == '1' )
    assert( packageDataB.numReleases == '2' )
    assert( packageDataC.numReleases == '3' )

    allReleaseHashes = await packageIndex.getAllReleaseHashes();

    assert(allReleaseHashes['0'] === releaseHashA);
    assert(allReleaseHashes['1'] === releaseHashB);
    assert(allReleaseHashes['2'] === releaseHashC);
    assert(allReleaseHashes['3'] === releaseHashD);
    assert(allReleaseHashes['4'] === releaseHashE);
    assert(allReleaseHashes['5'] === releaseHashF);
  })
});