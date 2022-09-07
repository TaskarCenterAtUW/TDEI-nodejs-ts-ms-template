import { StorageContainer } from "./storage_container";

export abstract class StorageClient {

    abstract getContainer(name:string): Promise<StorageContainer>;
 }