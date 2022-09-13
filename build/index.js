"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_CONNECTION_STRING = void 0;
const model_1 = require("./core/model");
const storage_1 = require("./core/storage");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
console.log('Hello');
const sample_message_json_1 = __importDefault(require("./assets/sample_message.json"));
const queue_1 = require("./core/queue");
const sample_queue_receiver_1 = require("./sample_queue_receiver");
const tdei_logger_1 = require("./core/logger/tdei_logger");
// import { AbstractDomainEntity } from "./core/model/abstract-domain-entity";
// import { Prop } from "./core/model/decorators/prop.decorator";
class SampleModel extends model_1.AbstractDomainEntity {
    constructor() {
        super();
    }
}
__decorate([
    (0, model_1.Prop)(),
    __metadata("design:type", String)
], SampleModel.prototype, "userid", void 0);
__decorate([
    (0, model_1.Prop)(),
    __metadata("design:type", String)
], SampleModel.prototype, "extraThing", void 0);
// export const STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net";
const CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net";
const containerName = 'tdei-storage-test';
const azureStorageClient = new storage_1.AzureStorageClient(CONNECTION_STRING);
exports.QUEUE_CONNECTION_STRING = "Endpoint=sb://tdei-sample.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=4UNDrVpThcnbqWlGFFQEcivuPlvMMWcSHwbyHgEv+rg=";
function testStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        const azureContainerClient = yield azureStorageClient.getContainer(containerName);
        const filesList = yield azureContainerClient.listFiles();
        filesList.forEach((singleFile) => __awaiter(this, void 0, void 0, function* () {
            console.log(singleFile.fileName);
            console.log(singleFile.mimeType);
            // const bodyText = await singleFile.getBodyText();
            // console.log(bodyText);
        }));
    });
}
function testStorageUpload() {
    return __awaiter(this, void 0, void 0, function* () {
        const azureContainerClient = yield azureStorageClient.getContainer(containerName);
        const testFile = azureContainerClient.createFile('sample-file2.txt', 'text/plain');
        const readStream = fs.createReadStream(path.join(__dirname, "assets/sample_upload_file.txt"));
        testFile.upload(readStream);
    });
}
function testModel() {
    const singleMessage = SampleModel.from(sample_message_json_1.default);
    console.log(" Single Message ");
    console.log(singleMessage.userid);
}
function testQueues() {
    let tdeiLogger = new tdei_logger_1.TDEILogger("InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/");
    const queueName = "tdei-poc-queue";
    const sender = new queue_1.AzureSender(exports.QUEUE_CONNECTION_STRING, queueName);
    sender.logger = tdeiLogger;
    const myListener = new sample_queue_receiver_1.SampleQueueReceiver(exports.QUEUE_CONNECTION_STRING, queueName);
    myListener.logger = tdeiLogger;
    myListener.startListening();
    // Create and send events
    const numberOfMessages = 10;
    const allMessages = [];
    for (var i = 0; i < numberOfMessages; i++) {
        // console.log("Adding things "+i);
        const queueMessage = queue_1.QueueMessage.from({ messageType: 'sampleevent', messageId: '' + (i + 1), message: "Hello there {i+1}" });
        allMessages.push(queueMessage);
    }
    sender.send(allMessages);
    tdeiLogger.sendAll();
}
function testLogs() {
    // let appInsights = require("applicationinsights");
    // appInsights
    // console.log("Setting up ",Date.now());
    // appInsights.setup("InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/")
    // .setAutoCollectConsole(true,true)
    // .start();
    // console.log("Setting up done",Date.now());
    // let client = appInsights.defaultClient;
    // console.log("Sending event ",Date.now());
    // client.trackEvent({name:"template-event",properties:{eventType:"sampleevent",message:'Sample message'}});
    // console.log("Sent event ",Date.now());
    // client.trackRequest({name:"GET /customers", url:"http://tdei.com/customers", duration:309, resultCode:200, success:true});
    // client.flush();
    let tdeiLogger = new tdei_logger_1.TDEILogger("InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/");
    console.log("Sample event");
    tdeiLogger.recordMetric('user-upload-gtfs', 1);
    tdeiLogger.sendAll();
}
testLogs();
// testQueues();
// testModel();
// testStorageUpload();
// testStorage();
