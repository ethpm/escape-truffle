* [SemVersionLib](#semversionlib)
  * [isGreaterOrEqual](#function-isgreaterorequal)
  * [isGreater](#function-isgreater)
  * [concatByte](#function-concatbyte)
  * [init](#function-init)
  * [concat](#function-concat)
  * [isEqual](#function-isequal)

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