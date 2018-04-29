* [IndexedOrderedSetLib](#indexedorderedsetlib)
  * [size](#function-size)
  * [indexOf](#function-indexof)
  * [contains](#function-contains)
  * [get](#function-get)
  * [add](#function-add)
  * [remove](#function-remove)
  * [pop](#function-pop)

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