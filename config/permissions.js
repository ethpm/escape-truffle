const PermissionsLogger = require('./logger');
const util = require('util');

async function setPermissions(
  authority,
  packageRegistry,
  packageDB,
  releaseDB,
  releaseValidator,
  verbose
){

  const logger = new PermissionsLogger(verbose);

  logger.start();

  logger.setAuthority(packageRegistry);
  await packageRegistry.setAuthority(authority.address);
  logger.stopSpinner()

  logger.setAuthority(packageDB);
  await packageDB.setAuthority(authority.address);
  logger.stopSpinner()

  logger.setAuthority(releaseDB);
  await releaseDB.setAuthority(authority.address);
  logger.stopSpinner()

  logger.newline();

  logger.setDep(packageDB, 'database')
  await packageRegistry.setPackageDb(packageDB.address);
  logger.stopSpinner()

  logger.setDep(releaseDB, 'database');
  await packageRegistry.setReleaseDb(releaseDB.address);
  logger.stopSpinner()

  logger.setDep(releaseValidator, 'validator');
  await packageRegistry.setReleaseValidator(releaseValidator.address);
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


  // PackageDB
  const setPackage = packageDB
    .abi
    .find(item => item.name === 'setPackage')
    .signature;

  const setPackageOwner = packageDB
    .abi
    .find(item => item.name === 'setPackageOwner')
    .signature;

  // packageRegistry
  const release = packageRegistry
    .abi
    .find(item => item.name === 'release')
    .signature;


  const transferPackageOwner = packageRegistry
    .abi
    .find(item => item.name === 'transferPackageOwner')
    .signature;

  // ReleaseDB
  logger.setCanCall(
    packageRegistry,
    releaseDB,
    'setRelease'
  );

  await authority.setCanCall(
    packageRegistry.address,
    releaseDB.address,
    setRelease,
    true
  );

  logger.stopSpinner()

  // PackageDB
  logger.setCanCall(
    packageRegistry,
    packageDB,
    'setPackage'
  );

  await authority.setCanCall(
    packageRegistry.address,
    packageDB.address,
    setPackage,
    true
  );

  logger.stopSpinner()

  logger.setCanCall(
    packageRegistry,
    packageDB,
    'setPackageOwner'
  );

  await authority.setCanCall(
    packageRegistry.address,
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

  // packageRegistry
  logger.setAnyoneCanCall(
    packageRegistry,
    'release'
  );

  await authority.setAnyoneCanCall(
    packageRegistry.address,
    release,
    true
  );

  logger.stopSpinner()

  logger.setAnyoneCanCall(
    packageRegistry,
    'transferPackageOwner'
  );

  await authority.setAnyoneCanCall(
    packageRegistry.address,
    transferPackageOwner,
    true
  );

  logger.stopSpinner()

  logger.finish();
}

module.exports = setPermissions;
