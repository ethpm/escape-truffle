const assert = require('assert');
const setPermissions = require('../config/permissions');

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
  // + ganache-cli > 6.1.3: if require contains reason string, there's no failure.
  // + testrpc-sc (coverage) : errors with a revert message
  // + geth: response that web3 doesn't handle correctly.
  assertCallFailure: async (promise) => {
    let result;
    try {
      await promise;
      assert.fail();
    } catch(err){

      // testrpc-sc (ganache 6.1.0)
      if (process.env.SOLIDITY_COVERAGE) {

        assert(err.message.includes('revert'))

      // geth: weird web3 error
      // we'd also see this with newer ganache if there is no reason string
      } else if (process.env.GETH) {

        assert(err.message.includes('0x'));
      }
    }
  },

  setPermissions: setPermissions,
}