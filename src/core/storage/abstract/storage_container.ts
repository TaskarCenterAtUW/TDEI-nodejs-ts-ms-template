import { FileEntity } from "./file_entity";

/**
 * Abstract class for Storage Container
 */
export abstract class StorageContainer {

    name: string

    /**
     * Creates an instance of Storage Container
     * @param name name of the container (defaults to empty)
     */
    constructor(name: string = '') {
        this.name = name;
    }

    /**
     * Method to list the 
     * 
     * @returns list of FileEntity objects
     */
    abstract listFiles(): Promise<FileEntity[]>;

    /**
     * Creates a file entity object within the container.
     * 
     * @param name name of the file
     * @param mimeType mime-type of the file
     */
    abstract createFile(name: string, mimeType: string): FileEntity;
}