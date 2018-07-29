const PermissionsLogger = require('./logger');
const util = require('util');

async function setPermissions(
  authority,
  packageIndex,
  packageDB,
  releaseDB,
  releaseValidator,
  verbose
){

  const logger = new PermissionsLogger(verbose);

  logger.start();

  logger.setAuthority(packageIndex);
  await packageIndex.setAuthority(authority.address);
  logger.stopSpinner()

  logger.setAuthority(packageDB);
  await packageDB.setAuthority(authority.address);
  logger.stopSpinner()

  logger.setAuthority(releaseDB);
  await releaseDB.setAuthority(authority.address);
  logger.stopSpinner()

  logger.newline();

  logger.setDep(packageDB, 'database')
  await packageIndex.setPackageDb(packageDB.address);
  logger.stopSpinner()

  logger.setDep(releaseDB, 'database');
  await packageIndex.setReleaseDb(releaseDB.address);
  logger.stopSpinner()

  logger.setDep(releaseValidator, 'validator');
  await packageIndex.setReleaseValidator(releaseValidator.address);
  logger.stopSpinner()

  logger.newline();

  // ReleaseDB
  const setVersion = releaseDB
    .abi
    .find(item => item.name === 'setVersion')
    .signature;

  const setRelease = releaseDB
    .abi
    .find(item => item.name === 'setRelease')
    .signature;

  const updateLatestTree = releaseDB
    .abi
    .find(item => item.name === 'updateLatestTree')
    .signature;

  // PackageDB
  const setPackage = packageDB
    .abi
    .find(item => item.name === 'setPackage')
    .signature;

  const setPackageOwner = packageDB
    .abi
    .find(item => item.name === 'setPackageOwner')
    .signature;

  // PackageIndex
  const release = packageIndex
    .abi
    .find(item => item.name === 'release')
    .signature;


  const transferPackageOwner = packageIndex
    .abi
    .find(item => item.name === 'transferPackageOwner')
    .signature;

  // ReleaseDB
  logger.setCanCall(
    packageIndex,
    releaseDB,
    'setRelease'
  );

  await authority.setCanCall(
    packageIndex.address,
    releaseDB.address,
    setRelease,
    true
  );

  logger.stopSpinner()

  // PackageDB
  logger.setCanCall(
    packageIndex,
    packageDB,
    'setPackage'
  );

  await authority.setCanCall(
    packageIndex.address,
    packageDB.address,
    setPackage,
    true
  );

  logger.stopSpinner()

  logger.setCanCall(
    packageIndex,
    packageDB,
    'setPackageOwner'
  );

  await authority.setCanCall(
    packageIndex.address,
    packageDB.address,
    setPackageOwner,
    true
  );

  logger.stopSpinner()

  logger.newline();

  logger.setAnyoneCanCall(
    releaseDB,
    'setVersion'
  );

  await authority.setAnyoneCanCall(
    releaseDB.address,
    setVersion,
    true
  );

  logger.stopSpinner()

  logger.setAnyoneCanCall(
    releaseDB,
    'updateLatestTree'
  );

  await authority.setAnyoneCanCall(
    releaseDB.address,
    updateLatestTree,
    true
  );

  logger.stopSpinner()

  // PackageIndex
  logger.setAnyoneCanCall(
    packageIndex,
    'release'
  );

  await authority.setAnyoneCanCall(
    packageIndex.address,
    release,
    true
  );

  logger.stopSpinner()

  logger.setAnyoneCanCall(
    packageIndex,
    'transferPackageOwner'
  );

  await authority.setAnyoneCanCall(
    packageIndex.address,
    transferPackageOwner,
    true
  );

  logger.stopSpinner()

  logger.finish();
}

module.exports = setPermissions;
