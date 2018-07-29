const PackageDB = artifacts.require('PackageDB');

module.exports = function(deployer) {
  if (!process.env.PRODUCTION) return;

  deployer.deploy(PackageDB);
};