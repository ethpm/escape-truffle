pragma solidity ^0.4.24;
pragma experimental "v0.5.0";


import {PackageDB} from "./PackageDB.sol";
import {ReleaseDB} from "./ReleaseDB.sol";
import {ReleaseValidator} from "./ReleaseValidator.sol";
import {PackageRegistryInterface} from "./PackageRegistryInterface.sol";
import {Owned} from "./Owned.sol";


/// @title Database contract for a package index.
/// @author Tim Coulter <tim.coulter@consensys.net>, Piper Merriam <pipermerriam@gmail.com>
contract PackageRegistry is Owned, PackageRegistryInterface {
  PackageDB private packageDb;
  ReleaseDB private releaseDb;
  ReleaseValidator private releaseValidator;

  // Events
  event PackageRelease(bytes32 indexed nameHash, bytes32 indexed releaseId);
  event PackageTransfer(address indexed oldOwner, address indexed newOwner);

  //
  // Administrative API
  //
  /// @dev Sets the address of the PackageDb contract.
  /// @param newPackageDb The address to set for the PackageDb.
  function setPackageDb(address newPackageDb)
    public
    isOwner
    returns (bool)
  {
    packageDb = PackageDB(newPackageDb);
    return true;
  }

  /// @dev Sets the address of the ReleaseDb contract.
  /// @param newReleaseDb The address to set for the ReleaseDb.
  function setReleaseDb(address newReleaseDb)
    public
    isOwner
    returns (bool)
  {
    releaseDb = ReleaseDB(newReleaseDb);
    return true;
  }

  /// @dev Sets the address of the ReleaseValidator contract.
  /// @param newReleaseValidator The address to set for the ReleaseValidator.
  function setReleaseValidator(address newReleaseValidator)
    public
    isOwner
    returns (bool)
  {
    releaseValidator = ReleaseValidator(newReleaseValidator);
    return true;
  }

  //
  // +-------------+
  // |  Write API  |
  // +-------------+
  //
  /// @dev Creates a a new release for the named package.  If this is the first release for the given package then this will also assign msg.sender as the owner of the package.  Returns success.
  /// @notice Will create a new release the given package with the given release information.
  /// @param name Package name
  /// @param version Version string (ex: '1.0.0')
  /// @param manifestURI The URI for the release manifest for this release.
  function release(
    string name,
    string version,
    string manifestURI
  )
    public
    isOwner
    returns (bytes32 id)
  {
    require(address(packageDb) != 0x0,        "escape:PackageIndex:package-db-not-set");
    require(address(releaseDb) != 0x0,        "escape:PackageIndex:release-db-not-set");
    require(address(releaseValidator) != 0x0, "escape:PackageIndex:release-validator-not-set");

    bytes32 versionHash = releaseDb.hashVersion(version);

    // If the version for this release is not in the version database, populate
    // it.  This must happen prior to validation to ensure that the version is
    // present in the releaseDb.
    if (!releaseDb.versionExists(versionHash)) {
      releaseDb.setVersion(version);
    }

    // Run release validator. This method reverts with an error message string
    // on failure.
    releaseValidator.validateRelease(
      packageDb,
      releaseDb,
      name,
      version,
      manifestURI
    );

    // Both creates the package if it is new as well as updating the updatedAt
    // timestamp on the package.
    packageDb.setPackage(name);

    bytes32 nameHash = packageDb.hashName(name);

    // Create the release and add it to the list of package release hashes.
    releaseDb.setRelease(nameHash, versionHash, manifestURI);

    // Log the release.
    bytes32 releaseId = releaseDb.hashRelease(nameHash, versionHash);
    emit PackageRelease(nameHash, releaseId);

    return releaseId;
  }

  //
  // +------------+
  // |  Read API  |
  // +------------+
  //

  /// @dev Returns the address of the packageDb
  function getPackageDb()
    public
    view
    returns (address)
  {
    return address(packageDb);
  }

  /// @dev Returns the address of the releaseDb
  function getReleaseDb()
    public
    view
    returns (address)
  {
    return address(releaseDb);
  }

  /// @dev Returns the address of the releaseValidator
  function getReleaseValidator()
    public
    view
    returns (address)
  {
    return address(releaseValidator);
  }

  /// @dev Query the existence of a package with the given name.  Returns boolean indicating whether the package exists.
  /// @param name Package name
  function packageExists(string name)
    public
    view
    returns (bool)
  {
    return packageDb.packageExists(packageDb.hashName(name));
  }

  /// @dev Query the existence of a release at the provided version for the named package.  Returns boolean indicating whether such a release exists.
  /// @param name Package name
  /// @param version Version string (ex: '1.0.0')
  function releaseExists(
    string name,
    string version
  )
    public
    view
    returns (bool)
  {
    bytes32 nameHash = packageDb.hashName(name);
    bytes32 versionHash = releaseDb.hashVersion(version);
    return releaseDb.releaseExists(releaseDb.hashRelease(nameHash, versionHash));
  }

  /// @dev Returns a slice of the array of all package hashes for the named package.
  /// @param _offset The starting index for the slice.
  /// @param limit  The length of the slice
  function getAllPackageIds(uint _offset, uint limit)
    public
    view
    returns(
      bytes32[] packageIds,
      uint offset
    )
  {
    return packageDb.getAllPackageIds(_offset, limit);
  }

  /// @dev Retrieves the name for the given name hash.
  /// @param nameHash The name hash to lookup the name for.
  function getPackageName(bytes32 nameHash)
    public
    view
    returns (string)
  {
    return packageDb.getPackageName(nameHash);
  }

  /// @dev Returns the package data.
  /// @param name Package name
  function getPackageData(string name)
    public
    view
    returns (
      address packageOwner,
      uint createdAt,
      uint numReleases,
      uint updatedAt
    )
  {
    bytes32 nameHash = packageDb.hashName(name);
    (createdAt, updatedAt) = packageDb.getPackageData(nameHash);
    numReleases = releaseDb.getNumReleasesForNameHash(nameHash);
    return (packageOwner, createdAt, numReleases, updatedAt);
  }

  /// @dev Returns the release data for the release associated with the given release hash.
  /// @param releaseId The release hash.
  function getReleaseData(bytes32 releaseId)
    public
    view
    returns (
      string name,
      string version,
      string manifestURI
    )
  {
    bytes32 versionHash;
    bytes32 nameHash;
    (nameHash,versionHash, ,) = releaseDb.getReleaseData(releaseId);

    name = packageDb.getPackageName(nameHash);
    version = releaseDb.getVersion(versionHash);
    manifestURI = releaseDb.getManifestURI(releaseId);

    return (name, version, manifestURI);
  }

  /// @dev Returns a slice of the array of all package hashes for the named package.
  /// @param offset The starting index for the slice.
  /// @param limit  The length of the slice
  function getAllReleaseIds(string name, uint _offset, uint limit)
    public
    view
    returns (
      bytes32[] releaseIds,
      uint offset
    )
  {
    bytes32 nameHash = packageDb.hashName(name);
    return releaseDb.getAllReleaseIds(nameHash, _offset, limit);
  }

  // @dev Returns release id that *would* be generated for a name and version pair on `release`.
  // @param name Package name
  // @param version Version string (ex: '1.0.0')
  function generateReleaseId(string name, string version)
    public
    view
    returns (bytes32)
  {
    bytes32 nameHash = packageDb.hashName(name);
    bytes32 versionHash = releaseDb.hashVersion(version);
    return keccak256(abi.encodePacked(nameHash, versionHash));
  }
}
