import { ContainerClient } from "@azure/storage-blob";
import { FileEntity } from "../../abstract/file_entity";
import { StorageContainer } from "../../abstract/storage_container";
import { AzureFileEntity } from "./azure_file_entity";

/**
 * Azure implementation of Storage container
 */
export class AzureStorageContainer implements StorageContainer {
   name: string;
   _client: ContainerClient;

   constructor(name: string, containerClient: ContainerClient) {
      this.name = name;
      this._client = containerClient;
   }

   /**
    * Lists all the AzureFileEntities in the container
    * @returns List of AzureFileEntity
    */
   listFiles(): Promise<AzureFileEntity[]> {
      return new Promise(async (resolve, reject) => {

         const fileEntities: AzureFileEntity[] = []
         const iterator = this._client.listBlobsFlat();
         let blobItem = await iterator.next();
         while (!blobItem.done) {
            const blobClient = this._client.getBlockBlobClient(blobItem.value.name);
            fileEntities.push(new AzureFileEntity(blobItem.value.name, blobClient, blobItem.value.properties.contentType));
            blobItem = await iterator.next();
         }
         resolve(fileEntities);

      });
   }

   /**
    * Creates a file with the given blob
    * @param name name of the file
    * @param mimeType mimetype of the file
    * @returns AzureFileEntity
    */
   createFile(name: string, mimeType: string = 'text/plain'): AzureFileEntity {
      const blobClient = this._client.getBlockBlobClient(name);
      return new AzureFileEntity(name, blobClient, mimeType);

   }

}