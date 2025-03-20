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
3. Add a file named `.env` to the root folder. command to use: `touch .env` 
4. `.env` file is where one would add the connection strings for storage, queue, topic. Depending one the needs of the service, one needs to add one or more of the following:
    * PROVIDER= (default: local) 
    * QUEUECONNECTION=
    * STORAGECONNECTION=
5. Contact TDEI admin or GS team to get the connection strings  
6. Add your custom code to `index.ts`
7. Add additional code and folders as necessary.

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
4. Add `rimraf` support for file modification `npm install rimraf --save-dev`
4. Use the following command to initiate typescript configuration

```shell
npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```

The above command creates a file named `tsconfig.json` which is used for typescript configuration. Here is out it should look like
```json
{
  "compilerOptions": {
    
    "target": "es2016",                                  
    "lib": ["es6"],                                      
    "module": "commonjs",                                
    "rootDir": "src",                                    
    "resolveJsonModule": true,                           
    "allowJs": true,                                     
    "outDir": "build",                                   
    "esModuleInterop": true,                             
    "forceConsistentCasingInFileNames": true,            
    "strict": true,                                      
    "noImplicitAny": true,                               
    "skipLibCheck": true                                 
  }
}

```
If there are any issues with the command above, you may create this file manually as well.

5. Create directory `src` in the same folder as tsconfig.json
6. Create `index.ts` in `src` directory and start adding your code
7. Add `nodets-ms-core` package using command `npm install nodets-ms-core`

#### Build and Test
1. Install the dependencies. Run the following command in terminal on the same directory as `package.json`
    ```shell
    npm install
    ```
2. Configure the start command as follows in the `package.json` file.

The following scripts will help in creating the start methods. Ensure that start script is configured as follows:
```json
{
    // Other configurations in package.json
    // ...

"scripts": {
    "build": "rimraf ./build && tsc",
    "start": "npm run build && node build/index.js",
  },
}

```

3. To run your custom code, use the command `npm run start`

# nodets-ms-core package Structure and components
The application is a simple derivative of [ExpressJS](https://expressjs.com/) to serve `http` requests. By default, the `bodyParser` and `json` parser are added to the application.

This project also includes `nodets-ms-core` package to communicate with cloud for storage, queues, logs, configurations etc. 

## Configuration
The initial configuration can be done via a .env file followed by loading the variables of the same.
An example .env file is shown below


```shell
# Provider information. Only two options available Azure and Local
# Defaults to Azure if not provided
PROVIDER=Azure 

# Connection string to service bus. 
# This parameter is required if the service uses ServiceBus for incoming and outgoing message processing
# using Queues or Topics
# if not provided
QUEUECONNECTION=
# connection string to Azure storage if the provider is Azure
# Same can be used for root folder in Local provider
STORAGECONNECTION=

```
Once the `.env` file is set, use `dotenv` package to get the details into the code.

```ts
require('dotenv').config();

```


## Core
Contains all the abstract and Cloud implementation classes for connecting to Cloud components. Before using any of the components, call the initialize 
method of `Core` to initialize the cloud components. 

eg.
```typescript
Core.initialize();

```
You can also use `environment` file to have the configuration stored appropriately throughout the project
eg.
```typescript
export const environment = {
    
    queueName:"tdei-poc-queue",
    appName: process.env.npm_package_name
}
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


### Topic
Topic is an advanced version of Queue where the messages are published and subscribed. Each message published to a topic can be subscribed 
by multiple parties for their own analysis and purpose. The messages sent and received via a topic will still be of type `QueueMessage`

The configuration required by Queue and Topic is similar and will be handled via a connection string.

### Accessing a specific topic

Topic can be accessed by the core method `getTopic`. This method takes two parameters 
1. topic name (required)
2. configuration (derived from IQueueConfig)
```typescript
const topic = Core.getTopic('topicName');
// Alternative
const topicConfig = new AzureQueueConfig(); // Need to modify this somehow.

topicConfig.connectionString = "connectionString";

const topicObject = Core.getTopic(topicConfig,topic);

```

### Publishing message to topic

Once the topic object is got, use `publish` method to publish the message to topic. 
```typescript
topicObject.publish(QueueMessage.from(
    {
        message:"Test message"
    }
));

```

### Subscribing to topic
An active subscription will listening to a subscription over the topic. This is achieved by using `subscribe` method of `Topic`.
It takes two parameters
1. subscription name
2. handler interface object (for when message is received and when there is an error)

```typescript

function processMessage(message:QueueMessage) {
    console.log("Received Message");
    console.log(message);
}

function processError(error: any){
    console.log("Received error");
}

topicObject.subscribe(subscription,{
    onReceive:processMessage,
    onError:processError
});

```

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



