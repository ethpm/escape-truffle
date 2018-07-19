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

  await packageIndex.setAuthority(authority.address);
  logger.setAuthority(packageIndex);

  await packageDB.setAuthority(authority.address);
  logger.setAuthority(packageDB);

  await releaseDB.setAuthority(authority.address);
  logger.setAuthority(releaseDB);

  logger.newline();

  await packageIndex.setPackageDb(packageDB.address);
  logger.setDep(packageDB, 'database')

  await packageIndex.setReleaseDb(releaseDB.address);
  logger.setDep(releaseDB, 'database');

  await packageIndex.setReleaseValidator(releaseValidator.address);
  logger.setDep(releaseValidator, 'validator');

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
  await authority.setCanCall(
    packageIndex.address,
    releaseDB.address,
    setRelease,
    true
  );

  logger.setCanCall(
    packageIndex,
    releaseDB,
    'setRelease'
  );

  // PackageDB
  await authority.setCanCall(
    packageIndex.address,
    packageDB.address,
    setPackage,
    true
  );

  logger.setCanCall(
    packageIndex,
    packageDB,
    'setPackage'
  );

  await authority.setCanCall(
    packageIndex.address,
    packageDB.address,
    setPackageOwner,
    true
  );

  logger.setCanCall(
    packageIndex,
    packageDB,
    'setPackageOwner'
  );

  logger.newline();

  await authority.setAnyoneCanCall(
    releaseDB.address,
    setVersion,
    true
  );

  logger.setAnyoneCanCall(
    releaseDB,
    'setVersion'
  );

  await authority.setAnyoneCanCall(
    releaseDB.address,
    updateLatestTree,
    true
  );

  logger.setAnyoneCanCall(
    releaseDB,
    'updateLatestTree'
  );


  // PackageIndex
  await authority.setAnyoneCanCall(
    packageIndex.address,
    release,
    true
  );

  logger.setAnyoneCanCall(
    packageIndex,
    'release'
  );

  await authority.setAnyoneCanCall(
    packageIndex.address,
    transferPackageOwner,
    true
  );

  logger.setAnyoneCanCall(
    packageIndex,
    'transferPackageOwner'
  );

  logger.finish();
}

module.exports = setPermissions;
