// Azure file entity to be written.

import { BlockBlobClient } from "@azure/storage-blob";

export class AzureFileEntity implements FileEntity{
    fileName: string;
    mimeType: string;
    _blobClient: BlockBlobClient;

    constructor(name:string,blobClient:BlockBlobClient,mimeType:string = 'text/plain'){
       this.fileName = name;
       this.mimeType = mimeType;
       this._blobClient = blobClient;
    }
   async getStream(): Promise<NodeJS.ReadableStream> {
        // throw new Error('Method not implemented.');
        const downloadResponse = await this._blobClient.download(0);
        return Promise.resolve(downloadResponse.readableStreamBody!); // Not sure.
    }
    async getBodyText(): Promise<string> {
        const stream = await this.getStream();
        return Promise.resolve(this.streamToText(stream));
    }

    private async streamToText(stream:NodeJS.ReadableStream):Promise<string>{
            stream.setEncoding('utf8');
            let data = '';
            for await (const chunk of stream){
                data += chunk;
            }
            return data;
    }

}