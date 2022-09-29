import { AbstractDomainEntity, Prop } from "nodets-ms-core/lib/models";
import { FileEntity, StorageClient, StorageContainer } from "nodets-ms-core/lib/core/storage";//"./core/storage";
import * as fs from 'fs';
import * as path from 'path';
import { Core } from 'nodets-ms-core/lib/core';
import sm from './assets/sample_message.json';
import { QueueMessage } from "nodets-ms-core/lib/core/queue";
import { SampleQueueHandler } from "./sample_queue_receiver";
import { environment } from "./environment/environment";
import { Config } from "nodets-ms-core/lib/models";


class SampleModel extends AbstractDomainEntity {

    @Prop()
    public userid!: string;

    @Prop()
    public extraThing!: string

    constructor() {
        super();
    }

}

// Configure the core initially
Core.initialize(Config.from({
    provider: 'Azure',
    cloudConfig: {
        connectionString: {
            appInsights: environment.connections.appInsights,
            serviceBus: environment.connections.serviceBus,
            blobStorage: environment.connections.blobStorage
        },

    }
}));

const CONNECTION_STRING = environment.connections.blobStorage;
const containerName = environment.blobContainerName;
const azureStorageClient: StorageClient = Core.getStorageClient();


async function testStorage() {

    const azureContainerClient: StorageContainer = await azureStorageClient.getContainer(containerName);
    const filesList: FileEntity[] = await azureContainerClient.listFiles();

    filesList.forEach(async (singleFile) => {
        console.log(singleFile.fileName);
        console.log(singleFile.mimeType);
    });


}

async function testStorageUpload() {
    const azureContainerClient: StorageContainer = await azureStorageClient.getContainer(containerName);
    const testFile = azureContainerClient.createFile('sample-file3.txt', 'text/plain');
    const readStream = fs.createReadStream(path.join(__dirname, "assets/sample_upload_file.txt"));
    testFile.upload(readStream);
}

function testModel() {
    const singleMessage: SampleModel = SampleModel.from(sm);

    console.log(" Single Message ");
    console.log(singleMessage.userid);
}


function testQueues() {

    let tdeiLogger = Core.getLogger();

    const queueName = environment.queueName;
    const queueHandler = Core.getCustomQueue<SampleQueueHandler>(queueName, SampleQueueHandler);
    queueHandler.listen();

    const numberOfMessages = 10;
    for (var i = 0; i < numberOfMessages; i++) {
        const queueMessage = QueueMessage.from({ messageType: 'sampleevent', messageId: '' + (i + 1), message: "Hello there {i+1}" });
        queueHandler.add(queueMessage);
    }
    queueHandler.send();

    tdeiLogger.sendAll();
}

function testLogs() {
    let tdeiLogger = Core.getLogger();
    console.log("Sample event");
    tdeiLogger.recordMetric('user-upload-gtfs', 1);
    tdeiLogger.sendAll();

}
// Use any of the below functions to test each module of the package
// Test the logs
// testLogs();
// Test queues sending and receiving
// testQueues();
// Test the modelling of domain entities
// testModel();
// Test the storage upload
// testStorageUpload();
// Test the file fetching from the storage.
// testStorage();
// console.log(process.env.npm_package_name);

