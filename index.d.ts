/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */

// https://github.com/glayzzle/php-reflection
declare module "php-reflection" {
  interface Options {
    // list of excluded directory names
    exclude?: String[];
    // list of included directories
    include?: String[];
    // list of php extension files
    ext?: String[];
    // extract vars from each scope (functions, classes)
    // may use memory but could be usefull for resolving
    // their type (on autocompletion)
    scanVars?: Boolean;
    // extract scopes from
    scanExpr?: Boolean;
    // default parsing encoding
    encoding?: String;
    // should spawn a worker process to avoir blocking
    // the main loop (may be slower with small projects or single cpu)
    forkWorker?: Number|Boolean,
    // use the file mtime property to check changes
    cacheByFileDate?: Boolean;
    // use the file size to detect changes
    cacheByFileSize?: Boolean;
    // use an hash algorithm to detect changes
    // if low cache hit, may slow down the parsing
    cacheByFileHash?: Boolean;
    // avoid to load the full cache repository
    // just loads files when they are requested
    // define a function that receives the filename in argumen
    // and return the file cached structure
    lazyCache?: Boolean;
  }

  type thenCallback = (myArgument: Function, reject: Function) => void;

  interface Thenable<T> {
    then(callback:thenCallback): Thenable<T>;
    catch(err:Error): Thenable<T>;
    all(promises: Thenable<T>[]): Thenable<T>;
  }

  interface EventEmitter {
    on(evt: String, callback: Function): EventEmitter;
    once(evt: String, callback: Function): EventEmitter;
    emit(evt: String, options: any): EventEmitter;
    emit(evt: String): EventEmitter;
  }

  interface RepositoryOptions {
    directory?: String;
    options?: Options;
  }

  interface Node {
  }

  interface Namespace extends Node {
  }

  interface File extends Node {
  }

  type fileCallback = (item: File) => void;


  /**
   * The repository
   */
  class Repository implements EventEmitter {
    directory: String;
    options: Options;
    constructor(directory:String, config: RepositoryOptions);
    constructor(directory:String);
    on(evt: String, callback: Function): EventEmitter;
    once(evt: String, callback: Function): EventEmitter;
    emit(evt: String, options: any): EventEmitter;
    emit(evt: String): EventEmitter;
    scan(directory: String): Thenable<Boolean>;
    scan(): Thenable<Boolean>;
    scope(filename: String, offset: Number): Thenable<File>;
    cache(): Object;
    cache(data: any): Repository;
    cleanAll(): Repository;
    each(cb: fileCallback): Repository;
    get(filename: String): Thenable<File>;
    parse(filename: String, encoding?: String, stat?: any): Thenable<File>;
    getByName(type: String, name: String, limit?: Number): Node[];
    getByType(type: String, limit?: Number): Node[];
    getFirstByName(type: String, name: String): Node;
    getNamespace(name: String): Namespace;
    refresh(filename: any, encoding: any, stat: any): Thenable<File>;
    remove(filename: String): Thenable<Boolean>;
    rename(oldName: String, newName: String): Thenable<Boolean>;
  }
  export default Repository;
}
