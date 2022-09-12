import { AzureQueueListener, QueueMessage, When } from "./core/queue";

export class SampleQueueReceiver extends AzureQueueListener{


    @When('sampleevent')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.log(message.messageId);
    }

}