import { QueueMessage } from "./queue_message";

/**
 * Abstract class for sending messages to queue
 * Inherit this class to send the messages over
 * Cloud queue systems
 */
export abstract class Sender {

    /**
     * Sends the list of queue messages to the cloud
     * immediately
     * @param messages List of messages to be sent
     */
    abstract send(messages: QueueMessage[]);

    /**
     * Adds the message to the local queue and waits
     * till `sendNow()` is called and sends all the pending
     * messages at once
     * @param message Message to be added to internal queue
     */
    abstract add(message:QueueMessage);

    /**
     * Sends all the pending local messages to the cloud
     */
    abstract sendNow();
}