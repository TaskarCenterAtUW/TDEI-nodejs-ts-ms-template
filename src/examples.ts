import { AbstractDomainEntity, Prop } from "nodets-ms-core/lib/models";
import { FileEntity, StorageClient, StorageContainer } from "nodets-ms-core/lib/core/storage";//"./core/storage";
import * as fs from 'fs';
import * as path from 'path';
import { Core } from 'nodets-ms-core/lib/core';
import sm from './assets/sample_message.json';
import { QueueMessage } from "nodets-ms-core/lib/core/queue";
import { SampleQueueHandler } from "./sample_queue_handler";
import { environment } from "./environment/environment";
import { Config } from "nodets-ms-core/lib/models";

/**
 * Sample Model class to test the domain entities
 */
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
    provider: 'Azure', // Keep it as Azure only
    cloudConfig: {
        connectionString: {
            appInsights: environment.connections.appInsights,
            serviceBus: environment.connections.serviceBus,
            blobStorage: environment.connections.blobStorage
        },

    }
}));

// Initiate the storage client for storage related functions
const theStorageClient: StorageClient = Core.getStorageClient();


/**
 * Tests the storage functions for fetching 
 * the list of files and their mimetypes
 */
async function testStorage() {

    const containerName = environment.blobContainerName;
    const theContainerClient: StorageContainer = await theStorageClient.getContainer(containerName);
    const filesList: FileEntity[] = await theContainerClient.listFiles();

    filesList.forEach(async (singleFile) => {
        console.log(singleFile.fileName);
        console.log(singleFile.mimeType);
    });

}

/**
 * Tests the storage upload
 */
async function testStorageUpload() {
    const containerName = environment.blobContainerName;
    const theContainerClient: StorageContainer = await theStorageClient.getContainer(containerName);
    const testFile = theContainerClient.createFile('sample-file3.txt', 'text/plain');
    const readStream = fs.createReadStream(path.join(__dirname, "assets/sample_upload_file.txt"));
    testFile.upload(readStream);
}

/**
 * Tests the model
 */
function testModel() {
    const singleMessage: SampleModel = SampleModel.from(sm);

    console.log(" Single Message ");
    console.log(singleMessage.userid);
}


/**
 * Tests the sending and receiving of messages
 */
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

/**
 * Tests recording of logs
 */
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

