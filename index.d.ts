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
        // enables the debug mode
        debug?: Boolean;
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
        // extract documentation from
        scanDocs?: Boolean;
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
            line: number;
            column: number;
        };
        end: {
            line: number;
            column: number;
        };
        offset: {
            start: number;
            end: number;
        };
        export(): any;
        import(data: any): Position;
        hit(offet: number);
    }

    export class Comment {
        summary: string;
        tags: any;
        annotations: Annotation[];
        getAnnotation(name: string): Annotation;
        getAnnotations(name: string): Annotation[];
        getTag(name: string): Tag;
        getTags(name: string): Tag[];

    }

    export class Node extends point {
        position: Position;
        doc: Comment;
        protected consume(file:File, parent: Node, ast: any): void;
        indexName(name: string): Node;
        getRepository(): Repository;
        getFile(): File;
        getParent(): Node;
        getNamespace(): Namespace;
        eachChild(cb: (child: Node, index: number) => void): Node;
        static extends(type: string): Node;
        static create(type: string, graph: graph): Node;
    }

    export class Block extends Node {
        /**
         * Gets a list of defined variables
         */
        getVariables(): Variable[];
    }

    export class Expr extends Block {
      toPHP(): string;
      static resolve(parent:Node, ast:any):Expr|string|number|boolean;
    }

    export class External extends Node {
      once: boolean;
      strict: boolean;
      target: Expr|string;
      getTargetFile(): Promise<File>;
    }

    export class UseGroup extends Node {
      aliases: Map<string, string>;
    }

    export class Define extends Node {
      caseInsensitive: boolean;
      getName(): string;
      getValue(): Expr|string|number|boolean;
    }

    export class Namespace extends Block {

        /**
         * Retrieves a list of classes
         */
        getClasses(): Class[];  
        
        /**
         * Retrieves a list of interfaces
         */
        getInterfaces(): Interface[];

        /**
         * Retrieves a list of interfaces
         */
        getTraits(): Trait[];


        getFunctions(): Function[];

        getUses(): UseGroup[];

        getConstants(): Constant[];

        getDefines(): Define[];
        /**
         * Converts a namespace relative object name to a fully qualified name
         */
        getFQN(name:string): string;
        /**
         * Resolves an alias class if defined in use statements
         */
        resolveAlias(alias: string): string;
        /**
         * Retrieves a class alias from `use` statements 
         */
        findAlias(name: string): string;
        /**
         * Resolves a class name if it's relative, using aliases
         * or adding current namespace prefix.
         */
        resolveClassName(name: string): string;
    }

    export class File extends point {
        getRepository(): Repository;
        setName(name: string): File;
        getName(): string;
        eachNode(cb: (child: Node, index: number) => void): File;
        getFirstByName(type: string, name: string): Node;
        getByType(type: string): Node[];
        getNamespaces(): Namespace[];
        getClasses(): Class[];
        getInterfaces(): Interface[];
        getIncludes(): External[];
        getClass(name: string): Class;
        getNamespace(name: string): Namespace;
        getScope(offset: number): Scope;
    }

    export class Function extends Block {
        name: string;
        fullName: string;
        isClosure: boolean;
        getArguments(): Variable[];
        getVariables(): Variable[];
    }

    export class Method extends Block {
        name: string;
        fullName: string;
        isStatic: boolean;
        isFinal: boolean;
        isAbstract: boolean;
        isPublic: boolean;
        isProtected: boolean;
        isPrivate: boolean;
        getArguments(): Variable[];
        getVariables(): Variable[];
        getClass(): Class|Trait|Interface;
    }

    export class Class extends Node {
        name: string;
        fullName: string;
        extends: string;
        implements: string[];
        isAbstract: Boolean;
        isFinal: Boolean;
        getExtends(): Class;
        getImplements(): Interface[];
        getProperties(includeParents?: boolean): Property[];
        getConstants(includeParents?: boolean): Constant[];
        getMethods(includeParents?: boolean): Method[];
    }

    export class Trait extends Node {
    }

    export class Interface extends Node {
    }

    export class Constant extends Node {
        name: string;
    }

    export class Variable extends Node {
        name: string;
    }

    export class Property extends Node {
        name: string;
    }

    export class Scope {
        file: File;
        offset: number[];
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
        directory: string;
        options: Options;
        db: graph;
        constructor(directory:string, config: Options);
        constructor(directory:string);
        scan(directory: string): Promise<Boolean>;
        scan(): Promise<Boolean>;
        parse(filename: string, encoding?: string, stat?: any): Promise<File>;
        getByType(type: string): Node[];
        getByName(type: string, name: string, limit?: number): Node[];
        searchByName(type: string, name: string, limit?: number): Node[];
        getFirstByName(type: string, name: string): Node;
        getNamespace(name: string): Namespace;
        sync(filename: string, contents: string, offset?: number[]): Promise<File>;
        cleanAll(): Repository;
        each(type: string, cb: (node:Node, name: string) => void): Repository;
        getScope(filename: string, offset: any): Scope;
        getFile(filename: string): File;
        hasFile(filename: string): boolean;
        eachFile(cb: (node:File, name: string) => void): Repository;
        removeFile(filename: string): Repository;
        renameFile(oldName: string, newName: string): Repository;
        refresh(): Promise<File>;
    }
}
