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
}

module.exports = compilers;
