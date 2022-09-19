# Introduction 
This micro-service acts as template for creating all the new micro-services for TDEI project. The components and classes in this project can be re-used for all the other micro-services.

# Getting Started
The project is built on top of NodeJS framework. All the regular nuances for a NodeJS project are valid for this.

## System requirements
| Software | Version|
|----|---|
| NodeJS | 16.17.0|
| Typescript | 4.8.2 |


## Starting a new project with template
1. Clone the repository.
2. Remove the `.git` files using the command `rm -rf .git`
3. Add your custom code to `index.ts`
4. Add additional code and folders as necessary.
5. Donot modify `core` directory.

# Build and Test
Follow the steps to install the node packages required for both building and running the application

1. Install the dependencies. Run the following command in terminal on the same directory as `package.json`
    ```shell
    npm install
    ```
2. To start the server, use the command `npm run start`

# Structure and components
The application is a simple derivative of [koa](https://koajs.com) to serve `http` requests. This code also has other components to communicate with cloud for storage, queues, logs, configurations etc. 

## Core
Contains all the abstract and Azure implementation classes for connecting to Azure components. 

### Logger
Offers helper classes to help log the information.
Use `tdeiLogger` to log the following

`queueMessage`  : Message received or sent to Queues. This helps in keeping track of the messages received and sent from the queue.

`metric`    : Any specific metric that needs to be recorded

`request` : App HTTP request that needs to be logged (for response time, path, method and other information)

Eg.
```typescript
import { tdeiLogger } from "./tdei_logger";

// Record message
tdeiLogger.recordMessage(queueMessage, true); // True if published and false if received

// Record a metric
tdeiLogger.recordMetric('userlogin',1); // Metric and value

// Record a request
tdeiLogger.recordRequest(request,response);

```

### Model
Offers easy ways to define and parse the model classes from the JSON based input received from either HTTP request or from the queue message. This acts as the base for defining all the models. `AbstractDomainEntity` can be subclassed and used for all the models used within the project. This combined with `Prop()` decorator will make it easy for modelling.

Eg.
```typescript

class SampleModel extends AbstractDomainEntity{

    @Prop()
    public userid!: string;

    @Prop()
    public extraThing!: string

    constructor() {
        super();
      }

}
```
The above class loads the entity from json file with the following format
```json
{
    "userid":"sample-user-id",
    "extraThing":"some-extra-information"
}
```

Another example is the base queue message used within the core:
```typescript
export class QueueMessage extends AbstractDomainEntity {
    
    /**
     * Unique message ID to represent this message
     */
    @Prop()
    messageId!:string;

    /**
     * Message type for this queue message
     */
    @Prop()
    messageType!:string;

    /**
     * Optional message string for the message
     */
    @Prop()
    message:string | undefined;

}

```
NOTE: In future, there will be other decorators in place based on the need.
Eg. @Validate, @UUID, @NestedModel

These will help in easily modelling the classes along with the required validation.

### Queue
Queue component offers easy way to listen to and send messages over Azure Queues.
All the queue messages have to be derived from the base class `QueueMessage` which has some inherent properties that may be filled (eg. messageType is needed).

#### Sending to queue
Either subclass `AzureSender` class or use an instance of the same to send queueMessage to the Azure Queue.

```typescript
const sender = new AzureSender(environment.connections.serviceBus,'queueName');
const queueMessage = QueueMessage.from({messageType:'sampleevent',messageId:''1,message:"Sample message"});
sender.send([queueMessage]);

```
The `send` method accepts an array of `QueueMessage`. It is upto the developer to order the messages or send a single message.

#### Listening to queue

Queue listening is done based on the eventtype (messagetype). This uses `When()` decorator to simplify the amount of code needed to write.

Subclass `AzureQueueListener` and write your own implementation of the method to listen to the event.

```typescript
class SampleQueueReceiver extends AzureQueueListener{


    @When('sampleevent')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.debug(message.messageId);
    }

}

// Usage
const myListener = new SampleQueueReceiver(environment.connections.serviceBus,'queueName');
myListener.startListening(); // Start listening to the queue.
```
The above class instance will listen to the `sampleevent` message type and is called whenever the queue receives a message of `sampleevent` type.

### Storage
For all the azure blobs and other storages, storage components will offer simple ways to upload/download and read the existing data.
```typescript
// Create storage client
const azureStorageClient: StorageClient = new AzureStorageClient(CONNECTION_STRING);

// Get a container in the storage client
const azureContainerClient: StorageContainer = await azureStorageClient.getContainer(containerName);

// To get the list of files
const filesList:FileEntity[] = await azureContainerClient.listFiles();

```
There are two ways to fetch the content of the file.
1. ReadStream - use `file.getStream()` which gives a `NodeJS.ReadableStream` object 
2. GetText - use `file.getText()` which gives a `string` object containing all the data of the file in `utf-8` format.

File upload is done only through read stream.
```typescript
// Get the storage container
const azureContainerClient: StorageContainer = await azureStorageClient.getContainer(containerName);
    // Create an instance of `AzureFileEntity` with name and mime-type
    const testFile = azureContainerClient.createFile('sample-file2.txt','text/plain');
    // Get the read stream from the local file
    const readStream = fs.createReadStream(path.join(__dirname,"assets/sample_upload_file.txt"));
    // Call the upload method with the readstream.
    testFile.upload(readStream);
```


## Environment
This is used for storing all the configurations and use appropriately in the project. These variables can be externalized into either a configuration or process/environment variables during the CI/CD. Only the `connections` part of it is confirmed in structure. Other properties can be replaced.

```typescript
const environment = {
    connections:{
        serviceBus: "asb-connection-string", // Use this if your app/service uses queues
        blobStorage:"blob-storage-connection-string", // Use this if your app/service uses blob storage
        appInsights:"app-insights-connection-string" // This is a required parameter as all the app/services have to log centralized
    },
    queueName:"name of the queue",
    blobContainerName:"tname of the container in blob storage",
    appName: process.env.npm_package_name
}

```

## Assets
This folder holds any of the example or local files that are used for either input or any other testing purpose.
NOTE:
    
    All the examples are available in `examples.ts` file and can be tested independently when needed.

# Common tasks

