import { QueueMessage } from "../queue";

import * as appInsights from 'applicationinsights';
/**
 * Default queue message logger 
 * This is implemented for Azure only and can be moved to separate orchestration
 */
export class TDEILogger {

    private client: appInsights.TelemetryClient;

    constructor(connectionString: string) {
        appInsights.setup(connectionString)
            .setAutoCollectConsole(true, true)
            .start();
        this.client = appInsights.defaultClient;
        // Need to put the microservice name somewhere here.
    }

    recordMessage(message: QueueMessage,published:boolean = true) {
        // Get the internal thing and send the message
        const eventAction = published?'Published':'Received'; //TODO: Move to some constants.
        this.client.trackEvent({name:message.messageType,properties:{content:message.message,eventAction:eventAction}});
        // this.client.track({properties:{itemType:'SuperEvent',name:message.messageType+" mine",eventAction:eventAction}},appInsights.Contracts.TelemetryType.Event);
    }

    recordMetric(name:string,value:number){
        this.client.trackMetric({name:name,value:value});
    }

    sendAll() {
        // Basically flushes all the logs
        this.client.flush();
    }

}
// export default new TDEILogger();