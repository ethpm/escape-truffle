const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');
const PackageIndex = artifacts.require('PackageIndex');
const ReleaseValidator = artifacts.require('ReleaseValidator');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');
const setPermissions = require('../test/helpers').setPermissions;

module.exports = async function(deployer) {
  if (!process.env.PRODUCTION) return;

  await deployer.deploy(PackageIndex);
  await deployer.deploy(WhitelistAuthority);
  await deployer.deploy(PackageDB);
  await deployer.deploy(ReleaseDB);
  await deployer.deploy(ReleaseValidator);

  const authority = await WhitelistAuthority.deployed();
  const packageIndex = await PackageIndex.deployed();
  const packageDB = await PackageDB.deployed();
  const releaseDB = await ReleaseDB.deployed();
  const releaseValidator = await ReleaseValidator.deployed();

  await setPermissions(
    authority,
    packageIndex,
    packageDB,
    releaseDB,
    releaseValidator
  );
};