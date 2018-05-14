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
      gas: 4000000,
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
  }
}
