
/**
 * Abstract class for file entity
 */
export abstract class FileEntity {
    fileName: string;
    mimeType: string;

    constructor(name: string, mimeType: string = "text/plain") {
        this.fileName = name;
        this.mimeType = mimeType;
    }

    /**
     * Fetches the Readable stream of the file
     */
    abstract getStream(): Promise<NodeJS.ReadableStream>;

    /**
     * Fetches the content of the file as plan text
     */
    abstract getBodyText(): Promise<string>;

    /**
     * Upload the content for this file
     * @param body ReadableStream of the file content
     */
    abstract upload(body: NodeJS.ReadableStream): Promise<FileEntity>;

}
