pragma solidity ^0.4.24;
pragma experimental "v0.5.0";

import {PackageDB} from "./PackageDB.sol";
import {ReleaseDB} from "./ReleaseDB.sol";

/// @title Database contract for a package index.
/// @author Piper Merriam <pipermerriam@gmail.com>
contract ReleaseValidator {

  /// @dev Maps integer error codes returned by `validateRelease` to human readable error strings.
  mapping (uint8 => string) public errors;

  /// @dev Initializes `errors` map with human readable error messages.
  constructor() public {
    errors[1] = "escape:ReleaseValidator:package-db-not-set";
    errors[2] = "escape:ReleaseValidator:release-db-not-set";
    errors[3] = "escape:ReleaseValidator:caller-not-authorized";
    errors[4] = "escape:ReleaseValidator:version-exists";
    errors[5] = "escape:ReleaseValidator:invalid-package-name";
    errors[6] = "escape:ReleaseValidator:invalid-lockfile-uri";
    errors[7] = "escape:ReleaseValidator:invalid-release-version";
  }

  /// @dev Runs validation on all of the data needed for releasing a package.  Returns success.
  /// @param packageDb The address of the PackageDB
  /// @param releaseDb The address of the ReleaseDB
  /// @param callerAddress The address which is attempting to create the release.
  /// @param name The name of the package.
  /// @param majorMinorPatch The major/minor/patch portion of the version string.
  /// @param preRelease The pre-release portion of the version string.
  /// @param build The build portion of the version string.
  /// @param releaseLockfileURI The URI of the release lockfile.
  function validateRelease(
    PackageDB packageDb,
    ReleaseDB releaseDb,
    address callerAddress,
    string name,
    uint32[3] majorMinorPatch,
    string preRelease,
    string build,
    string releaseLockfileURI
  )
    public
    view
    returns (uint8 code)
  {
    if (address(packageDb) == 0x0){
      // packageDb address is null
      return 1;
    } else if (address(releaseDb) == 0x0){
      // releaseDb address is null
      return 2;
    } else if (!validateAuthorization(packageDb, callerAddress, name)) {
      // package exists and msg.sender is not the owner not the package owner.
      return 3;
    } else if (!validateIsNewRelease(packageDb, releaseDb, name, majorMinorPatch, preRelease, build)) {
      // this version has already been released.
      return 4;
    } else if (!validatePackageName(packageDb, name)) {
      // invalid package name.
      return 5;
    } else if (!validateReleaseLockfileURI(releaseLockfileURI)) {
      // disallow empty release lockfile URI
      return 6;
    } else if (!validateReleaseVersion(majorMinorPatch)) {
      // disallow version 0.0.0
      return 7;
    }
    return 0;
  }

  /// @dev Validate whether the callerAddress is authorized to make this release.
  /// @param packageDb The address of the PackageDB
  /// @param callerAddress The address which is attempting to create the release.
  /// @param name The name of the package.
  function validateAuthorization(
    PackageDB packageDb,
    address callerAddress,
    string name
  )
    public
    view
    returns (bool)
  {
    bytes32 nameHash = packageDb.hashName(name);
    if (!packageDb.packageExists(nameHash)) {
      return true;
    }
    address packageOwner;

    (packageOwner,,) = packageDb.getPackageData(nameHash);

    if (packageOwner == callerAddress) {
      return true;
    }
    return false;
  }

  /// @dev Validate that the version being released has not already been released.
  /// @param packageDb The address of the PackageDB
  /// @param releaseDb The address of the ReleaseDB
  /// @param name The name of the package.
  /// @param majorMinorPatch The major/minor/patch portion of the version string.
  /// @param preRelease The pre-release portion of the version string.
  /// @param build The build portion of the version string.
  function validateIsNewRelease(
    PackageDB packageDb,
    ReleaseDB releaseDb,
    string name,
    uint32[3] majorMinorPatch,
    string preRelease,
    string build
  )
    public
    view
    returns (bool)
  {
    bytes32 nameHash = packageDb.hashName(name);
    bytes32 versionHash = releaseDb.hashVersion(majorMinorPatch[0], majorMinorPatch[1], majorMinorPatch[2], preRelease, build);
    bytes32 releaseHash = releaseDb.hashRelease(nameHash, versionHash);
    return !releaseDb.releaseExists(releaseHash);
  }

  uint constant DIGIT_0 = uint(bytes1("0"));
  uint constant DIGIT_9 = uint(bytes1("9"));
  uint constant LETTER_a = uint(bytes1("a"));
  uint constant LETTER_z = uint(bytes1("z"));
  bytes1 constant DASH = bytes1("-");

  /// @dev Returns boolean whether the provided package name is valid.
  /// @param packageDb The address of the PackageDB
  /// @param name The name of the package.
  function validatePackageName(PackageDB packageDb, string name)
    public
    view
    returns (bool)
  {
    bytes32 nameHash = packageDb.hashName(name);

    if (packageDb.packageExists(nameHash)) {
      // existing names are always valid.
      return true;
    }

    if (bytes(name).length < 2 || bytes(name).length > 214) {
      return false;
    }
    for (uint i = 0; i < bytes(name).length; i++) {
      if (bytes(name)[i] == DASH && i > 0) {
        continue;
      } else if (i > 0 && uint(bytes(name)[i]) >= DIGIT_0 && uint(bytes(name)[i]) <= DIGIT_9) {
        continue;
      } else if (uint(bytes(name)[i]) >= LETTER_a && uint(bytes(name)[i]) <= LETTER_z) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  /// @dev Returns boolean whether the provided release lockfile URI is valid.
  /// @param releaseLockfileURI The URI for a release lockfile.
  function validateReleaseLockfileURI(string releaseLockfileURI)
    public
    pure
    returns (bool)
  {
    if (bytes(releaseLockfileURI).length == 0) {
      return false;
    }
    return true;
  }

  /// @dev Validate that the version is not 0.0.0.
  /// @param majorMinorPatch The major/minor/patch portion of the version string.
  function validateReleaseVersion(uint32[3] majorMinorPatch)
    public
    pure
    returns (bool)
  {
    if (majorMinorPatch[0] > 0) {
      return true;
    } else if (majorMinorPatch[1] > 0) {
      return true;
    } else if (majorMinorPatch[2] > 0) {
      return true;
    } else {
      return false;
    }
  }
}

