const ReleaseDB = artifacts.require('ReleaseDB');

module.exports = function(deployer) {
  if (!process.env.PRODUCTION) return;

  deployer.deploy(ReleaseDB);
};