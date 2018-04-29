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
* [ReleaseDB](#releasedb)
  * [isLatestPreReleaseTree](#function-islatestprereleasetree)
  * [getReleaseHashForNameHash](#function-getreleasehashfornamehash)
  * [getMajorMinorPatch](#function-getmajorminorpatch)
  * [getNumReleases](#function-getnumreleases)
  * [hashVersion](#function-hashversion)
  * [setOwner](#function-setowner)
  * [getNumReleasesForNameHash](#function-getnumreleasesfornamehash)
  * [removeRelease](#function-removerelease)
  * [getReleaseLockfileURI](#function-getreleaselockfileuri)
  * [getLatestMajorTree](#function-getlatestmajortree)
  * [releaseExists](#function-releaseexists)
  * [getReleaseData](#function-getreleasedata)
  * [getLatestPatchTree](#function-getlatestpatchtree)
  * [getReleaseHash](#function-getreleasehash)
  * [setAuthority](#function-setauthority)
  * [updateLatestTree](#function-updatelatesttree)
  * [setRelease](#function-setrelease)
  * [getBuild](#function-getbuild)
  * [owner](#function-owner)
  * [hashRelease](#function-hashrelease)
  * [setVersion](#function-setversion)
  * [versionExists](#function-versionexists)
  * [authority](#function-authority)
  * [isLatestPatchTree](#function-islatestpatchtree)
  * [isLatestMinorTree](#function-islatestminortree)
  * [isLatestMajorTree](#function-islatestmajortree)
  * [getLatestPreReleaseTree](#function-getlatestprereleasetree)
  * [getLatestMinorTree](#function-getlatestminortree)
  * [getPreRelease](#function-getprerelease)
  * [ReleaseCreate](#event-releasecreate)
  * [ReleaseUpdate](#event-releaseupdate)
  * [ReleaseDelete](#event-releasedelete)
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
# ReleaseDB

Tim Coulter <tim.coulter@consensys.net>, Piper Merriam <pipermerriam@gmail.com>

## *function* isLatestPreReleaseTree

ReleaseDB.isLatestPreReleaseTree(nameHash, versionHash) `view` `02de2cf3`

> Returns boolean indicating whethe the given version hash is the latest version in the pre-release branch of the release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package to check against. |
| *bytes32* | versionHash | The versionHash of the version to check. |


## *function* getReleaseHashForNameHash

ReleaseDB.getReleaseHashForNameHash(nameHash, idx) `view` `0c26e42e`

> Get the total number of releases

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | the name hash to lookup. |
| *uint256* | idx | The index of the release hash to retrieve. |


## *function* getMajorMinorPatch

ReleaseDB.getMajorMinorPatch(versionHash) `view` `0c4326a0`

> Returns a 3-tuple of the major, minor, and patch components from the version of the given release hash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | versionHash | the version hash |


## *function* getNumReleases

ReleaseDB.getNumReleases() `view` `0ccec396`

> Get the total number of releases




## *function* hashVersion

ReleaseDB.hashVersion(major, minor, patch, preRelease, build) `pure` `0e5ffb3c`

> Returns version hash for the given semver version.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint32* | major | The major portion of the semver version string. |
| *uint32* | minor | The minor portion of the semver version string. |
| *uint32* | patch | The patch portion of the semver version string. |
| *string* | preRelease | The pre-release portion of the semver version string.  Use empty string if the version string has no pre-release portion. |
| *string* | build | The build portion of the semver version string.  Use empty string if the version string has no build portion. |


## *function* setOwner

ReleaseDB.setOwner(newOwner) `nonpayable` `13af4035`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* getNumReleasesForNameHash

ReleaseDB.getNumReleasesForNameHash(nameHash) `view` `173cb7de`

> Get the total number of releases

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | the name hash to lookup. |


## *function* removeRelease

ReleaseDB.removeRelease(releaseHash, reason) `nonpayable` `244fcd03`

> Removes a release from a package.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | The release hash to be removed |
| *string* | reason | Explanation for why the removal happened. |


## *function* getReleaseLockfileURI

ReleaseDB.getReleaseLockfileURI(releaseHash) `view` `2ffb8631`

> Returns the URI of the release lockfile for the given release hash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | Release hash |


## *function* getLatestMajorTree

ReleaseDB.getLatestMajorTree(nameHash) `view` `3ae9b510`

> Returns the release hash of the latest release in the major branch of the package release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package |


## *function* releaseExists

ReleaseDB.releaseExists(releaseHash) `view` `3f415772`

> Query the existence of a release at the provided version for a package.  Returns boolean indicating whether such a release exists.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | The release hash to query. |


## *function* getReleaseData

ReleaseDB.getReleaseData(releaseHash) `view` `4c4aea87`

> Returns the releaseHash at the given index for a package.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | The release hash. |


## *function* getLatestPatchTree

ReleaseDB.getLatestPatchTree(nameHash, major, minor) `view` `5263ba87`

> Returns the release hash of the latest release in the patch branch of the package release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package |
| *uint32* | major | The branch of the major portion of the release tree to check. |
| *uint32* | minor | The branch of the minor portion of the release tree to check. |


## *function* getReleaseHash

ReleaseDB.getReleaseHash(idx) `view` `57b07cd9`

> Get the total number of releases

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | idx | The index of the release hash to retrieve. |


## *function* setAuthority

ReleaseDB.setAuthority(newAuthority) `nonpayable` `7a9e5e4b`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newAuthority | undefined |


## *function* updateLatestTree

ReleaseDB.updateLatestTree(releaseHash) `nonpayable` `89859b50`

> Updates each branch of the tree, replacing the current leaf node with this release hash if this release hash should be the new leaf.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | The releaseHash to check. |


## *function* setRelease

ReleaseDB.setRelease(nameHash, versionHash, releaseLockfileURI) `nonpayable` `8b859409`

> Creates or updates a release for a package.  Returns success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash of the package. |
| *bytes32* | versionHash | The version hash for the release version. |
| *string* | releaseLockfileURI | The URI for the release lockfile for this release. |


## *function* getBuild

ReleaseDB.getBuild(releaseHash) `view` `8ca4eef6`

> Returns the build string from the version of the given release hash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | Release hash |


## *function* owner

ReleaseDB.owner() `view` `8da5cb5b`





## *function* hashRelease

ReleaseDB.hashRelease(nameHash, versionHash) `pure` `93d79105`

> Returns release hash for the given release

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The name hash of the package name. |
| *bytes32* | versionHash | The version hash for the release version. |


## *function* setVersion

ReleaseDB.setVersion(major, minor, patch, preRelease, build) `nonpayable` `a10889fa`

> Adds the given version to the local version database.  Returns the versionHash for the provided version.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint32* | major | The major portion of the semver version string. |
| *uint32* | minor | The minor portion of the semver version string. |
| *uint32* | patch | The patch portion of the semver version string. |
| *string* | preRelease | The pre-release portion of the semver version string.  Use empty string if the version string has no pre-release portion. |
| *string* | build | The build portion of the semver version string.  Use empty string if the version string has no build portion. |


## *function* versionExists

ReleaseDB.versionExists(versionHash) `view` `bb814e9e`

> Query the existence of the provided version in the recorded versions.  Returns boolean indicating whether such a version exists.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | versionHash | the version hash to check. |


## *function* authority

ReleaseDB.authority() `view` `bf7e214f`





## *function* isLatestPatchTree

ReleaseDB.isLatestPatchTree(nameHash, versionHash) `view` `c233e870`

> Returns boolean indicating whethe the given version hash is the latest version in the patch branch of the release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package to check against. |
| *bytes32* | versionHash | The versionHash of the version to check. |


## *function* isLatestMinorTree

ReleaseDB.isLatestMinorTree(nameHash, versionHash) `view` `d1f59db9`

> Returns boolean indicating whethe the given version hash is the latest version in the minor branch of the release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package to check against. |
| *bytes32* | versionHash | The versionHash of the version to check. |


## *function* isLatestMajorTree

ReleaseDB.isLatestMajorTree(nameHash, versionHash) `view` `d7cc8362`

> Returns boolean indicating whethe the given version hash is the latest version in the major branch of the release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package to check against. |
| *bytes32* | versionHash | The versionHash of the version to check. |


## *function* getLatestPreReleaseTree

ReleaseDB.getLatestPreReleaseTree(nameHash, major, minor, patch) `view` `dea9c72b`

> Returns the release hash of the latest release in the pre-release branch of the package release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package |
| *uint32* | major | The branch of the major portion of the release tree to check. |
| *uint32* | minor | The branch of the minor portion of the release tree to check. |
| *uint32* | patch | The branch of the patch portion of the release tree to check. |


## *function* getLatestMinorTree

ReleaseDB.getLatestMinorTree(nameHash, major) `view` `f2f254c7`

> Returns the release hash of the latest release in the minor branch of the package release tree.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | nameHash | The nameHash of the package |
| *uint32* | major | The branch of the major portion of the release tree to check. |


## *function* getPreRelease

ReleaseDB.getPreRelease(releaseHash) `view` `fac5bb92`

> Returns the pre-release string from the version of the given release hash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | Release hash |

## *event* ReleaseCreate

ReleaseDB.ReleaseCreate(releaseHash) `eb3a047e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | indexed |

## *event* ReleaseUpdate

ReleaseDB.ReleaseUpdate(releaseHash) `421b7058`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | indexed |

## *event* ReleaseDelete

ReleaseDB.ReleaseDelete(releaseHash, reason) `72f61f92`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | releaseHash | indexed |
| *string* | reason | not indexed |

## *event* OwnerUpdate

ReleaseDB.OwnerUpdate(oldOwner, newOwner) `34376542`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldOwner | indexed |
| *address* | newOwner | indexed |

## *event* AuthorityUpdate

ReleaseDB.AuthorityUpdate(oldAuthority, newAuthority) `a1d9e0b2`

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