
 abstract class FileEntity {
    fileName:string;
    mimeType:string;
    constructor(name:string,mimeType:string = "text/plain"){
        this.fileName = name;
        this.mimeType = mimeType;
    }
    
    abstract getStream(): NodeJS.ReadableStream; // Fetches the readable stream
    abstract getBodyText():Promise<string>; // Fetches the text for the file. Will show up only when needed.

 }
