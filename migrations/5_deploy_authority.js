const WhitelistAuthority = artifacts.require('WhitelistAuthority');

module.exports = function(deployer) {
  if (!process.env.PRODUCTION) return;

  deployer.deploy(WhitelistAuthority);
};