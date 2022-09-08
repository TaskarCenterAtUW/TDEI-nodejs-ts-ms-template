"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("@core/model");
const storage_1 = require("@core/storage");
console.log('Hello');
// import sm from './assets/sample_message.json';
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
function testStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        const azureContainerClient = yield azureStorageClient.getContainer(containerName);
        const filesList = yield azureContainerClient.listFiles();
        filesList.forEach((singleFile) => __awaiter(this, void 0, void 0, function* () {
            console.log(singleFile.fileName);
            console.log(singleFile.mimeType);
            const bodyText = yield singleFile.getBodyText();
            console.log(bodyText);
        }));
    });
}
// function testModel(){
//     const singleMessage: SampleModel = SampleModel.from(sm);
//     console.log(" Single Message ");
//     console.log(singleMessage.userid);
// }
// testModel();
testStorage();
