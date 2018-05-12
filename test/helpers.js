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
      assert(err.message.includes('revert'));
    }
  },
}