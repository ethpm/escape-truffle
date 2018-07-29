const ReleaseValidator = artifacts.require('ReleaseValidator');

module.exports = function(deployer) {
  if (!process.env.PRODUCTION) return;

  deployer.deploy(ReleaseValidator);
};