"use strict";
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
const azure_storage_client_1 = require("./core/storage/impl/azure/azure_storage_client");
console.log('Hello');
// export const STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net";
const CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net";
const containerName = 'tdei-storage-test';
const azureStorageClient = new azure_storage_client_1.AzureStorageClient(CONNECTION_STRING);
function testThings() {
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
testThings();
