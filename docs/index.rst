escape-truffle
==============

Ethereum Package Registry (V2)
------------------------------

Install
-------
``
$ npm install
$ docker pull ethereum/client-go:v1.8.6
``

Test
----
``
$ npm test        # vs. ganache-cli
$ npm test:geth   # vs. geth
``

Coverage
--------
``
$ npm run coverage
``

Lint
----
For help, see the [Solium documentation](https://github.com/duaraghav8/Solium)
``
$ npm run lint
``

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   Authority
   IndexedOrderedSetLib
   PackageDB
   PackageIndex
   PackageIndexInterface
   ReleaseDB
   ReleaseValidator
   SemVersionLib

Indices and tables
==================

* :ref:`genindex`
