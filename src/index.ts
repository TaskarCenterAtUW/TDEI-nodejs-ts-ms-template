import { AbstractDomainEntity, Prop } from "./core/model";
import { AzureStorageClient, FileEntity, StorageClient, StorageContainer } from "./core/storage";
import * as fs from 'fs';
import * as path from 'path';

console.log('Hello');
import sm from './assets/sample_message.json';
// import { AbstractDomainEntity } from "./core/model/abstract-domain-entity";
// import { Prop } from "./core/model/decorators/prop.decorator";


class SampleModel extends AbstractDomainEntity{

    @Prop()
    public userid!: string;

    @Prop()
    public extraThing!: string

    constructor() {
        super();
      }

}


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
        // const bodyText = await singleFile.getBodyText();
        // console.log(bodyText);
    });
 

}

async function testStorageUpload(){
    const azureContainerClient: StorageContainer = await azureStorageClient.getContainer(containerName);
    const testFile = azureContainerClient.createFile('sample-file2.txt','text/plain');
    const readStream = fs.createReadStream(path.join(__dirname,"assets/sample_upload_file.txt"));
    testFile.upload(readStream);
}

function testModel(){
    const singleMessage: SampleModel = SampleModel.from(sm);

    console.log(" Single Message ");
    console.log(singleMessage.userid);
}
// testModel();
// testStorageUpload();
// testStorage();

