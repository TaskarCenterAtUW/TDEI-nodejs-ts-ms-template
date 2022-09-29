# Introduction 
This micro-service acts as example for creating all the new micro-services for TDEI project. The reference code can be used in other micro-services.

# Getting Started
The project is built on top of NodeJS framework. All the regular nuances for a NodeJS project are valid for this.

## System requirements
| Software | Version|
|----|---|
| NodeJS | 16.17.0|
| Typescript | 4.8.2 |


## Starting a new project with template
There are two ways to start a new project:
### With this template code
1. Clone the repository.
2. Remove the `.git` files using the command `rm -rf .git`
3. Add your custom code to `index.ts`
4. Add additional code and folders as necessary.

#### Build and Test
Follow the steps to install the node packages required for both building and running the application

1. Install the dependencies. Run the following command in terminal on the same directory as `package.json`
    ```shell
    npm install
    ```
2. To start the server, use the command `npm run start`
3. The http server by default starts with 3000 port or whatever is declared in `process.env.PORT` (look at `index.ts` for more details)
4. By default `get` call on `localhost:3000` gives a sample response
5. Other routes include a `ping` with get and post. Make `get` or `post` request to `http://localhost:3000/ping`

### Starting from scratch
To start a project from scratch, developer will need to initialize a typescript project and import `nodets-ms-core` package 
1. Initiate a new nodejs project using command `npm init -y`
2. Add typescript support using `npm install typescript --save-dev`
3. Add typescript types using `npm install @types/node --save-dev`
4. Use the following command to initiate typescript configuration

`npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true`

5. Create directory `src` in the same folder as tsconfig.json
6. Create `index.ts` in `src` directory and start adding your code
7. Add `nodets-ms-core` package using command `npm install nodets-ms-core`

#### Build and Test
1. Install the dependencies. Run the following command in terminal on the same directory as `package.json`
    ```shell
    npm install
    ```
2. To run your custom code, use the command `npm run start`

# nodets-ms-core package Structure and components
The application is a simple derivative of [koa](https://koajs.com) to serve `http` requests. By default, the `bodyParser` and `json` parser are added to the application.

This project also includes `nodets-ms-core` package to communicate with cloud for storage, queues, logs, configurations etc. 

## Core
Contains all the abstract and Cloud implementation classes for connecting to Cloud components. Before using any of the components, call the initialize 
method of `Core` to initialize the cloud components. 

eg.
```typescript
Core.initialize(
    Config.from({
    provider: 'Azure', // Keep this as Azure only
    cloudConfig: {
        connectionString: {
            appInsights: <connection string for AppInsights>,
            serviceBus: <connection string for ServiceBus>,
            blobStorage: <connection string for BlobStorage>
        },

    }
})
);

```
You can also use `environment` file to have the configuration stored appropriately throughout the project
eg.
```typescript
export const environment = {
    connections:{
        serviceBus: "<connection string for ServiceBus>",
        blobStorage:"<connection string for BlobStorage>",
        appInsights:"<connection string for AppInsights>"
    },
    // Additional configuration as per need for microservice
    queueName:"tdei-poc-queue",
    blobContainerName:"tdei-storage-test",
    appName: process.env.npm_package_name
}
```

### Logger
Offers helper classes to help log the information.
Use `Core.getLogger()` to log the following

`metric`    : Any specific metric that needs to be recorded

`request` : App HTTP request that needs to be logged (for response time, path, method and other information)

Eg.
```typescript
import { Core } from 'nodets-ms-core/lib/core';

let tdeiLogger = Core.getLogger();

// Record a metric
tdeiLogger.recordMetric('userlogin',1); // Metric and value

// Record a request
tdeiLogger.recordRequest(request,response);

```
Note:

* All the `debug`, `info`, `warn`, `error` logs can be logged with `console` and will be injected into appInsight traces.
* All the requests of the application can be logged by using `requestLogger` (check `index.ts`). This acts as a middleware for logging all the requests


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

    /**
     * Published Date for the queue message.
     * Defaults to local time if not specified.
     */
    @Prop()
    publishedDate:Date = new Date();

}

```
NOTE: In future, there will be other decorators in place based on the need.
Eg. @Validate, @UUID, @NestedModel

These will help in easily modelling the classes along with the required validation.

### Queue
Queue component offers easy way to listen to and send messages over Cloud Queues.
All the queue messages have to be derived from the base class `QueueMessage` which has some inherent properties that may be filled (eg. messageType is needed).

Core offers two methods to get a Queue Handler. A default one which can be used only to send messages and a customHandler which allows developer to listen to custom events/messages on the queue.

```typescript
// Default queueHandler
const defaultQueueHandler = Core.getQueue('queueName');

// Custom QueueHandler
const customQueueHandler = Core.getCustomQueue<CustomQueueHandler>('queueName',CustomQueueHandler);
//where
class CustomQueueHandler extends Queue {

}

```

#### Sending to queue
Either subclass `Queue` class or use an instance of the same to send queueMessage to the Cloud.

```typescript
const sender = Core.getQueue('queueName');
const queueMessage = QueueMessage.from({messageType:'sampleevent',messageId:''1,message:"Sample message"});
sender.add(queueMessage);
sender.send();

```
The method `add` pushes the message to the pubish queue and the method `send` flushes the pending messages into the queue sequentially.

#### Listening to queue

Queue listening is done based on the eventtype (messagetype). This uses `When()` decorator to simplify the amount of code needed to write.

Subclass `Queue` and write your own implementation of the method to listen to the event.

```typescript
import {Queue , QueueMessage} from 'nodets-ms-core/lib/core/queue';
import {When} from 'nodets-ms-core/lib/core/queue';

export class SampleQueueHandler extends Queue {


    @When('sampleevent')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.debug(message.messageId);
    }

}

// Usage
const sampleQueueHandler = Core.getCustomQueue<SampleQueueHandler>('queueName',SampleQueueHandler);
sampleQueueHandler.listen(); // Start listening to the queue.


```
The above class instance will listen to the `sampleevent` message type and is called whenever the queue receives a message of `sampleevent` type.

### Storage
For all the Storage blobs and other storages, storage components will offer simple ways to upload/download and read the existing data.
```typescript
// Create storage client
const theStorageClient: StorageClient = Core.getStorageClient();

// Get a container in the storage client
const theContainerClient: StorageContainer = await theStorageClient.getContainer(containerName);

// To get the list of files
const filesList:FileEntity[] = await theContainerClient.listFiles();

```
There are two ways to fetch the content of the file.
1. ReadStream - use `file.getStream()` which gives a `NodeJS.ReadableStream` object 
2. GetText - use `file.getText()` which gives a `string` object containing all the data of the file in `utf-8` format.

File upload is done only through read stream.
```typescript
// Get the storage container
const theContainerClient: StorageContainer = await theStorageClient.getContainer(containerName);
    // Create an instance of `FileEntity` with name and mime-type
    const testFile = theContainerClient.createFile('sample-file2.txt','text/plain');
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

## Adding additional routes to the server


