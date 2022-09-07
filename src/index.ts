import { AzureFileEntity } from "./core/storage/impl/azure/azure_file_entity";
import { AzureStorageClient } from "./core/storage/impl/azure/azure_storage_client";
import { AzureStorageContainer } from "./core/storage/impl/azure/azure_storage_container";

console.log('Hello');

// export const STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net";
const CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net";
const containerName = 'tdei-storage-test';
const azureStorageClient: StorageClient = new AzureStorageClient(CONNECTION_STRING);

async function testStorage(){

    const azureContainerClient: StorageContainer = await azureStorageClient.getContainer(containerName);
    const filesList:FileEntity[] = await azureContainerClient.listFiles();

    filesList.forEach(async (singleFile)=>{
        console.log(singleFile.fileName);
        console.log(singleFile.mimeType);
        const bodyText = await singleFile.getBodyText();
        console.log(bodyText);
    });
 

}


testStorage();


