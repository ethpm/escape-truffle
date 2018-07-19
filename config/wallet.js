/**
 * Loads and exports network specific mnemonics and infura API keys from
 * a `.secrets.js` file located in the root directory. Secrets should look something like:
 *
 * module.exports = {
 *   ropsten: {
 *     mnemonic: 'use your own twelve word mnemonic here do not use this one',
 *     infura: "F6tUooiW4thx777DtPsa" // <-- Not real.
 *   },
 *   ...
 * }
 */

const fs = require('fs');

let infura
let mnemonic;

const publicNetworks = ['ropsten', 'rinkeby'];
const network = process.env.NETWORK;

// Error messages
const noKeysMsg = `Mnemonic and/or infura API key for ${network} ` +
                  `not specified in '.secrets.js'.\nPlease open that file ` +
                  `and follow setup instructions.\n\n`;

const noFileMsg = `Could not locate file: '.secrets.js'.\n` +
                  `Please see the EthPM Registry docs for help configuring ` +
                  `deployment to a public network.\n\n`

// Deploying to public network?
if (publicNetworks.includes(process.env.NETWORK)){

  // Has file?
  if (fs.existsSync('../.secrets.js')) {
    const secrets = require('./.secrets');

    // Has keys?
    if (!secrets[network].mnemonic || !secrets[network].infura){
      throw new Error(noKeysMsg);
    }

    mnemonic = secrets[network].mnemonic;
    infura = secrets[network].infura;

  } else throw new Error(noFileMsg);
}

module.exports =  {
  mnemonic: mnemonic,
  infura: infura
}

