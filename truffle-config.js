/**
 * Truffle network configuration.
 *
 * Please see package.json `scripts` for a set of convenience shell commands that
 * allow you to run a variety of tests and quickly deploy the reference registry
 * to a public testnet.
 */

const HDWalletProvider = require('truffle-hdwallet-provider');

/**
 * Loads mocha settings based on which shell env variables are set. Options are:
 *   - GAS_REPORTER: run gas analytics with tests
 *   - GAS_DOCS:     run gas analytics and output report for docs
 *   - GETH :        run all tests with the `geth` tag in their description
 */
const mocha = require('./config/mocha');

/**
 * Loads compilers settings. In CI these default to dockerized solc:stable. Locally
 * they use whatever solc version the installed truffle dev-dependency shipped with.
 */
const compilers = require('./config/compilers');

/**
 * Loads mnemonic and infura API key when shell env variables specify a public network (like
 * rinkeby). This `require` will throw when a given NETWORK env var is set but the `.secrets.js`
 * file does not contain settings for it.
 *
 * Deployment Resources:
 *
 *   - Infura API keys are available *free* here:
 *     ---> infura.io/register
 *
 *   - A 12 word mnemonic (for testing purposes only) can be generated here:
 *     ---> iancoleman.io/bip39
 *
 * Comment out the line below if you do not wish to deploy via Infura using a wallet provider
 */
const {
  mnemonic,
  infura
} = require('./config/wallet');


module.exports = {
  networks: {

    // Test (ganache-cli)
    ganache: {
      host: "127.0.0.1",
      port: 8547,
      network_id: "*",
      websockets: true
    },
    // Test (geth)
    geth: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    // Test w/ coverage (testrpc-sc)
    coverage: {
      host: "127.0.0.1",
      network_id: "*",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      websockets: true
    },
    // Ropsten deployment via Infura (geth)
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infura}`),
      network_id: 3,
      gas: 6000000,
      gasPrice: 20000000000,
      confirmations: 2,
    },
    // Rinkeby deployment via Infura (geth)
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${infura}`),
      network_id: 4,
      gas: 6000000,
      gasPrice: 20000000000,
      confirmations: 2,
    },
  },
  mocha,
  compilers: compilers
}
