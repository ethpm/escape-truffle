/**
 * Methods for instantiating the FIFSRegistrar and ENS contracts deployed to Ropsten.
 *
 * Source modified from: https://github.com/ensdomains/ens/blob/master/ensutils-testnet.js
 */

const ensABI = require("./abis/ens");
const fifsABI = require("./abis/fifs");
const resolverABI = require("./abis/resolver");
const namehash = require('eth-ens-namehash');

//------------------------------------ Addresses ---------------------------------------------------

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const ROPSTEN_ENS_ADDRESS = '0x112234455c3a32fd11230c42e7bccd4a84e02010';
const ROPSTEN_RESOLVER_ADDRESS = '0x4c641fb9bad9b60ef180c31f56051ce826d21a9a';

//------------------------------------- Instances ------------------------------------------------

const getRopstenENSInstance = function(web3){
  return new web3.eth.Contract(ensABI, ROPSTEN_ENS_ADDRESS);
}

const getRopstenTestRegistrarInstance = async function(web3){
  try {
    const hash = namehash.hash('test');
    const ens = new web3.eth.Contract(ensABI, ROPSTEN_ENS_ADDRESS);
    const ROPSTEN_FIFS_ADDRESS = await ens.methods.owner(hash).call();

    return new web3.eth.Contract(fifsABI, ROPSTEN_FIFS_ADDRESS);
  } catch (err){
    console.log(err)
  }
}

const getRopstenResolverInstance = function(web3){
    return new web3.eth.Contract(resolverABI, ROPSTEN_RESOLVER_ADDRESS)
}


module.exports = {
  getRopstenENSInstance: getRopstenENSInstance,
  getRopstenTestRegistrarInstance: getRopstenTestRegistrarInstance,
  getRopstenResolverInstance: getRopstenResolverInstance
}
