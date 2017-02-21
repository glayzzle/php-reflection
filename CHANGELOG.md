## [Version 2.2.0](https://github.com/glayzzle/php-reflection/releases/tag/v2.2.0) (2017-2-22)

### Major Changes

- the sync method is now a promise: [`0e1cf11`](https://github.com/glayzzle/php-reflection/commit/0e1cf11)
- change the API / expose all classes: [`8da17c7`](https://github.com/glayzzle/php-reflection/commit/8da17c7)

### Minor Changes

- update the typescript definition: [`d34a3c8`](https://github.com/glayzzle/php-reflection/commit/d34a3c8)
- release: [`0e32a77`](https://github.com/glayzzle/php-reflection/commit/0e32a77)

[...full changes](https://github.com/glayzzle/php-reflection/compare/v2.1.0...v2.2.0)

## [Version 2.1.0](https://github.com/glayzzle/php-reflection/releases/tag/v2.1.0) (2017-2-19)

### Minor Changes

- https://github.com/glayzzle/php-reflection/issues/12 finish to implement nodes replacement: [`c61106e`](https://github.com/glayzzle/php-reflection/commit/c61106e)
- implement recusive deletion (node and its childs): [`7ff0740`](https://github.com/glayzzle/php-reflection/commit/7ff0740)
- https://github.com/glayzzle/php-reflection/issues/12 add tests on incremental parsing: [`b3924c8`](https://github.com/glayzzle/php-reflection/commit/b3924c8)
- add a new getFQN helper on namespace: [`3e4704f`](https://github.com/glayzzle/php-reflection/commit/3e4704f)

### Patches

- fix variable kind detection: [`84fa325`](https://github.com/glayzzle/php-reflection/commit/84fa325)

[...full changes](https://github.com/glayzzle/php-reflection/compare/v2.0.0...v2.1.0)

## [Version 2.0.0](https://github.com/glayzzle/php-reflection/releases/tag/v2.0.0) (2017-2-19)

### Major Changes

- https://github.com/glayzzle/php-reflection/issues/12 start a prototype / WIP: [`33a07c9`](https://github.com/glayzzle/php-reflection/commit/33a07c9)
- https://github.com/glayzzle/php-reflection/issues/12 refactor/cleanup code - put parsing into a separate file: [`b72b27b`](https://github.com/glayzzle/php-reflection/commit/b72b27b)
- https://github.com/glayzzle/php-reflection/issues/12 rewrite parsing & fix the nodes detection on sync: [`9f19fc1`](https://github.com/glayzzle/php-reflection/commit/9f19fc1)
- move graph implementation to grafine project: [`048331d`](https://github.com/glayzzle/php-reflection/commit/048331d)
- split the code / more clean: [`ed76ce4`](https://github.com/glayzzle/php-reflection/commit/ed76ce4)
- https://github.com/glayzzle/php-reflection/issues/15 use node as point & start export/import helpers: [`61a6cb8`](https://github.com/glayzzle/php-reflection/commit/61a6cb8)
- migrate node functions with new framework: [`2b7097d`](https://github.com/glayzzle/php-reflection/commit/2b7097d)
- update api: [`f03b0f7`](https://github.com/glayzzle/php-reflection/commit/f03b0f7)
- make renameFile more consistent: [`403d982`](https://github.com/glayzzle/php-reflection/commit/403d982)
- make members protected: [`62d6f53`](https://github.com/glayzzle/php-reflection/commit/62d6f53)

### Minor Changes

- add magento2 for testing: [`d0a7177`](https://github.com/glayzzle/php-reflection/commit/d0a7177)
- add a brute force test with magento: [`6512d61`](https://github.com/glayzzle/php-reflection/commit/6512d61)
- add typescript definition: [`a61576a`](https://github.com/glayzzle/php-reflection/commit/a61576a)
- Merge branch 'master' of https://github.com/glayzzle/php-reflection: [`17bdc88`](https://github.com/glayzzle/php-reflection/commit/17bdc88)
- add a new scanDocs options and use scan* options: [`f4fc83c`](https://github.com/glayzzle/php-reflection/commit/f4fc83c)
- using current time as mtime + start a removeNode helper: [`fefecd9`](https://github.com/glayzzle/php-reflection/commit/fefecd9)
- https://github.com/glayzzle/php-reflection/issues/12 implement the node removal: [`60b16ab`](https://github.com/glayzzle/php-reflection/commit/60b16ab)
- https://github.com/glayzzle/php-reflection/issues/12 store parser states in nodes: [`3ebfa50`](https://github.com/glayzzle/php-reflection/commit/3ebfa50)
- https://github.com/glayzzle/php-reflection/issues/14 moved all files: [`7a2b281`](https://github.com/glayzzle/php-reflection/commit/7a2b281)
- https://github.com/glayzzle/php-reflection/issues/13 start a minimalistic implementation for fun & bench: [`422e6c6`](https://github.com/glayzzle/php-reflection/commit/422e6c6)
- implement finders: [`d3b0541`](https://github.com/glayzzle/php-reflection/commit/d3b0541)
- make the reflection api more consistent + fixes: [`60abbc9`](https://github.com/glayzzle/php-reflection/commit/60abbc9)
- add a crc32 hashing function: [`5185aac`](https://github.com/glayzzle/php-reflection/commit/5185aac)
- implement node creation: [`3c3dc6c`](https://github.com/glayzzle/php-reflection/commit/3c3dc6c)
- update the parsing algorithm: [`c405af1`](https://github.com/glayzzle/php-reflection/commit/c405af1)
- add a new type of node: [`e610603`](https://github.com/glayzzle/php-reflection/commit/e610603)
- migrate namespace with new api: [`c628e8c`](https://github.com/glayzzle/php-reflection/commit/c628e8c)
- migrate file node with new api: [`2c08c89`](https://github.com/glayzzle/php-reflection/commit/2c08c89)
- add a new eachChild helper: [`c3388c8`](https://github.com/glayzzle/php-reflection/commit/c3388c8)
- migrate blocks with new api: [`71ee42d`](https://github.com/glayzzle/php-reflection/commit/71ee42d)
- migrate declare node with new api: [`35b552e`](https://github.com/glayzzle/php-reflection/commit/35b552e)
- add a new option : shardCapacity: [`252754c`](https://github.com/glayzzle/php-reflection/commit/252754c)
- index namespace name: [`49fc26a`](https://github.com/glayzzle/php-reflection/commit/49fc26a)
- migrate include/require to new structure: [`2d81cc8`](https://github.com/glayzzle/php-reflection/commit/2d81cc8)
- migrate the class definition to new structure: [`52d7bb9`](https://github.com/glayzzle/php-reflection/commit/52d7bb9)
- use new api: [`90a8386`](https://github.com/glayzzle/php-reflection/commit/90a8386)
- update scope with the new api: [`a0c4afb`](https://github.com/glayzzle/php-reflection/commit/a0c4afb)
- implement getBy* and namespace retrieval: [`31eeec9`](https://github.com/glayzzle/php-reflection/commit/31eeec9)
- add a consumeClassBody helper & migrate to new api: [`2efbf2f`](https://github.com/glayzzle/php-reflection/commit/2efbf2f)
- add mocha tests on debug: [`3e771c9`](https://github.com/glayzzle/php-reflection/commit/3e771c9)

### Patches

- fix bench termination: [`72e97c1`](https://github.com/glayzzle/php-reflection/commit/72e97c1)
- remove bad ref: [`ae39a97`](https://github.com/glayzzle/php-reflection/commit/ae39a97)
- add magento dependency: [`05a79e1`](https://github.com/glayzzle/php-reflection/commit/05a79e1)
- add a promise helper in order to catch error + use a smaller bruteforce repository: [`b58639b`](https://github.com/glayzzle/php-reflection/commit/b58639b)
- fix filename resolution: [`abbc065`](https://github.com/glayzzle/php-reflection/commit/abbc065)
- https://github.com/glayzzle/php-reflection/issues/12 only container blocks can be synced: [`694e626`](https://github.com/glayzzle/php-reflection/commit/694e626)
- fix function creators: [`d0ec559`](https://github.com/glayzzle/php-reflection/commit/d0ec559)
- fix bootstrap: [`baf18a7`](https://github.com/glayzzle/php-reflection/commit/baf18a7)
- fix with new api: [`5fcc465`](https://github.com/glayzzle/php-reflection/commit/5fcc465)
- fixes - try to pass tests: [`21b2910`](https://github.com/glayzzle/php-reflection/commit/21b2910)
- removes automatic index on name: [`ee91fea`](https://github.com/glayzzle/php-reflection/commit/ee91fea)
- fix type inheritance overwrite: [`27c5f12`](https://github.com/glayzzle/php-reflection/commit/27c5f12)
- fix symbols counter: [`278fe31`](https://github.com/glayzzle/php-reflection/commit/278fe31)
- fix lastDoc assignation: [`9732468`](https://github.com/glayzzle/php-reflection/commit/9732468)
- fix nodes calculation / for stats: [`999d15d`](https://github.com/glayzzle/php-reflection/commit/999d15d)
- use _db instead of graph property: [`088ae31`](https://github.com/glayzzle/php-reflection/commit/088ae31)
- fix block initialisation: [`6d08b0f`](https://github.com/glayzzle/php-reflection/commit/6d08b0f)
- make pass main tests: [`6b1cfbd`](https://github.com/glayzzle/php-reflection/commit/6b1cfbd)
- fix export/import & pass tests on serialize: [`89b65fd`](https://github.com/glayzzle/php-reflection/commit/89b65fd)
- fix nodes iterators + update sync code: [`89632db`](https://github.com/glayzzle/php-reflection/commit/89632db)
- fix buffer creation for crc32, compliant with node4: [`23eccdc`](https://github.com/glayzzle/php-reflection/commit/23eccdc)
- update nodejs versions: [`e375bb6`](https://github.com/glayzzle/php-reflection/commit/e375bb6)

[...full changes](https://github.com/glayzzle/php-reflection/compare/v1.1.0...v2.0.0)

## [Version 1.1.0](https://github.com/glayzzle/php-reflection/releases/tag/v1.1.0) (2017-1-24)

### Patches

- use version 1.1.0: [`e0a0fe3`](https://github.com/glayzzle/php-reflection/commit/e0a0fe3)

[...full changes](https://github.com/glayzzle/php-reflection/compare/v0.1.0...v1.1.0)

## [Version 1.1.0](https://github.com/glayzzle/php-reflection/releases/tag/v1.1.0) (2017-01-24)

### Major Changes

- add next expr node + implement constants: [`9087a31`](https://github.com/glayzzle/php-reflection/commit/9087a31)
- various changes: [`aa71467`](https://github.com/glayzzle/php-reflection/commit/aa71467)
- configure CI: [`eb40797`](https://github.com/glayzzle/php-reflection/commit/eb40797)
- automate tests & doc - watch: [`051f698`](https://github.com/glayzzle/php-reflection/commit/051f698)
- start PTR: [`af1c566`](https://github.com/glayzzle/php-reflection/commit/af1c566)
- rewrite the tree structure: [`b67d42e`](https://github.com/glayzzle/php-reflection/commit/b67d42e)
- impl var: [`0df463e`](https://github.com/glayzzle/php-reflection/commit/0df463e)
- add a scan function: [`b2c4f4d`](https://github.com/glayzzle/php-reflection/commit/b2c4f4d)
- implement relations: [`1d0b9cf`](https://github.com/glayzzle/php-reflection/commit/1d0b9cf)
- implement annotations: [`6523f30`](https://github.com/glayzzle/php-reflection/commit/6523f30)
- refactoring doc lexer & parser: [`29c3009`](https://github.com/glayzzle/php-reflection/commit/29c3009)
- migrate file class: [`17e5787`](https://github.com/glayzzle/php-reflection/commit/17e5787)
- migrate declare & expr node: [`2b9c68f`](https://github.com/glayzzle/php-reflection/commit/2b9c68f)
- migrate include/require: [`d61d83f`](https://github.com/glayzzle/php-reflection/commit/d61d83f)
- migrate variable: [`ecf1f8c`](https://github.com/glayzzle/php-reflection/commit/ecf1f8c)
- migrate constant: [`2caeae3`](https://github.com/glayzzle/php-reflection/commit/2caeae3)
- replaced docblocks with external doc-parser lib: [`6566269`](https://github.com/glayzzle/php-reflection/commit/6566269)
- impl function: [`10c3fcd`](https://github.com/glayzzle/php-reflection/commit/10c3fcd)
- implement define node: [`747384a`](https://github.com/glayzzle/php-reflection/commit/747384a)
- implement interface: [`812aa42`](https://github.com/glayzzle/php-reflection/commit/812aa42)
- migrate properties: [`f72fcbb`](https://github.com/glayzzle/php-reflection/commit/f72fcbb)
- migrate use & const statements into block (more generic): [`438db42`](https://github.com/glayzzle/php-reflection/commit/438db42)
- implement traits: [`d7d5b17`](https://github.com/glayzzle/php-reflection/commit/d7d5b17)
- implement file getter on includes/requires: [`dd80466`](https://github.com/glayzzle/php-reflection/commit/dd80466)
- https://github.com/glayzzle/php-reflection/issues/10 migrate method: [`73e09e5`](https://github.com/glayzzle/php-reflection/commit/73e09e5)

### Minor Changes

- Initial commit: [`d9a3cfb`](https://github.com/glayzzle/php-reflection/commit/d9a3cfb)
- improve documentation: [`5c7afd5`](https://github.com/glayzzle/php-reflection/commit/5c7afd5)
- update doc: [`7df0295`](https://github.com/glayzzle/php-reflection/commit/7df0295)
- make a generic documentation generator: [`d3f9c78`](https://github.com/glayzzle/php-reflection/commit/d3f9c78)
- changes: [`041ee53`](https://github.com/glayzzle/php-reflection/commit/041ee53)
- impl: [`c4d2006`](https://github.com/glayzzle/php-reflection/commit/c4d2006)
- update docs: [`4c254ef`](https://github.com/glayzzle/php-reflection/commit/4c254ef)
- update the doc: [`4a29a53`](https://github.com/glayzzle/php-reflection/commit/4a29a53)
- move use to namespace level: [`613b7bf`](https://github.com/glayzzle/php-reflection/commit/613b7bf)
- resolve a inner class name: [`1095f97`](https://github.com/glayzzle/php-reflection/commit/1095f97)
- parent argument becomes optional: [`68efdb5`](https://github.com/glayzzle/php-reflection/commit/68efdb5)
- impl a new getNamespace helper: [`b634f53`](https://github.com/glayzzle/php-reflection/commit/b634f53)
- attach documentation with the class node: [`7eccba3`](https://github.com/glayzzle/php-reflection/commit/7eccba3)
- add sse4_crc32 & webworker-threads dependencies: [`46a8a2c`](https://github.com/glayzzle/php-reflection/commit/46a8a2c)
- https://github.com/glayzzle/php-reflection/issues/9 start the worker/pool class: [`9550752`](https://github.com/glayzzle/php-reflection/commit/9550752)
- https://github.com/glayzzle/php-reflection/issues/9 start to use worker (with option): [`c4eef70`](https://github.com/glayzzle/php-reflection/commit/c4eef70)
- implement the worker process (wip): [`e35ffdf`](https://github.com/glayzzle/php-reflection/commit/e35ffdf)
- handle position nodes: [`6dfaedb`](https://github.com/glayzzle/php-reflection/commit/6dfaedb)
- update block scanner: [`a011aaf`](https://github.com/glayzzle/php-reflection/commit/a011aaf)
- attach doc nodes: [`fa47027`](https://github.com/glayzzle/php-reflection/commit/fa47027)
- update the comments component: [`a7a400f`](https://github.com/glayzzle/php-reflection/commit/a7a400f)
- add new & parameter parsing for variables: [`22709c2`](https://github.com/glayzzle/php-reflection/commit/22709c2)
- parse use statements & implement namespace resolution: [`cb3e4b4`](https://github.com/glayzzle/php-reflection/commit/cb3e4b4)
- use nodeName resolution: [`43ca063`](https://github.com/glayzzle/php-reflection/commit/43ca063)
- add a getRepository helper function: [`f2f8a65`](https://github.com/glayzzle/php-reflection/commit/f2f8a65)
- add import helper on file (wip): [`32775e0`](https://github.com/glayzzle/php-reflection/commit/32775e0)

### Patches

- improve documentation: [`3da6cfa`](https://github.com/glayzzle/php-reflection/commit/3da6cfa)
- update doc: [`a3ae4e4`](https://github.com/glayzzle/php-reflection/commit/a3ae4e4)
- fix properties on doc: [`2a750d6`](https://github.com/glayzzle/php-reflection/commit/2a750d6)
- fix class name on doc: [`f516a8e`](https://github.com/glayzzle/php-reflection/commit/f516a8e)
- add badges: [`9293f0e`](https://github.com/glayzzle/php-reflection/commit/9293f0e)
- add coveralls dependency: [`6cc0c47`](https://github.com/glayzzle/php-reflection/commit/6cc0c47)
- fix reference name: [`de55ad7`](https://github.com/glayzzle/php-reflection/commit/de55ad7)
- start to explain relations: [`d400baa`](https://github.com/glayzzle/php-reflection/commit/d400baa)
- fix encoding: [`1853f71`](https://github.com/glayzzle/php-reflection/commit/1853f71)
- fix syntax: [`bb74083`](https://github.com/glayzzle/php-reflection/commit/bb74083)
- fix offset position: [`6d8edd8`](https://github.com/glayzzle/php-reflection/commit/6d8edd8)
- fix getByName fn: [`b994e34`](https://github.com/glayzzle/php-reflection/commit/b994e34)
- fix missing last char: [`00d119c`](https://github.com/glayzzle/php-reflection/commit/00d119c)
- release docs: [`10eb0f1`](https://github.com/glayzzle/php-reflection/commit/10eb0f1)
- improve test coverage: [`b3c3f6e`](https://github.com/glayzzle/php-reflection/commit/b3c3f6e)
- repository emit events + fix tunic dependency: [`f4ccc53`](https://github.com/glayzzle/php-reflection/commit/f4ccc53)
- fix lexer & use comment tags as fallback for annotations: [`00956e9`](https://github.com/glayzzle/php-reflection/commit/00956e9)
- use php-parser@0.1.4: [`32aa6f2`](https://github.com/glayzzle/php-reflection/commit/32aa6f2)
- fix namespace separator: [`ad4388b`](https://github.com/glayzzle/php-reflection/commit/ad4388b)
- fixes & migrate class / namespace: [`b3eb158`](https://github.com/glayzzle/php-reflection/commit/b3eb158)
- fix tag property: [`80b1761`](https://github.com/glayzzle/php-reflection/commit/80b1761)
- fix namespace type property: [`04adce8`](https://github.com/glayzzle/php-reflection/commit/04adce8)
- fix var names: [`e2ed7e9`](https://github.com/glayzzle/php-reflection/commit/e2ed7e9)
- add an syntax error file: [`5fa5723`](https://github.com/glayzzle/php-reflection/commit/5fa5723)
- improve test scenario: [`70d0bb5`](https://github.com/glayzzle/php-reflection/commit/70d0bb5)
- add a testing tool: [`5f13f70`](https://github.com/glayzzle/php-reflection/commit/5f13f70)
- fix the worker process: [`521f0b2`](https://github.com/glayzzle/php-reflection/commit/521f0b2)
- protect parsing (in principle never reached - just for dev purpose: [`0b10f31`](https://github.com/glayzzle/php-reflection/commit/0b10f31)
- fix error when ast is not defined / or use ast node prefix not defined: [`68979a9`](https://github.com/glayzzle/php-reflection/commit/68979a9)
- add ptr require / undefined before: [`97652cb`](https://github.com/glayzzle/php-reflection/commit/97652cb)
- add ptr require / undefined before: [`1077058`](https://github.com/glayzzle/php-reflection/commit/1077058)
- protect constructor when ast node is not passed as argument (import mode): [`78bd995`](https://github.com/glayzzle/php-reflection/commit/78bd995)
- fix worker: [`e55dd26`](https://github.com/glayzzle/php-reflection/commit/e55dd26)
- various changes / run pass: [`34558ef`](https://github.com/glayzzle/php-reflection/commit/34558ef)
