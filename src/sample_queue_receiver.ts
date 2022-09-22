import { QueueMessage, When } from "./core/queue";
import { TDEIQueueListener } from "./core/queue/impl/tdei_queue_listener";
// gtfs-queue
export class SampleQueueReceiver extends TDEIQueueListener{


    @When('sampleevent')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.debug(message.messageId);
    }

}

// osw-queue

// instance1 -> 'abc' -> 


// instance2 -> 'def' -> 

// sampleevent fired on 'abc' queue 
// it should invoke the method `onSampleEvent` on instance1