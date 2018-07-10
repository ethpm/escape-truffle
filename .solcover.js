module.exports = {
  compileCommand: '../node_modules/.bin/truffle compile --network coverage',
  testCommand: '../node_modules/.bin/truffle test --network coverage',
  testrpcOptions: '--noVMErrorsOnRPCResponse --port 8555',
  skipFiles: ['mocks']
}