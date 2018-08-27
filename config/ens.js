/**
 * This script registers a name specified in .secrets.js to ENS and links it to the
 * address of a PackageRegistry contract which the user has deployed to Ropsten
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

const assert = require('assert');
const readline = require('readline');
const nameHash = require('eth-ens-namehash');
const colors = require('colors');
const ora = require('ora');

const log = console.log;
const ensUtils = require('../ens/ropstenENSUtils');
const { ENSName } = require('../config/wallet');

const PackageRegistry = artifacts.require('PackageRegistry');


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

const validatePackageRegistry = async function(){
  const msg =
  `Unable to locate artifacts for "PackageRegistry" contract deployed to Ropsten.\n` +
  `* Have you executed "npm run deploy:ropsten" successfully?\n` +
  `* See the EthPM package registry docs for help.\n`

  try {
    await PackageRegistry.deployed();
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
  let spinner;
  const affirmations = ['y', 'yes', 'YES', 'Yes'];
  const confirm = `> ${colors.green('Confirmed:')}`;

  validateENSName();
  await validatePackageRegistry();

  const registrar = await ensUtils.getRopstenTestRegistrarInstance(web3);
  await validateCanBeRegistered(web3, registrar);

  const options = {from: web3.currentProvider.addresses[0]};


  // ----------------------------------- Preamble ------------------------------------------------

  log(`....This script will link the package registry (PackageRegistry)`)
  log(`you have deployed on Ropsten to an ENS domain name registered`)
  log(`with the Ropsten FIFS test registrar.........................`);
  log();
  log(`* The domain name ${colors.bold('will expire in 28 days')}.`);
  log(`* ${colors.bold('DO NOT')} use this script for a production registry.`);
  log(`* Script executes three transactions.`);
  log(`* Sometimes Ropsten takes a while to mine...`);
  log();
  log('----------------------------------------------------------')
  log(`Account:         ${web3.currentProvider.addresses[0]}`);
  log(`Domain:          ${ENSName}.test`)
  log(`PackageRegistry: ${PackageRegistry.address}`)
  log('----------------------------------------------------------')
  log();

  // ------------------------------- User Confirmation -------------------------------------------
  const quest = `${colors.green('* Continue with registration?')} (y/n) >> `;

  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  input.question(quest, async (answer) => {
    if (!affirmations.includes(answer.trim())){
      log();
      log('Exiting without registering.');
      log();
      process.exit(0);
    }

    try {
    // ------------------------------- Name Registration -----------------------------------------
      await registrar
        .methods
        .register(web3.utils.sha3(ENSName), web3.currentProvider.addresses[0])
        .send(options)
        .on('transactionHash', (hash) => {
          log();
          log(`> Registering domain....`);

          spinner = new ora({
            text: `tx: ${hash}`,
            color: 'red'
          });

          spinner.start();
        })

      spinner.stopAndPersist({symbol: '>'});

      // Confirm and get expiration date
      const time = await registrar
          .methods
          .expiryTimes(web3.utils.sha3(ENSName))
          .call();

      log(`${confirm} Domain "${ENSName}.test" ` +
          `will expire ${new Date(parseInt(time * 1000)).toDateString()}`
      );
      log();

      // -------------------------------- Resolver Setup -------------------------------------------

      const resolver = ensUtils.getRopstenResolverInstance(web3);
      const ens = ensUtils.getRopstenENSInstance(web3);
      const domainHash = nameHash.hash(`${ENSName}.test`);

      await ens
        .methods
        .setResolver(domainHash, resolver.options.address)
        .send(options)
        .on('transactionHash', hash => {
          log(`> Setting resolver for domain...`);

          spinner = new ora({
            text: `tx: ${hash}`,
            color: 'red'
          });

          spinner.start();
        });

      spinner.stopAndPersist({symbol: '>'});

      const resolverAddress = await ens
        .methods
        .resolver(domainHash)
        .call();

      // Validate ENS Resolver settings and report
      const resolverErr = `Expected resolver to be set for domain name hash correctly.`
      assert(resolverAddress === resolver.options.address, resolverErr);

      log(`${confirm} "${ENSName}.test" is using ENS Resolver at ${resolverAddress}`)
      log();

      // -------------------------- Resolve PackageRegistry Contract ----------------------------------
      await resolver
        .methods
        .setAddr(domainHash, PackageRegistry.address)
        .send(options)
        .on('transactionHash', hash => {
          log(`> Setting domain to resolve "PackageRegistry"...`)

          spinner = new ora({
            text: `tx: ${hash}`,
            color: 'red'
          });

          spinner.start();
        });

      spinner.stopAndPersist({symbol: '>'});

      const resolved = await resolver
        .methods
        .addr(domainHash)
        .call();

      // Validate name-to-contract resolution and report
      const resolvedErr = `Expected Resolver to resolve PackageRegistry for domain correctly.`
      assert(resolved === PackageRegistry.address, resolverErr);

      log(`${confirm} "${ENSName}.test" resolves PackageRegistry at ${PackageRegistry.address}`);
      log();
      log('Finished');
      log();

      process.exit(0);

    } catch(err){
      log(err);
      process.exit(0);
    }
  });
}

module.exports = registerIndex;
