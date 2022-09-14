import { StorageContainer } from "./storage_container";

/**
 * Abstract class for Storage Client
 */
export abstract class StorageClient {
    /**
     * Fetches the container
     * @param name Name of the container
     */
    abstract getContainer(name:string): Promise<StorageContainer>;
 }