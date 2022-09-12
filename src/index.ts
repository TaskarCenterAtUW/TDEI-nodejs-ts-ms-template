import { AbstractDomainEntity, Prop } from "./core/model";
import { AzureStorageClient, FileEntity, StorageClient, StorageContainer } from "./core/storage";
import * as fs from 'fs';
import * as path from 'path';

console.log('Hello');
import sm from './assets/sample_message.json';
import { AzureQueueListener, AzureSender, QueueMessage } from "./core/queue";
import { SampleQueueReceiver } from "./sample_queue_receiver";
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

export const QUEUE_CONNECTION_STRING = "Endpoint=sb://tdei-sample.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=4UNDrVpThcnbqWlGFFQEcivuPlvMMWcSHwbyHgEv+rg=";


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


function testQueues(){
    const queueName = "tdei-poc-queue"; 
    
    const sender = new AzureSender(QUEUE_CONNECTION_STRING,queueName);
    const myListener = new SampleQueueReceiver(QUEUE_CONNECTION_STRING,queueName);
    myListener.startListening();
    // Create and send events

const numberOfMessages = 10;
const allMessages:QueueMessage[] = [];
for(var i=0;i<numberOfMessages;i++){
    // console.log("Adding things "+i);
    const queueMessage = QueueMessage.from({messageType:'sampleevent',messageId:''+(i+1),message:"Hello there {i+1}"});
    allMessages.push(queueMessage);
}
    sender.send(allMessages);
}
testQueues();
// testModel();
// testStorageUpload();
// testStorage();


