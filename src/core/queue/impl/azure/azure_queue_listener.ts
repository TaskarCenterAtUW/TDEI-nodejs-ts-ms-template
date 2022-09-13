// Listener code to be added.

import { ServiceBusClient, ServiceBusReceivedMessage, ServiceBusReceiver } from "@azure/service-bus";
import { Loggable } from "../../../logger/loggable";
import { QueueMessage } from "../../abstract/queue_message";

export class AzureQueueListener extends Loggable {

    private sbClient : ServiceBusClient;
    private listener : ServiceBusReceiver;

    constructor(private connectionString:string, private queueName:string, private shouldComplete = true){
        super();
        this.sbClient = new ServiceBusClient(connectionString);
        this.listener = this.sbClient.createReceiver(queueName);
        // this.listen();
    }

    public startListening(){
        this.listen();
    }

    private async listen(){
        this.listener.receiveMessages(1).then((messages)=>{
            messages.forEach(async (singleMessage) => {
              await  this.on(singleMessage);
            });
            // Listen to it again.
            this.listen();
        });
    }

    private async on(message: ServiceBusReceivedMessage){

        // Get the type and start figuring out.
        const body = message.body;
        // console.log(body['type']);
        const messageType = body['messageType'];
        // Check if there is any method listening to it.
        const eventMap = Reflect.getMetadata('eventHandlers', this.constructor.prototype) as Map<
        string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        { handler: Function}[]
      >;
      const eventHandlers = eventMap.get(messageType);
        if(eventHandlers != undefined){
            // Generate Queuemessage
            const queueMessage =  QueueMessage.from(body); //TODO: Parse based on the message type
            this.logger?.recordMessage(queueMessage,false);
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