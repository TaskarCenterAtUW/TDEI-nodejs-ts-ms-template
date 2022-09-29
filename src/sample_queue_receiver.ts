// import { AzureQueueListener, QueueMessage, When } from "./core/queue";
import {Queue , QueueMessage} from 'nodets-ms-core/lib/core/queue';
import {When} from 'nodets-ms-core/lib/core/queue';

export class SampleQueueHandler extends Queue {


    @When('sampleevent')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.debug(message.messageId);
    }

}