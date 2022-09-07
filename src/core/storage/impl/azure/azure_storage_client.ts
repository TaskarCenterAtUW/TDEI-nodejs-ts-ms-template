import { BlobServiceClient } from "@azure/storage-blob";
import { AzureStorageContainer } from "./azure_storage_container";

 export class AzureStorageClient implements StorageClient {

    connectionString:string;
    _blobServiceClient: BlobServiceClient;

    constructor(connectionString:string){
        this.connectionString = connectionString;
         this._blobServiceClient = BlobServiceClient.fromConnectionString(
            connectionString
          );
    }
     getContainer(name: string): Promise<AzureStorageContainer> {

        return new Promise((resolve,reject)=>{
            const containerClient = this._blobServiceClient.getContainerClient(name);
            resolve(new AzureStorageContainer(name,containerClient));
        });
    }
    
 }