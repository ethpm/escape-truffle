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
      assert(err.receipt && !err.receipt.status);

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

  setPermissions: setPermissions,
}
