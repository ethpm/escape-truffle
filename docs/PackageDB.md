* [Authority](#authority)
  * [canCall](#function-cancall)
* [IndexedOrderedSetLib](#indexedorderedsetlib)
  * [size](#function-size)
  * [indexOf](#function-indexof)
  * [contains](#function-contains)
  * [get](#function-get)
  * [add](#function-add)
  * [remove](#function-remove)
  * [pop](#function-pop)
* [PackageDB](#packagedb)
  * [removePackage](#function-removepackage)
  * [getPackageName](#function-getpackagename)
  * [setPackage](#function-setpackage)
  * [setOwner](#function-setowner)
  * [setPackageOwner](#function-setpackageowner)
  * [getNumPackages](#function-getnumpackages)
  * [setAuthority](#function-setauthority)
  * [owner](#function-owner)
  * [getPackageNameHash](#function-getpackagenamehash)
  * [packageExists](#function-packageexists)
  * [hashName](#function-hashname)
  * [getPackageData](#function-getpackagedata)
  * [authority](#function-authority)
  * [PackageReleaseAdd](#event-packagereleaseadd)
  * [PackageReleaseRemove](#event-packagereleaseremove)
  * [PackageCreate](#event-packagecreate)
  * [PackageDelete](#event-packagedelete)
  * [PackageOwnerUpdate](#event-packageownerupdate)
  * [OwnerUpdate](#event-ownerupdate)
  * [AuthorityUpdate](#event-authorityupdate)
* [SemVersionLib](#semversionlib)
  * [isGreaterOrEqual](#function-isgreaterorequal)
  * [isGreater](#function-isgreater)
  * [concatByte](#function-concatbyte)
  * [init](#function-init)
  * [concat](#function-concat)
  * [isEqual](#function-isequal)

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
# IndexedOrderedSetLib

Piper Merriam <pipermerriam@gmail.com>

## *function* size

IndexedOrderedSetLib.size(self) `view` `1aeaa504`

> Returns the size of the set

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |


## *function* indexOf

IndexedOrderedSetLib.indexOf(self, value) `view` `26966f11`

> Returns the index of the value in the set.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |
| *bytes32* | value | The value to look up the index for. |


## *function* contains

IndexedOrderedSetLib.contains(self, value) `view` `2a2dbb48`

> Returns boolean if the key is in the set

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |
| *bytes32* | value | The value to check |


## *function* get

IndexedOrderedSetLib.get(self, idx) `view` `77e91da1`

> Retrieves the element at the provided index.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |
| *uint256* | idx | The index to retrieve. |


## *function* add

IndexedOrderedSetLib.add(self, value) `nonpayable` `91d8a284`

> Pushes the new value onto the set

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |
| *bytes32* | value | The value to push. |


## *function* remove

IndexedOrderedSetLib.remove(self, value) `nonpayable` `ed05c0c5`

> Removes the element at index idx from the set

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |
| *bytes32* | value | The value to remove from the set. |


## *function* pop

IndexedOrderedSetLib.pop(self, idx) `nonpayable` `f78a9f95`

> Removes the element at index idx from the set and returns it.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *IndexedOrderedSetLib.IndexedOrderedSet storage* | self | The set |
| *uint256* | idx | The index to remove and return. |


---
# PackageDB

Tim Coulter <tim.coulter@consensys.net>, Piper Merriam <pipermerriam@gmail.com>

## *function* removePackage

PackageDB.removePackage(nameHash, reason) `nonpayable` `001f8d11`

> Removes a package from the package db.  Packages with existing releases may not be removed.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash of a package. |
| *string* | reason | undefined |


## *function* getPackageName

PackageDB.getPackageName(nameHash) `view` `06fe1fd7`

> Returns the package name for the given namehash

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash to look up. |


## *function* setPackage

PackageDB.setPackage(name) `nonpayable` `083ae1fe`

> Creates or updates a release for a package.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |


## *function* setOwner

PackageDB.setOwner(newOwner) `nonpayable` `13af4035`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* setPackageOwner

PackageDB.setPackageOwner(nameHash, newPackageOwner) `nonpayable` `2406cedb`

> Sets the owner of a package to the provided address.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash of a package. |
| *address* | newPackageOwner | The address of the new owner. |


## *function* getNumPackages

PackageDB.getNumPackages() `view` `7370a38d`

> Return the total number of packages




## *function* setAuthority

PackageDB.setAuthority(newAuthority) `nonpayable` `7a9e5e4b`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newAuthority | undefined |


## *function* owner

PackageDB.owner() `view` `8da5cb5b`





## *function* getPackageNameHash

PackageDB.getPackageNameHash(idx) `view` `95f0684b`

> Returns package namehash at the provided index from the set of all known name hashes.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | idx | The index of the package name hash to retrieve. |


## *function* packageExists

PackageDB.packageExists(nameHash) `view` `a9b35240`

> Query the existence of a package with the given name.  Returns boolean indicating whether the package exists.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash of a package. |


## *function* hashName

PackageDB.hashName(name) `pure` `af9a3f9b`

> Returns name hash for a given package name.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | Package name |


## *function* getPackageData

PackageDB.getPackageData(nameHash) `view` `b4d6d4c7`

> Returns information about the package.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash to look up. |


## *function* authority

PackageDB.authority() `view` `bf7e214f`




## *event* PackageReleaseAdd

PackageDB.PackageReleaseAdd(nameHash, releaseHash) `e7fefc87`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | indexed |
| *bytes32* | releaseHash | indexed |

## *event* PackageReleaseRemove

PackageDB.PackageReleaseRemove(nameHash, releaseHash) `1d5ef209`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | indexed |
| *bytes32* | releaseHash | indexed |

## *event* PackageCreate

PackageDB.PackageCreate(nameHash) `94d68ac0`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | indexed |

## *event* PackageDelete

PackageDB.PackageDelete(nameHash, reason) `188d63b2`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | indexed |
| *string* | reason | not indexed |

## *event* PackageOwnerUpdate

PackageDB.PackageOwnerUpdate(nameHash, oldOwner, newOwner) `fe2ec6b3`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | indexed |
| *address* | oldOwner | indexed |
| *address* | newOwner | indexed |

## *event* OwnerUpdate

PackageDB.OwnerUpdate(oldOwner, newOwner) `34376542`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldOwner | indexed |
| *address* | newOwner | indexed |

## *event* AuthorityUpdate

PackageDB.AuthorityUpdate(oldAuthority, newAuthority) `a1d9e0b2`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldAuthority | indexed |
| *address* | newAuthority | indexed |


---
# SemVersionLib

Piper Merriam <pipermerriam@gmail.com>

## *function* isGreaterOrEqual

SemVersionLib.isGreaterOrEqual(self, other) `view` `02abe853`

> Return boolean indicating if the first SemVersion object is considered greater than or equal to the second.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *SemVersionLib.SemVersion storage* | self | The first SemVersion |
| *SemVersionLib.SemVersion storage* | other | The second SemVersion |


## *function* isGreater

SemVersionLib.isGreater(self, other) `view` `3359a31e`

> Return boolean indicating if the first SemVersion object is considered strictly greater than the second.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *SemVersionLib.SemVersion storage* | self | The first SemVersion |
| *SemVersionLib.SemVersion storage* | other | The second SemVersion |


## *function* concatByte

SemVersionLib.concatByte(value, b) `nonpayable` `3725624e`

> Concatenates the provided byte to the end of the provided string.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string storage* | value | The string to append the byte to. |
| *bytes1* | b | The byte. |


## *function* init

SemVersionLib.init(self, major, minor, patch, preRelease, build) `nonpayable` `3f3815d4`

> Initialize a SemVersion struct

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *SemVersionLib.SemVersion storage* | self | The SemVersion object to initialize. |
| *uint32* | major | The major portion of the semver version string. |
| *uint32* | minor | The minor portion of the semver version string. |
| *uint32* | patch | The patch portion of the semver version string. |
| *string* | preRelease | The pre-release portion of the semver version string.  Use empty string if the version string has no pre-release portion. |
| *string* | build | The build portion of the semver version string.  Use empty string if the version string has no build portion. |


## *function* concat

SemVersionLib.concat(_head, tail) `nonpayable` `bcf1ee23`

> Concatenates the two strings together.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string storage* | _head | The first string |
| *string* | tail | The second string |


## *function* isEqual

SemVersionLib.isEqual(self, other) `view` `f9e724a5`

> Return boolean indicating if the two SemVersion objects are considered equal

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *SemVersionLib.SemVersion storage* | self | The first SemVersion |
| *SemVersionLib.SemVersion storage* | other | The second SemVersion |


---