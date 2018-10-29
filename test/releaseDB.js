/**
 * @author              Piper Merriam  - originally written in Python for ethpm/escape
 * @js-translation.     cgewecke
 */

const helpers = require('./helpers');
const constants = helpers.constants;
const assertFailure = helpers.assertFailure;
const assertCallFailure = helpers.assertCallFailure;

const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');

contract('ReleaseDB', function(accounts){
  let packageDB;
  let releaseDB;
  let nameHash;

  const v100 = ['test', '1.0.0'];
  const v124 = ['test', '1.2.4'];

  const versions = [
    v100,
    v124
  ];

  // Version hashes
  let v100vh;
  let v124vh;

  // Release hashes
  let v100h;
  let v124h;

  before(async() => {
    releaseDB = await ReleaseDB.new();
    packageDB = await PackageDB.new();
    nameHash = await packageDB.hashName('test');

    for (let version of versions){
      await releaseDB.setVersion(version[1]);
    }

    v100vh = await releaseDB.hashVersion(v100[1]);
    v124vh = await releaseDB.hashVersion(v124[1])

    v100h = await releaseDB.hashRelease(nameHash, v100vh)
    v124h = await releaseDB.hashRelease(nameHash, v124vh)
  });

  describe('Releases', function(){

    it('releases versions', async function(){

      await releaseDB.setRelease(
        nameHash,
        v100vh,
        'ipfs://some-ipfs-uri-h'
      );

      await releaseDB.setRelease(
        nameHash,
        v124vh,
        'ipfs://some-ipfs-uri-h'
      );

      const numReleases = await releaseDB.getNumReleasesForNameHash(nameHash);
      assert( numReleases.toNumber() === 2 )
    });

    it('updates a version', async function(){
      const newUri = 'ipfs://updated-ipfs-uri-h';

      await releaseDB.setRelease(
        nameHash,
        v124vh,
        'ipfs://updated-ipfs-uri-h'
      );

      const numReleases = await releaseDB.getNumReleasesForNameHash(nameHash);
      assert( numReleases.toNumber() === 2 );
      assert( await releaseDB.getManifestURI(v124h) === newUri );

      const events = await releaseDB.getPastEvents('ReleaseUpdate', {fromBlock: 0, toBlock: 'latest'});
      assert(events.length === 1);
      assert(events[0].returnValues.releaseId === v124h);
    })
  });

  describe('Removals', function(){
    it('removes a release', async function(){
      let numReleases = await releaseDB.getNumReleasesForNameHash(nameHash);
      assert( numReleases.toNumber() === 2 )

      await releaseDB.removeRelease(v100h, 'testing');

      numReleases = await releaseDB.getNumReleasesForNameHash(nameHash);
      assert( numReleases.toNumber() === 1 )
      assert( await releaseDB.releaseExists(v100h) === false )
    });

    it('throws when removing a release that does not exit', async function(){
      assert( await releaseDB.releaseExists(v100h) === false );

      await assertFailure(
        releaseDB.removeRelease(v100h, 'testing'),
        'release-not-found'
      );
    });
  });

  describe('Getters [ @geth ]', function(){
    let nameHash;
    let versionHash;
    let badVersionHash;
    let releaseHash;
    let owner = accounts[1];

    before(async () => {
      nameHash = await packageDB.hashName('test-getters')
      versionHash = await releaseDB.hashVersion('1.2.3.beta.1.build.abcd1234')
      releaseHash = await releaseDB.hashRelease(nameHash, versionHash);

      badVersionHash = await releaseDB.hashVersion('2.2.2');
      badReleaseHash = await releaseDB.hashRelease(nameHash, badVersionHash);
    });

    it('has correct values', async function(){
      await releaseDB.setVersion('1.2.3.beta.1.build.abcd1234');
      assert(await releaseDB.releaseExists(releaseHash) === false );

      await releaseDB.setRelease(
        nameHash,
        versionHash,
        'ipfs://some-ipfs-uri'
      );

      assert( await releaseDB.releaseExists(releaseHash) === true )

      const releaseData = await releaseDB.getReleaseData(releaseHash);

      assert( releaseData.nameHash  === nameHash )
      assert( releaseData.versionHash === versionHash )

      assert( await releaseDB.getManifestURI(releaseHash) == 'ipfs://some-ipfs-uri' );
    });

    it('errors when getting non-existent version', async function(){
      try {
        await releaseDB.getVersion(badVersionHash);
        assert.fail();
      } catch (err) {
        assert(err.toString().includes('string'));
      }
    });
  });
});
