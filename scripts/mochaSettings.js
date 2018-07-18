// Mocha test configurations consumed by truffle-config.js, toggled by process.env.<MODE>.
// Idea borrowed from AragonOS's config.

/**
 * Run mocha with gas analytics: env: GAS_REPORTER
 * @type {Object}
 */
const mochaGasSettingsShell = {
  reporter: 'eth-gas-reporter',
  reporterOptions : {
    onlyCalledMethods: true,
  }
}

/**
 * Run mocha with gas usage analytics - output to docs: env: GAS_DOCS
 * @type {Object}
 */
const mochaGasSettingsDocs = {
  reporter: 'eth-gas-reporter',
  reporterOptions : {
    onlyCalledMethods: true,
    rst: true,
    rstTitle: 'Appendix: Gas Usage',
    outputFile: 'docs/Gas.rst',
    noColors: true
  }
}

/**
 * Run mocha filtering for tests with `geth` in the description
 * @type {Object}
 */
const mochaGeth = {
  grep: "geth",
}

// Assign
let mochaSettings = {};

if      (process.env.GAS_REPORTER)        mochaSettings = mochaGasSettingsShell
else if (process.env.GAS_DOCS)            mochaSettings = mochaGasSettingsDocs
else if (process.env.NETWORK === 'geth')  mochaSettings = mochaGeth

module.exports = mochaSettings
