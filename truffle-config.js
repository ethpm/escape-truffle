module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 8547,
      network_id: "*",
      gas: 8000000
    },
    geth: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 8000000
    },
    coverage: {
      host: "127.0.0.1",
      network_id: "*",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  }
}
