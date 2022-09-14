import { QueueMessage } from "../../queue/abstract/queue_message";

/**
 * Abstract class for a generic logger
 */
export abstract class Logger {

    /**
     * Method to record a message or event being passed down
     * via queues. This can be recorded for publishing as well
     * as listening to the events. This falls under the event 
     * logging.
     * @param message Instance of QueueMessage to be recorded
     * @param published Whether the message is published or received.
     */
    abstract recordMessage(message: QueueMessage, published: boolean);

    /**
     * Records a specific metric for logging.
     * This is further used for monitoring and auditing purpose
     * 
     * @param name Name of the metric
     * @param value Value of the metric (number)
     */
    abstract recordMetric(name: string, value: number);

    /**
     * Flushes all the existing messages into the system
     * Use this exclusively to send all the pending logs 
     * information to the cloud. Otherwise, there is a
     * delay of about 15 seconds for the application to send 
     * the data.
     */
    abstract sendAll();

}