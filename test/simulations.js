/**
 * Tests that generate gas consumption data.
 */

const helpers = require('./helpers');
const constants = helpers.constants;

const IndexedOrderedSetLib = artifacts.require('IndexedOrderedSetLib');
const SemVersionLib = artifacts.require('SemVersionLib');

contract('Gas Simulations', function(){

  it('IndexedOrderedSetLib deployment', async function(){
    await IndexedOrderedSetLib.new();
  });

  it('SemVersionLib deployment', async function(){
    await SemVersionLib.new();
  })
})