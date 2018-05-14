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
  assertFailure: async (promise) => {
    try {
      await promise;
      assert.fail();
    } catch(err){
      assert(err.receipt && parseInt(err.receipt.status) === 0);
    }
  },

  // Revert string check: calls
  assertRevert: async (promise) => {
    try {
      await promise;
      assert.fail();
    } catch(err){
      // Geth errors with a response web3 chokes on :/
      assert(err.message.includes('revert') || err.message.includes('0x'));
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