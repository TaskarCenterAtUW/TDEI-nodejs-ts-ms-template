import { BlobServiceClient } from "@azure/storage-blob";
import { StorageClient } from "../../abstract/storage_client";
import { AzureStorageContainer } from "./azure_storage_container";

/**
 * Azure implementation of the Storage client
 */
export class AzureStorageClient implements StorageClient {

    connectionString: string;
    _blobServiceClient: BlobServiceClient;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
        this._blobServiceClient = BlobServiceClient.fromConnectionString(
            connectionString
        );
    }

    /**
     * Fetches the Storage container of certain name
     * @param name Name of the container
     * @returns an instance of AzureStorageContainer
     */
    getContainer(name: string): Promise<AzureStorageContainer> {

        return new Promise((resolve, reject) => {
            const containerClient = this._blobServiceClient.getContainerClient(name);
            resolve(new AzureStorageContainer(name, containerClient));
        });
    }

}