
// Thanks AragonOS for this conditional reporter logic.
const mochaGasSettingsShell = {
  reporter: 'eth-gas-reporter',
  reporterOptions : {
    onlyCalledMethods: true,
  }
}

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

let mocha = {};
if (process.env.GAS_REPORTER){
  mocha = mochaGasSettingsShell
} else if (process.env.GAS_DOCS){
  mocha = mochaGasSettingsDocs
}

module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 8547,
      network_id: "*",
      websockets: true
    },
    geth: {
      host: "127.0.0.1",
      port: 8546,
      network_id: "*",
      websockets: true
    },
    coverage: {
      host: "127.0.0.1",
      network_id: "*",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
      websockets: true
    }
  },
  mocha,
}
