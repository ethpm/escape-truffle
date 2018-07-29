const PackageIndex = artifacts.require('PackageIndex');

module.exports = function(deployer) {
  if (!process.env.PRODUCTION) return;

  deployer.deploy(PackageIndex);
};
