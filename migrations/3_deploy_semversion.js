const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');

const SemVersionLib = artifacts.require('SemVersionLib');

module.exports = function(deployer) {
  deployer.deploy(SemVersionLib);

  deployer.link(SemVersionLib, PackageDB);
  deployer.link(SemVersionLib, ReleaseDB);
};
