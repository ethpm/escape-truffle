const PackageRegistry = artifacts.require('PackageRegistry');

module.exports = function(deployer) {
  if (!process.env.PRODUCTION) return;

  deployer.deploy(PackageRegistry);
};
