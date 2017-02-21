/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://glayzzle.com
 */

declare module "php-reflection" {

    import { graph, point } from "grafine";
    import { Tag, Annotation } from "doc-parser";

    class EventEmitter {
        addListener(type: any, listener: any): any;
        emit(type: any, ...args: any[]): EventEmitter;
        eventNames(): any;
        getMaxListeners(): any;
        listenerCount(type: any): any;
        listeners(type: any): any;
        on(type: any, listener: any):EventEmitter;
        once(type: any, listener: any): EventEmitter;
        prependListener(type: any, listener: any): any;
        prependOnceListener(type: any, listener: any): any;
        removeAllListeners(type: any, ...args: any[]): any;
        removeListener(type: any, listener: any): any;
        setMaxListeners(n: any): any;
    }


    export interface Options {
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
        lazyCache?: (type: String, name: String) => any;
        // used in order to shard big projects into separate files
        shardSize?: Number;
        // used in order group together symbol from a same file
        shardCapacity?: Number;
    }

    /**
     * Defines the location of the node
     */
    export class Position {
        start: {
            line: Number;
            column: Number;
        };
        end: {
            line: Number;
            column: Number;
        };
        offset: {
            start: Number;
            end: Number;
        };
        export(): any;
        import(data: any): Position;
        hit(offet: Number);
    }

    export class Comment {
        summary: String;
        tags: any;
        annotations: Annotation[];
        getAnnotation(name: String): Annotation;
        getAnnotations(name: String): Annotation[];
        getTag(name: String): Tag;
        getTags(name: String): Tag[];

    }

    export class Node extends point {
        position: Position;
        doc: Comment;
        protected consume(file:File, parent: Node, ast: any): void;
        indexName(name: String): Node;
        getRepository(): Repository;
        getFile(): File;
        getParent(): Node;
        getNamespace(): Namespace;
        eachChild(cb: (child: Node, index: Number) => void): Node;
        static extends(type: String): Node;
        static create(type: String, graph: graph): Node;
    }

    export class Block extends Node {
    }


    export class Namespace extends Block {
    }

    export class File extends point {
        getRepository(): Repository;
        setName(name: String): File;
        getName(): String;
        eachNode(cb: (child: Node, index: Number) => void): File;
        getFirstByName(type: String, name: String): Node;
        getByType(type: String): Node[];
        getNamespaces(): Namespace[];
        getClasses(): Class[];
        getInterfaces(): Interface[];
        getIncludes(): Node[];
        getClass(name: String): Class;
        getNamespace(name: String): Namespace;
        getScope(offset: Number): Scope;
    }

    export class Function extends Block {
        name: String;
        fullName: String;
        isClosure: Boolean;
        getArguments(): Variable[];
        getVariables(): Variable[];
    }

    export class Method extends Block {
        name: String;
        fullName: String;
        isStatic: Boolean;
        isFinal: Boolean;
        isAbstract: Boolean;
        isPublic: Boolean;
        isProtected: Boolean;
        isPrivate: Boolean;
        getArguments(): Variable[];
        getVariables(): Variable[];
        getClass(): Class|Trait|Interface;
    }

    export class Class extends Node {
        name: String;
        fullName: String;
        extends: String;
        implements: String[];
        isAbstract: Boolean;
        isFinal: Boolean;
        getExtends(): Class;
        getImplements(): Interface[];
        getProperties(includeParents?: Boolean): Property[];
        getConstants(includeParents?: Boolean): Constant[];
        getMethods(includeParents?: Boolean): Method[];
    }

    export class Trait extends Node {
    }

    export class Interface extends Node {
    }

    export class Constant extends Node {
        name: String;
    }

    export class Variable extends Node {
        name: String;
    }

    export class Property extends Node {
        name: String;
    }

    export class Scope {
        file: File;
        offset: Number[];
        namespace: Namespace;
        class: Class;
        trait: Trait;
        interface: Interface;
        method: Method;
        function:  Function;
        variables: Variable[];
    }


    /**
     * The repository
     */
    export class Repository extends EventEmitter {
        directory: String;
        options: Options;
        db: graph;
        constructor(directory:String, config: Options);
        constructor(directory:String);
        scan(directory: String): Promise<Boolean>;
        scan(): Promise<Boolean>;
        parse(filename: String, encoding?: String, stat?: any): Promise<File>;
        getByType(type: String): Node[];
        getByName(type: String, name: String, limit?: Number): Node[];
        getFirstByName(type: String, name: String): Node;
        getNamespace(name: String): Namespace;
        sync(filename: String, contents: String, offset?: Number[]): Promise<File>;
        cleanAll(): Repository;
        each(type: String, cb: (node:Node, name: String) => void): Repository;
        getScope(filename: String, offset: any): Scope;
        getFile(filename: String): File;
        hasFile(filename: String): Boolean;
        eachFile(cb: (node:File, name: String) => void): Repository;
        removeFile(filename: String): Repository;
        renameFile(oldName: String, newName: String): Repository;
        refresh(): Promise<File>;
    }
}
