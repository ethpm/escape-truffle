* [Authority](#authority)
  * [canCall](#function-cancall)
* [PackageIndexInterface](#packageindexinterface)
  * [getNumReleases](#function-getnumreleases)
  * [setReleaseValidator](#function-setreleasevalidator)
  * [getPackageReleaseHashes](#function-getpackagereleasehashes)
  * [setOwner](#function-setowner)
  * [getReleaseLockfileURI](#function-getreleaselockfileuri)
  * [getPackageDb](#function-getpackagedb)
  * [setPackageDb](#function-setpackagedb)
  * [releaseExists](#function-releaseexists)
  * [getReleaseValidator](#function-getreleasevalidator)
  * [getReleaseData](#function-getreleasedata)
  * [getAllReleaseHashes](#function-getallreleasehashes)
  * [transferPackageOwner](#function-transferpackageowner)
  * [getReleaseHash](#function-getreleasehash)
  * [release](#function-release)
  * [getNumPackages](#function-getnumpackages)
  * [getReleaseHashes](#function-getreleasehashes)
  * [setAuthority](#function-setauthority)
  * [packageExists](#function-packageexists)
  * [owner](#function-owner)
  * [authority](#function-authority)
  * [getPackageData](#function-getpackagedata)
  * [getAllPackageReleaseHashes](#function-getallpackagereleasehashes)
  * [getReleaseHashForPackage](#function-getreleasehashforpackage)
  * [getPackageName](#function-getpackagename)
  * [setReleaseDb](#function-setreleasedb)
  * [getReleaseDb](#function-getreleasedb)
  * [PackageRelease](#event-packagerelease)
  * [PackageTransfer](#event-packagetransfer)
  * [OwnerUpdate](#event-ownerupdate)
  * [AuthorityUpdate](#event-authorityupdate)

# Authority


## *function* canCall

Authority.canCall(callerAddress, codeAddress, sig) `view` `b7009613`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | callerAddress | undefined |
| *address* | codeAddress | undefined |
| *bytes4* | sig | undefined |


---
# PackageIndexInterface

Tim Coulter <tim.coulter@consensys.net>, Piper Merriam <pipermerriam@gmail.com>

## *function* getNumReleases

PackageIndexInterface.getNumReleases() `view` `0ccec396`





## *function* setReleaseValidator

PackageIndexInterface.setReleaseValidator(newReleaseValidator) `nonpayable` `10ae4ce2`

> Sets the address of the ReleaseValidator contract.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newReleaseValidator | The address to set for the ReleaseValidator. |


## *function* getPackageReleaseHashes

PackageIndexInterface.getPackageReleaseHashes(name, offset, numReleases) `view` `12cc08f2`

> Returns a slice of the array of all release hashes for the named package.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |
| *uint256* | offset | The starting index for the slice. |
| *uint256* | numReleases | The length of the slice |


## *function* setOwner

PackageIndexInterface.setOwner(newOwner) `nonpayable` `13af4035`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* getReleaseLockfileURI

PackageIndexInterface.getReleaseLockfileURI(name, major, minor, patch, preRelease, build) `view` `1f6b0a9d`

> Returns the release lockfile for the given release data

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |
| *uint32* | major | The major portion of the semver version string. |
| *uint32* | minor | The minor portion of the semver version string. |
| *uint32* | patch | The patch portion of the semver version string. |
| *string* | preRelease | The pre-release portion of the semver version string.  Use empty string if the version string has no pre-release portion. |
| *string* | build | The build portion of the semver version string.  Use empty string if the version string has no build portion. |


## *function* getPackageDb

PackageIndexInterface.getPackageDb() `view` `271cd760`

> Returns the address of the packageDb




## *function* setPackageDb

PackageIndexInterface.setPackageDb(newPackageDb) `nonpayable` `34c0d654`

> Sets the address of the PackageDb contract.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newPackageDb | The address to set for the PackageDb. |


## *function* releaseExists

PackageIndexInterface.releaseExists(name, major, minor, patch, preRelease, build) `view` `4188d79c`

> Query the existence of a release at the provided version for the named package.  Returns boolean indicating whether such a release exists.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |
| *uint32* | major | The major portion of the semver version string. |
| *uint32* | minor | The minor portion of the semver version string. |
| *uint32* | patch | The patch portion of the semver version string. |
| *string* | preRelease | The pre-release portion of the semver version string.  Use empty string if the version string has no pre-release portion. |
| *string* | build | The build portion of the semver version string.  Use empty string if the version string has no build portion. |


## *function* getReleaseValidator

PackageIndexInterface.getReleaseValidator() `view` `4961b40c`

> Returns the address of the releaseValidator




## *function* getReleaseData

PackageIndexInterface.getReleaseData(releaseHash) `view` `4c4aea87`

> Returns the release data for the release associated with the given release hash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | The release hash. |


## *function* getAllReleaseHashes

PackageIndexInterface.getAllReleaseHashes() `view` `4cb71b9b`

> Returns an array of all release hashes for the named package.




## *function* transferPackageOwner

PackageIndexInterface.transferPackageOwner(name, newPackageOwner) `nonpayable` `4f197ee7`

**Will transfer ownership of this package to the provided new owner address.**

> Transfers package ownership to the provider new owner address.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |
| *address* | newPackageOwner | The address of the new owner. |


## *function* getReleaseHash

PackageIndexInterface.getReleaseHash(idx) `view` `57b07cd9`

> Returns the release hash at the provide index in the array of all release hashes.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | idx | The index of the release to retrieve. |


## *function* release

PackageIndexInterface.release(name, major, minor, patch, preRelease, build, releaseLockfileURI) `nonpayable` `5fcb568c`

**Will create a new release the given package with the given release information.**

> Creates a a new release for the named package.  If this is the first release for the given package then this will also assign msg.sender as the owner of the package.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |
| *uint32* | major | The major portion of the semver version string. |
| *uint32* | minor | The minor portion of the semver version string. |
| *uint32* | patch | The patch portion of the semver version string. |
| *string* | preRelease | The pre-release portion of the semver version string.  Use empty string if the version string has no pre-release portion. |
| *string* | build | The build portion of the semver version string.  Use empty string if the version string has no build portion. |
| *string* | releaseLockfileURI | The URI for the release lockfile for this release. |


## *function* getNumPackages

PackageIndexInterface.getNumPackages() `view` `7370a38d`

> Returns the number of packages in the index




## *function* getReleaseHashes

PackageIndexInterface.getReleaseHashes(offset, numReleases) `view` `79cce1c5`

> Returns a slice of the array of all release hashes for the named package.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | offset | The starting index for the slice. |
| *uint256* | numReleases | The length of the slice |


## *function* setAuthority

PackageIndexInterface.setAuthority(newAuthority) `nonpayable` `7a9e5e4b`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newAuthority | undefined |


## *function* packageExists

PackageIndexInterface.packageExists(name) `view` `83ea0620`

> Query the existence of a package with the given name.  Returns boolean indicating whether the package exists.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |


## *function* owner

PackageIndexInterface.owner() `view` `8da5cb5b`





## *function* authority

PackageIndexInterface.authority() `view` `bf7e214f`





## *function* getPackageData

PackageIndexInterface.getPackageData(name) `view` `c2ba5b40`

> Returns the package data.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |


## *function* getAllPackageReleaseHashes

PackageIndexInterface.getAllPackageReleaseHashes(name) `view` `c392f5a0`

> Returns an array of all release hashes for the named package.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |


## *function* getReleaseHashForPackage

PackageIndexInterface.getReleaseHashForPackage(name, releaseIdx) `view` `cec95aa1`

> Returns the release hash at the provide index in the array of release hashes for the given package.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |
| *uint256* | releaseIdx | The index of the release to retrieve. |


## *function* getPackageName

PackageIndexInterface.getPackageName(idx) `view` `cfe9a7b8`

> Returns the name of the package at the provided index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | idx | The index of the name hash to lookup. |


## *function* setReleaseDb

PackageIndexInterface.setReleaseDb(newReleaseDb) `nonpayable` `f314bf46`

> Sets the address of the ReleaseDb contract.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newReleaseDb | The address to set for the ReleaseDb. |


## *function* getReleaseDb

PackageIndexInterface.getReleaseDb() `view` `fb3a1fb2`

> Returns the address of the releaseDb



## *event* PackageRelease

PackageIndexInterface.PackageRelease(nameHash, releaseHash) `ac0f7a48`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | indexed |
| *bytes32* | releaseHash | indexed |

## *event* PackageTransfer

PackageIndexInterface.PackageTransfer(oldOwner, newOwner) `a99a0b26`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldOwner | indexed |
| *address* | newOwner | indexed |

## *event* OwnerUpdate

PackageIndexInterface.OwnerUpdate(oldOwner, newOwner) `34376542`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldOwner | indexed |
| *address* | newOwner | indexed |

## *event* AuthorityUpdate

PackageIndexInterface.AuthorityUpdate(oldAuthority, newAuthority) `a1d9e0b2`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldAuthority | indexed |
| *address* | newAuthority | indexed |


---