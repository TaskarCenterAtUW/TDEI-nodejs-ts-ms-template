import { ContainerClient } from "@azure/storage-blob";
import { FileEntity } from "../../abstract/file_entity";
import { StorageContainer } from "../../abstract/storage_container";
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
    createFile(name: string, mimeType: string = 'text/plain'): AzureFileEntity {
      const blobClient = this._client.getBlockBlobClient(name);
      return new AzureFileEntity(name,blobClient,mimeType);
       
    }

}