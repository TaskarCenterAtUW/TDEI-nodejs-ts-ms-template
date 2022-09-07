import { ContainerClient } from "@azure/storage-blob";
import { AzureFileEntity } from "./azure_file_entity";

export class AzureStorageContainer implements StorageContainer{
    name: string;
    _client: ContainerClient;
    constructor(name:string, containerClient:ContainerClient){
       this.name = name;
       this._client = containerClient;
    }

    listFiles(): Promise<AzureFileEntity[]> {
       //  throw new Error('Method not implemented.');

       return new Promise(async (resolve,reject)=>{

           const fileEntities :AzureFileEntity[] = []
           const iterator = this._client.listBlobsFlat();
           let blobItem = await iterator.next();
             while (!blobItem.done) {
               const blobClient = this._client.getBlockBlobClient(blobItem.value.name); 
              fileEntities.push(new AzureFileEntity(blobItem.value.name,blobClient,blobItem.value.properties.contentType));
               blobItem = await iterator.next();
             }
             resolve(fileEntities);

       });
      
    }

}