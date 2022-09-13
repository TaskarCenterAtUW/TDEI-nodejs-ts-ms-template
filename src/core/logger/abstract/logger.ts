import { QueueMessage } from "../../queue/abstract/queue_message";

export abstract class Logger {
    abstract recordMessage(message: QueueMessage,published:boolean);
    abstract recordMetric(name:string,value:number);
    abstract sendAll();

}