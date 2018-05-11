const assert = require('assert');

module.exports = {

  // Contants
  constants: {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    zeroBytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },

  // Methods
  assertFailure: async (promise) => {
    try {
      await promise;
      assert.fail();
    } catch(err){
      assert(err.receipt && parseInt(err.receipt.status) === 0);
    }
  },
}