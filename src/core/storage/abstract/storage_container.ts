import { FileEntity } from "./file_entity";

 export abstract class StorageContainer {

    name:string
    constructor(name:string = ''){
        this.name = name;
    }
    abstract listFiles():Promise<FileEntity[]>;
    // May be list other directories as well.
    // will pick it up later.

 }