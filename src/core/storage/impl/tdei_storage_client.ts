import { CloudConfig, CloudType } from "../../common/cloud_config";
import { StorageClient } from "../abstract/storage_client";
import { AzureStorageClient } from "./azure/azure_storage_client";

export class TDEIStorageClient {

    static getStorageClient(cloudConfig:CloudConfig): StorageClient {
        if(cloudConfig.cloudType == CloudType.Azure){
        return new AzureStorageClient(cloudConfig.connectionString);
        }
        else {
            throw new TypeError("Not implemented cloud Configuration "+cloudConfig.cloudType);
        }
    }
}
