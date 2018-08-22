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
const PackageRegistry = artifacts.require('PackageRegistry');
const ReleaseValidator = artifacts.require('ReleaseValidator');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');

contract('ReleaseValidator', function(accounts){
  let packageDB;
  let releaseDB;
  let packageRegistry;
  let releaseValidator;
  let authority
  let nameHash;

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
  });

  describe('Overwriting', function(){

    async function assertNotReRelease(
      info,
      packageRegistry,
      packageDB,
      releaseDB,
      reason
    ){
      const nameHash = await packageDB.hashName(info[0])
      const versionHash = await releaseDB.hashVersion(info[1]);
      const releaseHash = await releaseDB.hashRelease(nameHash, versionHash)

      assert( await packageRegistry.packageExists(info[0]) === false );
      await packageRegistry.release(...info);
      assert( await packageRegistry.packageExists(info[0]) === true );

      let packageData = await packageRegistry.getPackageData(info[0]);
      let releaseData = await packageRegistry.getReleaseData(releaseHash);

      assert(packageData.numReleases.toNumber() === 1);
      assert(releaseData.manifestURI === uri)

      info.pop();
      info.push(otherUri);

      await assertFailure(
        packageRegistry.release(...info),
        reason
      );

      packageData = await packageRegistry.getPackageData(info[0]);
      releaseData = await packageRegistry.getReleaseData(releaseHash);

      assert(packageData.numReleases.toNumber() === 1);
      assert(releaseData.manifestURI === uri);
    };

    const uri = 'ipfs://some-ipfs-uri';
    const otherUri = 'ipfs://some-other-ipfs-uri';

    const releases = {
      zeroLengthVersion: ['test', '', uri],
      zeroLengthManifest: ['test', '1.0.0', ''],
      valid:  ['test', '0.1.0',  uri],
    };

    it('should not release with a zero length version string', async function(){
      assert( await packageRegistry.packageExists('test') === false );

      await assertFailure(
        packageRegistry.release(...releases.zeroLengthVersion),
        'invalid-release-version'
      );

      assert( await packageRegistry.packageExists('test') === false );
    });

    it('should not release with a zero length manifestURI field', async function(){
      assert( await packageRegistry.packageExists('test') === false );

      await assertFailure(
        packageRegistry.release(...releases.zeroLengthManifest),
        'invalid-manifest-uri'
      );

      assert( await packageRegistry.packageExists('test') === false );
    })

    it('should not re-release', async function(){
      await assertNotReRelease(
        releases.valid,
        packageRegistry,
        packageDB,
        releaseDB,
        'version-exists',
      );
    });
  });

  describe('PackageNames', function(){
    const info = ['name', '1.0.0', 'ipfs://some-ipfs-uri'];

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

    async function assertReleases(packageRegistry, info){
      const name = info[0];

      assert( await packageRegistry.packageExists(name) === false);
      await packageRegistry.release(...info);
      assert( await packageRegistry.packageExists(name) === true);
    }

    async function assertDoesNotRelease(packageRegistry, info, reason){
      const name = info[0];

      assert( await packageRegistry.packageExists(name) === false);

      await assertFailure(
        packageRegistry.release(...info),
        reason
      );

      assert( await packageRegistry.packageExists(name) === false);
    }

    describe('valid', function(){
      it('aa', async function(){
        info[0] = cases.aa;
        await assertReleases(packageRegistry, info);
      })

      it('a * 255', async function(){
        info[0] = cases.a255;
        await assertReleases(packageRegistry, info);
      })

      it('contains-dashes', async function(){
        info[0] = cases.dashes;
        await assertReleases(packageRegistry, info);
      })

      it('contains-1234567890-numbers', async function(){
        info[0] = cases.numbers;
        await assertReleases(packageRegistry, info);
      });

      it('contains-abcdefghijklmnopqrstuvwxyz-1234567890-all-allowed-chars', async function(){
        info[0] = cases.allAllowed;
        await assertReleases(packageRegistry, info);
      });
    });

    describe('invalid', function(){
      it('a', async function(){
        info[0] = cases.a;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      });

      it('a * 256', async function(){
        info[0] = cases.a256;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('-starts-with-dash', async function(){
        info[0] = cases.startsDash;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('9starts-with-number', async function(){
        info[0] = cases.startsNumber;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('hasCapitals', async function(){
        info[0] = cases.hasCaps;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('Starts-with-capital', async function(){
        info[0] = cases.startsCaps;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('with_underscore', async function(){
        info[0] = cases.underscore;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('with.period', async function(){
        info[0] = cases.period;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('with$money-symbol', async function(){
        info[0] = cases.dollar;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })

      it('with()parenthesis', async function(){
        info[0] = cases.parens;
        await assertDoesNotRelease(packageRegistry, info, 'invalid-package-name');
      })
    });
  });

  describe('ValidateRelease checks existence of DBs [ @geth ]', function(){
    it('returns false if PackageDB param is null', async function(){
      const info = ['test', '1.0.0', 'ipfs://some-ipfs-uri'];

      assert( await packageRegistry.packageExists('test') === false );

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
          info[1],
          info[2],
          {from: accounts[3]}
        ),
        false
      );
    });

    it('returns false if ReleaseDB is null', async function(){
      const info = ['test', '1.0.0', 'ipfs://some-ipfs-uri'];

      assert( await packageRegistry.packageExists('test') === false );

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
          info[1],
          info[2]
        ),
        false
      );
    });
  });

  describe('Ownership', function(){
    it('only releases for the package owner', async function(){
      const newOwner = accounts[1];
      const nonOwner = accounts[2];

      const infoA = ['test', '1.0.0', 'ipfs://some-ipfs-uri'];
      const infoB = ['test', '1.1.0', 'ipfs://some-ipfs-uri'];

      assert( await packageRegistry.releaseExists(infoA[0], infoA[1]) === false );
      await packageRegistry.release(...infoA);
      assert( await packageRegistry.releaseExists(infoA[0], infoA[1]) === true );

      await packageRegistry.transferPackageOwner('test', newOwner);
      const data = await packageRegistry.getPackageData('test');
      assert(data.packageOwner === newOwner);

      assert( await packageRegistry.releaseExists(infoB[0], infoB[1]) === false );

      await assertFailure(
        packageRegistry.release(...infoB, {from: nonOwner}),
        'caller-not-authorized'
      );

      assert( await packageRegistry.releaseExists(infoB[0], infoB[1]) === false );
    });
  })
});
