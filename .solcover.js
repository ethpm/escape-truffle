module.exports = {
  compileCommand: '../node_modules/.bin/darq-truffle compile --network coverage',
  testCommand: '../node_modules/.bin/darq-truffle test --network coverage',
  testrpcOptions: '--noVMErrorsOnRPCResponse --port 8555',
  skipFiles: ['mocks']
}