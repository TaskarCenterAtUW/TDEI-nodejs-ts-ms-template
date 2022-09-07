abstract class StorageClient {

    abstract getContainer(name:string): Promise<StorageContainer>;
 }