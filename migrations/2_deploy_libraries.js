const PackageDB = artifacts.require('PackageDB');
const IndexedOrderedSetLib = artifacts.require('IndexedOrderedSetLib');
const SemVersionLib = artifacts.require('SemVersionLib');

module.exports = function(deployer) {
  deployer.deploy(IndexedOrderedSetLib);
  deployer.deploy(SemVersionLib);
  deployer.link(IndexedOrderedSetLib, PackageDB);
  deployer.link(SemVersionLib, PackageDB);
};