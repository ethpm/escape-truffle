/**
 * Compiler settings consumed by truffle-config.js
 */

let compilers = {};

// Travis sets CI to true by default
if (process.env.CI){
  compilers = {
    solc: {
      version: "0.4.24",
      docker: true,
    },
  }
// Development and Production Settings
} else {
  compilers = {
    solc: {
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    },
  }
}

module.exports = compilers;