const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');

const IndexedOrderedSetLib = artifacts.require('IndexedOrderedSetLib');

module.exports = function(deployer) {
  deployer.deploy(IndexedOrderedSetLib);
  deployer.link(IndexedOrderedSetLib, PackageDB);
  deployer.link(IndexedOrderedSetLib, ReleaseDB);
};
