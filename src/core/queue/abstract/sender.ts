import { QueueMessage } from "./queue_message";

/**
 * Abstract class for sending messages to queue
 */
export abstract class Sender {

    abstract send(messages: QueueMessage[]);

    abstract add(message:QueueMessage);

    abstract sendNow();
}