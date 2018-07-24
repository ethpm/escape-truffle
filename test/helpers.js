const assert = require('assert');

module.exports = {

  // Contants
  constants: {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    zeroBytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },

  // Methods
  now: () => Math.floor(Date.now() / 1000),
  waitSecond: async() => new Promise(a => setTimeout(() => a(), 1000)),

  // Status check: transactions
  assertFailure: async (promise, reason) => {
    try {
      await promise;
      assert.fail();
    } catch(err){
      assert(err.receipt && parseInt(err.receipt.status) === 0);

      if (err.reason){
        assert(err.reason.includes(reason), `Expected reason: "${err.reason}"`);
      }
    }
  },

  // There's variant behavior across three clients when a require gate fails during a `.call`
  // + ganache-cli > 6.1.3 / geth : if require contains reason string - no failure, null result.
  // + testrpc-sc (coverage) : errors with a revert message
  // + geth (no reason string): response that web3 doesn't handle correctly.
  assertCallFailure: async (promise, expectedResult) => {
    let result;
    try {
      result = await promise;
      assert.fail();
    } catch(err){

      // testrpc-sc (ganache 6.1.0)
      if (process.env.SOLIDITY_COVERAGE) {
        assert(err.message.includes('revert'))

      // ganache 6.1.4 & geth (should) return a null, false, zero result
      // for all the return args
      } else if (process.env.NETWORK === 'ganache' || process.env.NETWORK === 'geth') {
        assert(result === expectedResult || err.message.includes('0x'));
      }
    }
  },

  setPermissions: async function(authority, packageIndex, packageDB, releaseDB, releaseValidator){
    await packageIndex.setAuthority(authority.address);
    await packageDB.setAuthority(authority.address);
    await releaseDB.setAuthority(authority.address);

    await packageIndex.setPackageDb(packageDB.address);
    await packageIndex.setReleaseDb(releaseDB.address);
    await packageIndex.setReleaseValidator(releaseValidator.address);

    // ReleaseDB
    const setVersion = releaseDB
      .abi
      .find(item => item.name === 'setVersion')
      .signature;

    const setRelease = releaseDB
      .abi
      .find(item => item.name === 'setRelease')
      .signature;

    const updateLatestTree = releaseDB
      .abi
      .find(item => item.name === 'updateLatestTree')
      .signature;

    // PackageDB
    const setPackage = packageDB
      .abi
      .find(item => item.name === 'setPackage')
      .signature;

    const setPackageOwner = packageDB
      .abi
      .find(item => item.name === 'setPackageOwner')
      .signature;

    // PackageIndex
    const release = packageIndex
      .abi
      .find(item => item.name === 'release')
      .signature;


    const transferPackageOwner = packageIndex
      .abi
      .find(item => item.name === 'transferPackageOwner')
      .signature;

    // ReleaseDB
    await authority.setCanCall(
      packageIndex.address,
      releaseDB.address,
      setRelease,
      true
    );

    await authority.setAnyoneCanCall(
      releaseDB.address,
      setVersion,
      true
    );

    await authority.setAnyoneCanCall(
      releaseDB.address,
      updateLatestTree,
      true
    );

    // PackageDB
    await authority.setCanCall(
      packageIndex.address,
      packageDB.address,
      setPackage,
      true
    );

    await authority.setCanCall(
      packageIndex.address,
      packageDB.address,
      setPackageOwner,
      true
    );

    // PackageIndex
    await authority.setAnyoneCanCall(
      packageIndex.address,
      release,
      true
    );

    await authority.setAnyoneCanCall(
      packageIndex.address,
      transferPackageOwner,
      true
    );
  },
}