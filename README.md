# escape-truffle
**Ethereum Package Registry (Truffle)**

[![Build Status](https://travis-ci.org/ethpm/escape-truffle.svg?branch=master)](https://travis-ci.org/ethpm/escape-truffle)
[![Coverage Status](https://coveralls.io/repos/github/ethpm/escape-truffle/badge.svg?branch=master)](https://coveralls.io/github/ethpm/escape-truffle?branch=master)
[![Documentation Status](https://readthedocs.org/projects/ethpm-package-registry/badge/?version=latest)](https://ethpm-package-registry.readthedocs.io/en/latest/?badge=latest)

### Install
```
$ npm install
$ docker pull ethereum/client-go:v1.8.6
```

### Test
```
$ npm test        # vs. ganache-cli
$ npm test:geth   # vs. geth
```

### Deploy

This repository contains deployment scripts that let you quickly publish
your own package registry to a public testnet and authorize your account
address as its owner.

Clone the repo and create a `.secrets.js` file in the project root that looks like this:

```javascript
module.exports = {
    ropsten: {
      mnemonic: 'use your own twelve word mnemonic here do not use this one',
      infura: "F6tUooiW4thx777DtPsa" // <-- Example Infura API key.
    },
    rinkeby: {
      ..etc..
    }
}
```

At the command line run:
```shell
$ npm run deploy:ropsten
```

+ Infura API keys are available [here](https://infura.io/register)
+ A 12 word mnemonic (for testing purposes only) can be generated [here](iancoleman.io/bip39)


### Coverage
```
$ npm run coverage
```

### Lint

For help, see the [Solium documentation](https://github.com/duaraghav8/Solium)
```
$ npm run lint
```

### Docs

Docs are automatically built & published to ReadTheDocs on merge at
[EthPM Package Registry](https://ethpm-package-registry.readthedocs.io/en/latest/).
To build them locally, run:
```shell
$ cd docs
$ pip install -r requirements.txt
$ make html
```


