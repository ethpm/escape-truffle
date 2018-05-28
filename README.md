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
