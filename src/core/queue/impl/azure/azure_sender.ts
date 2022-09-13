import { ServiceBusClient, ServiceBusMessage, ServiceBusSender } from "@azure/service-bus";
import { Loggable } from "../../../logger/loggable";
import { QueueMessage } from "../../abstract/queue_message";
import { Sender } from "../../abstract/sender";

// class to send the messages to Azure queue
export class AzureSender  extends Loggable implements Sender{

    private sbClient : ServiceBusClient;
    private sender : ServiceBusSender;
    private currentMessages: QueueMessage[] = [];

    constructor(private connectionString:string,private queueName: string){
        super();
        this.sbClient = new ServiceBusClient(connectionString);
        this.sender = this.sbClient.createSender(queueName);
    }

    async send(messages: QueueMessage[]) {

        const messagesToSend: ServiceBusMessage[] = []
        messages.forEach((singleMessage)=>{
            messagesToSend.push({body:singleMessage});
        });
      await  this.sender.sendMessages(messagesToSend);
      // Send a log to insights.
      messages.forEach((singleMessage)=>{
        this.logger?.recordMessage(singleMessage,true);
      });
      
    }

    add(message: QueueMessage) {
        this.currentMessages.push(message);
    }

    async sendNow() {
        await this.send(this.currentMessages);
        this.currentMessages = []; // Clear the messages
    }

}