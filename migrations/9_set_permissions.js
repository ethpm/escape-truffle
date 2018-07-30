const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');
const PackageIndex = artifacts.require('PackageIndex');
const ReleaseValidator = artifacts.require('ReleaseValidator');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');
const setPermissions = require('../config/permissions');

module.exports = async function(deployer) {
  if (!process.env.PRODUCTION) return;

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
    releaseValidator,
    true
  );
};