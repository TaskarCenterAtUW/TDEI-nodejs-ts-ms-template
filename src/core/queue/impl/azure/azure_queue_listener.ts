// Listener code to be added.

import { ServiceBusClient, ServiceBusReceivedMessage, ServiceBusReceiver } from "@azure/service-bus";
import { QueueMessage } from "../../abstract/queue_message";

export class AzureQueueListener {

    private sbClient : ServiceBusClient;// = new ServiceBusClient(CONNECTION_STRING);
    private listener : ServiceBusReceiver;

    constructor(private connectionString:string, private queueName:string, private shouldComplete = true){
        this.sbClient = new ServiceBusClient(connectionString);
        this.listener = this.sbClient.createReceiver(queueName);
    }

    private async on(message: ServiceBusReceivedMessage){

        // Get the type and start figuring out.
        const body = message.body;
        // console.log(body['type']);
        const messageType = body['type'];
        // Check if there is any method listening to it.
        const eventMap = Reflect.getMetadata('eventHandlers', this.constructor.prototype) as Map<
        string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        { handler: Function}[]
      >;
      const eventHandlers = eventMap.get(messageType);
        if(eventHandlers != undefined){
            // Generate Queuemessage
            const queueMessage =  QueueMessage.from(body) ;
      for (const{handler} of eventHandlers){

        handler.call(this,queueMessage);
      }
    }
    else {
        // console.log("Event handlers for "+messageType+" undefined");
    }
        if(this.shouldComplete){
            this.listener.completeMessage(message); // To be called later.
        }
    
    }

}