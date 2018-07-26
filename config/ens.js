/**
 * This script registers a name specified in .secrets.js to ENS and links it to the
 * address of a PackageIndex registry contract which the user has deployed to Ropsten
 * using `npm run deploy:ropsten`. The contract address is obtained from the project `build`
 * folder. The domain name is registered under the `.test` namespace using Ropsten's
 * "first-in-first-served" registrar.
 *
 * IMPORTANT: THE REGISTERED DOMAIN IS TEMPORARY (28 days). DO NOT USE THIS SCRIPT IN PRODUCTION.
 *
 * Use this if you'd like to test your registry using web3's EthPM package, which
 * allows you to obtain contract artifacts using the following convention:
 *
 * // Example:
 * const SimpleToken = await web3.packaging
 *                               .registry('example.test')
 *                               .getPackage('SimpleToken')
 *                               .getVersion('^1.1.5');
 */

const ensUtils = require('../ens/ropstenENSUtils');
const nameHash = require('eth-ens-namehash');
const assert = require('assert');
const PackageIndex = artifacts.require('PackageIndex');
const log = console.log;

const {
  ENSName
} = require('../config/wallet');

// ------------------------------------- Validators ------------------------------------------------
const validateENSName = function(){
  const msg =
  `ENS name: "${ENSName}" cannot be registered.\n` +
  `* Please configure the ropsten entry for 'ENSName' in '.secrets.js' correctly.\n` +
  `* This script does not support sub-domains (e.g "mypackage.mysubdomain")\n`+
  `* See the EthPM package registry docs for help.\n`

  if (!ENSName || typeof ENSName !== 'string' || ENSName.includes('.')){
    log(msg);
    process.exit(0);
  }
}

const validatePackageIndex = async function(){
  const msg =
  `Unable to locate artifacts for "PackageIndex" contract deployed to Ropsten.\n` +
  `* Have you executed "npm run deploy:ropsten" successfully?\n` +
  `* See the EthPM package registry docs for help.\n`

  try {
    await PackageIndex.deployed();
  } catch (err) {
    log(msg);
    process.exit(0);
  }
}

const validateCanBeRegistered = async function(web3, registrar){
  let time;
  let currentTime = new Date().getTime();

  try {
    time = await registrar
      .methods
      .expiryTimes(web3.utils.sha3(ENSName))
      .call();
  } catch(err){
    log(`Failed to get registrar expiryTimes for "${ENSName}"`);
    log(`Received: ${err}`);
    process.exit(0);
  }

  if ((parseInt(time) * 1000) > currentTime){
    log(`Cannot register "${ENSName}" becauase name is already taken.`)
    log(`Domain will not become available again until ${new Date(parseInt(time) * 1000)}.`);
    process.exit(0);
  }
}

//-----------------------------------------MAIN-----------------------------------------------------
const registerIndex = async function(){
  try {

    validateENSName();
    await validatePackageIndex();

    const registrar = await ensUtils.getRopstenTestRegistrarInstance(web3);
    await validateCanBeRegistered(web3, registrar);

    const options = {from: web3.currentProvider.addresses[0]};

    // ----------------------------------- Preamble ------------------------------------------------

    log(`....This script will link the package registry (PackageIndex)`)
    log(`you have deployed on Ropsten to an ENS domain name registered`)
    log(`with the Ropsten FIFS test registrar.........................`);
    log();
    log(`* The domain name will be valid for 28 days ONLY.`);
    log(`* Do NOT use this script for a production registry.`)
    log();
    log('----------------------------------------------------------')
    log(`Account:        ${web3.currentProvider.addresses[0]}`);
    log(`Domain:         ${ENSName}.test`)
    log(`PackageIndex:   ${PackageIndex.address}`)
    log('----------------------------------------------------------')
    log();

    // ------------------------------- Name Registration -------------------------------------------
    await registrar
      .methods
      .register(web3.utils.sha3(ENSName), web3.currentProvider.addresses[0])
      .send(options)
      .on('transactionHash', (hash) => {
        log(`Registering domain.... (tx ${hash})`)
      })

    // Confirm and get expiration date
    const time = await registrar
        .methods
        .expiryTimes(web3.utils.sha3(ENSName))
        .call();

    log(`Confirmed: Domain "${ENSName}.test" ` +
        `will expire ${new Date(parseInt(time * 1000)).toDateString()}`
    );
    log();

    // -------------------------------- Resolver Setup ---------------------------------------------

    const resolver = ensUtils.getRopstenResolverInstance(web3);
    const ens = ensUtils.getRopstenENSInstance(web3);
    const domainHash = nameHash.hash(`${ENSName}.test`);

    await ens
      .methods
      .setResolver(domainHash, resolver.options.address)
      .send(options)
      .on('transactionHash', hash =>
        log(`Setting resolver for domain... (tx ${hash})`)
      );

    const resolverAddress = await ens
      .methods
      .resolver(domainHash)
      .call();

    // Validate ENS Resolver settings and report
    const resolverErr = `Expected resolver to be set for domain name hash correctly.`
    assert(resolverAddress === resolver.options.address, resolverErr);

    log(`Confirmed: "${ENSName}.test" is using Resolver at address: ${resolverAddress}`)
    log();

    // -------------------------- Resolve PackageIndex Contract ------------------------------------
    await resolver
      .methods
      .setAddr(domainHash, PackageIndex.address)
      .send(options)
      .on('transactionHash', hash =>
        log(`Setting domain to resolve "PackageIndex"...`)
      );

    const resolved = await resolver
      .methods
      .addr(domainHash)
      .call();

    // Validate name-to-contract resolution and report
    const resolvedErr = `Expected Resolver to resolve PackageIndex for domain correctly.`
    assert(resolved === PackageIndex.address, resolverErr);

    log(`Confirmed: "${ENSName}.test" resolves "PackageIndex" at ${PackageIndex.address}`);
    log();
    log('Finished');
    log();

    process.exit(0);
  } catch(err){
    log(err);
    process.exit(0);
  }
}

module.exports = registerIndex;