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
const PackageIndex = artifacts.require('PackageIndex');
const ReleaseValidator = artifacts.require('ReleaseValidator');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');

contract('ReleaseValidator', function(accounts){
  let packageDB;
  let releaseDB;
  let packageIndex;
  let releaseValidator;
  let authority
  let nameHash;

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
  });

  describe('Overwriting', function(){

    async function assertNotReRelease(
      info,
      packageIndex,
      packageDB,
      releaseDB,
      reason
    ){
      const nameHash = await packageDB.hashName(info[0])
      const versionHash = await releaseDB.hashVersion(...info.slice(1, -1));
      const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)

      assert( await packageIndex.packageExists(info[0]) === false );
      await packageIndex.release(...info);
      assert( await packageIndex.packageExists(info[0]) === true );

      let packageData = await packageIndex.getPackageData(info[0]);
      let releaseData = await packageIndex.getReleaseData(releaseHash);

      assert(packageData.numReleases.toNumber() === 1);
      assert(releaseData.manifestURI === uri)

      info.pop();
      info.push(otherUri);

      await assertFailure(
        packageIndex.release(...info),
        reason
      );

      packageData = await packageIndex.getPackageData(info[0]);
      releaseData = await packageIndex.getReleaseData(releaseHash);

      assert(packageData.numReleases.toNumber() === 1);
      assert(releaseData.manifestURI === uri);
    };

    const uri = 'ipfs://some-ipfs-uri';
    const otherUri = 'ipfs://some-other-ipfs-uri';

    const releases = {
      zero:       ['test', 0, 0, 0, '', '', uri],
      zeroMinor:  ['test', 0, 1, 0, '', '', uri],
      zeroPatch:  ['test', 0, 0, 1, '', '', uri],
      major:      ['test', 1, 0, 0, '', '', uri ],
      minor:      ['test', 1, 1, 0, '', '', uri ],
      patch:      ['test', 1, 1, 1, '', '', uri ],
      prerelease: ['test', 1, 1, 1, 'beta.1', '', uri ]
    };

    it('should not release 0, 0, 0 [ @geth ]', async function(){
      const info = releases.zero;
      assert( await packageIndex.packageExists(info[0]) === false );

      await assertFailure(
        packageIndex.release(...info),
        'invalid-release-version'
      );

      assert( await packageIndex.packageExists(info[0]) === false );
      assert( await packageIndex.releaseExists(...info.slice(0,-1)) === false);
    });

    it('should not re-release: 0, 1, 0,', async function(){
      await assertNotReRelease(
        releases.zeroMinor,
        packageIndex,
        packageDB,
        releaseDB,
        'version-previously-published',
      );
    });

    it('should not re-release: 0, 0, 1', async function(){
      await assertNotReRelease(
        releases.zeroPatch,
        packageIndex,
        packageDB,
        releaseDB,
        'version-previously-published',
      );
    });

    it('should not re-release: 1, 0, 0,', async function(){
      await assertNotReRelease(
        releases.major,
        packageIndex,
        packageDB,
        releaseDB,
        'version-previously-published',
      );
    });

    it('should not re-release: 1, 1, 0,', async function(){
      await assertNotReRelease(
        releases.minor,
        packageIndex,
        packageDB,
        releaseDB,
        'version-previously-published',
      );
    });

    it('should not re-release: 1, 1, 1,', async function(){
      await assertNotReRelease(
        releases.patch,
        packageIndex,
        packageDB,
        releaseDB,
        'version-previously-published',
      );
    });

    it('should not re-release: 1, 1, 1, beta.1', async function(){
      await assertNotReRelease(
        releases.prerelease,
        packageIndex,
        packageDB,
        releaseDB,
        'version-previously-published',
      );
    });

    it('should not re-release a version that has been removed from the ReleaseDB', async function(){
      const info = ['test', 2, 0, 0, '', '', uri];

      const nameHash = await packageDB.hashName(info[0])
      const versionHash = await releaseDB.hashVersion(...info.slice(1, -1));
      const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)

      assert( await packageIndex.releaseExists(...info.slice(0,-1)) === false );
      await packageIndex.release(...info);
      assert( await packageIndex.releaseExists(...info.slice(0,-1)) === true );

      let packageData = await packageIndex.getPackageData(info[0]);
      let releaseData = await packageIndex.getReleaseData(releaseHash);

      assert(packageData.numReleases.toNumber() === 1);
      assert(releaseData.manifestURI === uri)

      await releaseDB.removeRelease(releaseHash, 'testing');
      assert( await packageIndex.releaseExists(...info.slice(0,-1)) === false );

      await assertFailure(
        packageIndex.release(...info),
        'version-previously-published',
      );

      packageData = await packageIndex.getPackageData(info[0]);
      assert(packageData.numReleases.toNumber() === 0);
    });

  });

  describe('Backfilling', function(){

    async function assertBackfills(
      original,
      backfill,
      packageIndex,
      packageDB,
      releaseDB
    ){
      const name = original[0];

      assert( await packageIndex.packageExists(name) === false );
      assert( await packageIndex.releaseExists(...original.slice(0,-1)) === false );
      assert( await packageIndex.releaseExists(...backfill.slice(0,-1)) === false );

      await packageIndex.release(...original);

      assert( await packageIndex.packageExists(name) === true )
      assert( await packageIndex.releaseExists(...original.slice(0,-1)) === true );
      assert( await packageIndex.releaseExists(...backfill.slice(0,-1)) === false );

      let packageData = await packageIndex.getPackageData(name);
      assert( packageData.numReleases.toNumber() === 1 );

      await packageIndex.release(...backfill);

      assert( await packageIndex.packageExists(name) === true )
      assert( await packageIndex.releaseExists(...original.slice(0,-1)) === true );
      assert( await packageIndex.releaseExists(...backfill.slice(0,-1)) === true );

      packageData = await packageIndex.getPackageData(name);
      assert( packageData.numReleases.toNumber() === 2 );

    }

    async function assertPreservesOrder(
      original,
      backfill,
      packageDB,
      releaseDB,
      treeType,
    ){
      let isLatest;
      let notLatest;
      const originalNameHash = await packageDB.hashName(original[0]);
      const originalVersionHash = await releaseDB.hashVersion(...original.slice(1, -1));

      const backfillNameHash = await packageDB.hashName(backfill[0]);
      const backfillVersionHash = await releaseDB.hashVersion(...backfill.slice(1, -1));

      switch(treeType){
        case 'major':
          isLatest = await releaseDB.isLatestMajorTree(originalNameHash, originalVersionHash)
          notLatest = await releaseDB.isLatestMajorTree(backfillNameHash, backfillVersionHash);
          assert(isLatest);
          assert.isNotOk(notLatest);
          break;
        case 'minor':
          isLatest = await releaseDB.isLatestMinorTree(originalNameHash, originalVersionHash)
          notLatest = await releaseDB.isLatestMinorTree(backfillNameHash, backfillVersionHash);
          assert(isLatest);
          assert.isNotOk(notLatest);
          break;
        case 'patch':
          isLatest = await releaseDB.isLatestPatchTree(originalNameHash, originalVersionHash)
          notLatest = await releaseDB.isLatestPatchTree(backfillNameHash, backfillVersionHash);
          assert(isLatest);
          assert.isNotOk(notLatest);
          break;
        case 'prerelease':
          isLatest = await releaseDB.isLatestPreReleaseTree(originalNameHash, originalVersionHash)
          notLatest = await releaseDB.isLatestPreReleaseTree(backfillNameHash, backfillVersionHash);
          assert(isLatest);
          assert.isNotOk(notLatest);
          break;
        default:
          assert.fail('Missing tree type in test');
      }
    }

    const uri = 'ipfs://some-ipfs-uri';

    const originals = {
      major:      ['test', 2, 0, 0, '', '', uri ],
      minor:      ['test', 1, 2, 0, '', '', uri ],
      patch:      ['test', 1, 0, 2, '', '', uri ],
      alpha:      ['test', 1, 0, 0, 'alpha.10', '', uri ],
      beta:       ['test', 1, 0, 0, 'beta.10', '', uri ],
    }

    const backfills = {
      major:      ['test', 1, 0, 0, '', '', uri ],
      minor:      ['test', 1, 1, 0, '', '', uri ],
      patch:      ['test', 1, 0, 1, '', '', uri ],
      alpha:      ['test', 1, 0, 0, 'alpha', '', uri ],
      alpha1:     ['test', 1, 0, 0, 'alpha.1', '', uri ],
      alpha2:     ['test', 1, 0, 0, 'alpha.2', '', uri ],
      alpha11:    ['test', 1, 0, 0, 'alpha.11', '', uri ],
    }

    it('should backfill: major: 2.0.0 --> 1.0.0', async function(){
      await assertBackfills(
        originals.major,
        backfills.major,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.major,
        backfills.major,
        packageDB,
        releaseDB,
        'major'
      )
    })

    it('should backfill: minor: 1.2.0 --> 1.1.0', async function(){
      await assertBackfills(
        originals.minor,
        backfills.minor,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.minor,
        backfills.minor,
        packageDB,
        releaseDB,
        'minor'
      )
    });

    it('should backfill: patch: 1.0.2 --> 1.0.1', async function(){
      await assertBackfills(
        originals.patch,
        backfills.patch,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.patch,
        backfills.patch,
        packageDB,
        releaseDB,
        'patch'
      )
    });

    it('should backfill: prerelease: 1.0.0.alpha.10 --> 1.0.0.alpha', async function(){
      await assertBackfills(
        originals.alpha,
        backfills.alpha,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.alpha,
        backfills.alpha,
        packageDB,
        releaseDB,
        'prerelease'
      )
    });

    it('should backfill: prerelease: 1.0.0.alpha.10 --> 1.0.0.alpha.1', async function(){
      await assertBackfills(
        originals.alpha,
        backfills.alpha1,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.alpha,
        backfills.alpha1,
        packageDB,
        releaseDB,
        'prerelease'
      )
    });

    it('should backfill: prerelease: 1.0.0.alpha.10 --> 1.0.0.alpha.2', async function(){
      await assertBackfills(
        originals.alpha,
        backfills.alpha2,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.alpha,
        backfills.alpha2,
        packageDB,
        releaseDB,
        'prerelease'
      )
    });

    it('should backfill: prerelease: 1.0.0.beta.10 --> 1.0.0.alpha.11', async function(){
      await assertBackfills(
        originals.beta,
        backfills.alpha11,
        packageIndex,
        packageDB,
        releaseDB
      );

      await assertPreservesOrder(
        originals.beta,
        backfills.alpha11,
        packageDB,
        releaseDB,
        'prerelease'
      )
    });
  });

  describe('PackageNames', function(){
    const info = ['name', 1, 0, 0, '', '', 'ipfs://some-ipfs-uri'];

    const cases = {
      // Good
      aa: 'aa',
      a255: 'a'.repeat(255),
      dashes: 'contains-dashes',
      numbers: 'contains-1234567890-numbers',
      allAllowed: 'contains-abcdefghijklmnopqrstuvwxyz-1234567890-all-allowed-chars',
      // Bad
      a: 'a',
      a256: 'a'.repeat(256),
      startsDash: '-starts-with-dash',        // starts with a dash
      startsNumber: '9starts-with-number',    // starts with a number
      hasCaps: 'hasCapitals',                // capital letters.
      startsCaps: 'Starts-with-capital',     // starts with capital letters.
      underscore: 'with_underscore',         // contains an underscore
      period: 'with.period',                 // contains a period
      dollar: 'with$money-symbol',           // contains a $
      parens: 'with()parenthesis',           // contains parenthesis
    }

    async function assertReleases(packageIndex, info){
      const name = info[0];

      assert( await packageIndex.packageExists(name) === false);
      await packageIndex.release(...info);
      assert( await packageIndex.packageExists(name) === true);
    }

    async function assertDoesNotRelease(packageIndex, info, reason){
      const name = info[0];

      assert( await packageIndex.packageExists(name) === false);

      await assertFailure(
        packageIndex.release(...info),
        reason
      );

      assert( await packageIndex.packageExists(name) === false);
    }

    describe('valid', function(){
      it('aa', async function(){
        info[0] = cases.aa;
        await assertReleases(packageIndex, info);
      })

      it('a * 255', async function(){
        info[0] = cases.a255;
        await assertReleases(packageIndex, info);
      })

      it('contains-dashes', async function(){
        info[0] = cases.dashes;
        await assertReleases(packageIndex, info);
      })

      it('contains-1234567890-numbers', async function(){
        info[0] = cases.numbers;
        await assertReleases(packageIndex, info);
      });

      it('contains-abcdefghijklmnopqrstuvwxyz-1234567890-all-allowed-chars', async function(){
        info[0] = cases.allAllowed;
        await assertReleases(packageIndex, info);
      });
    });

    describe('invalid', function(){
      it('a', async function(){
        info[0] = cases.a;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      });

      it('a * 256', async function(){
        info[0] = cases.a256;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('-starts-with-dash', async function(){
        info[0] = cases.startsDash;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('9starts-with-number', async function(){
        info[0] = cases.startsNumber;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('hasCapitals', async function(){
        info[0] = cases.hasCaps;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('Starts-with-capital', async function(){
        info[0] = cases.startsCaps;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('with_underscore', async function(){
        info[0] = cases.underscore;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('with.period', async function(){
        info[0] = cases.period;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('with$money-symbol', async function(){
        info[0] = cases.dollar;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })

      it('with()parenthesis', async function(){
        info[0] = cases.parens;
        await assertDoesNotRelease(packageIndex, info, 'invalid-package-name');
      })
    });
  });

  describe('Manifest', function(){

    it('does not allow an empty manifestURI field', async function(){
      const info = ['test', 1, 0, 0, '', '', ''];

      assert( await packageIndex.packageExists('test') === false );

      await assertFailure(
        packageIndex.release(...info),
        'invalid-manifest-uri'
      );

      assert( await packageIndex.packageExists('test') === false );
    })
  });

  describe('validateRelease checks existence of DBs [ @geth ]', function(){
    it('returns false if PackageDB param is null', async function(){
      const info = ['test', 1, 0, 0, '', '', 'ipfs://some-ipfs-uri'];

      assert( await packageIndex.packageExists('test') === false );

      // NB: we should be able to get the reason string out of this
      // failed call to a view fn but newer ganache (or ethereumjs-vm?)
      // handles this case by returning boolean: false.
      // Geth triggers a strange '0x' / address not found error out of web3 )
      await assertCallFailure(
        releaseValidator.validateRelease(
          helpers.zeroAddress,
          releaseDB.address,
          accounts[0],
          info[0],
          info.slice(1,4),
          info[4],
          info[5],
          info[6],
          {from: accounts[3]}
        ),
        false
      );
    });

    it('returns false if ReleaseDB is null', async function(){
      const info = ['test', 1, 0, 0, '', '', 'ipfs://some-ipfs-uri'];

      assert( await packageIndex.packageExists('test') === false );

      // NB: we should be able to get the reason string out of this
      // failed call to a view fn but newer ganache (or ethereumjs-vm?)
      // handles this case by returning boolean: false.
      // Geth triggers a strange '0x' / address not found error out of web3 )
      await assertCallFailure(
        releaseValidator.validateRelease(
          packageDB.address,
          helpers.zeroAddress,
          accounts[0],
          info[0],
          info.slice(1,4),
          info[4],
          info[5],
          info[6]
        ),
        false
      );
    });
  });

  describe('Ownership', function(){
    it('only releases for the package owner', async function(){
      const newOwner = accounts[1];
      const nonOwner = accounts[2];

      const infoA = ['test', 1, 0, 0, '', '', 'ipfs://some-ipfs-uri'];
      const infoB = ['test', 1, 1, 0, '', '', 'ipfs://some-ipfs-uri'];

      assert( await packageIndex.releaseExists(...infoA.slice(0, -1)) === false );
      await packageIndex.release(...infoA);
      assert( await packageIndex.releaseExists(...infoA.slice(0, -1)) === true );

      await packageIndex.transferPackageOwner('test', newOwner);
      const data = await packageIndex.getPackageData('test');
      assert(data.packageOwner === newOwner);

      assert( await packageIndex.releaseExists(...infoB.slice(0, -1)) === false );

      await assertFailure(
        packageIndex.release(...infoB, {from: nonOwner}),
        'caller-not-authorized'
      );

      assert( await packageIndex.releaseExists(...infoB.slice(0, -1)) === false );
    });
  });
});
