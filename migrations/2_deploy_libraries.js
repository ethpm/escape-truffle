const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');

const IndexedOrderedSetLib = artifacts.require('IndexedOrderedSetLib');
const SemVersionLib = artifacts.require('SemVersionLib');

module.exports = function(deployer) {
  deployer.deploy(IndexedOrderedSetLib);
  deployer.link(IndexedOrderedSetLib, PackageDB);
  deployer.link(IndexedOrderedSetLib, ReleaseDB);

  deployer.deploy(SemVersionLib);
  deployer.link(SemVersionLib, PackageDB);
  deployer.link(SemVersionLib, ReleaseDB);
};