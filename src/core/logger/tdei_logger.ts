import { QueueMessage } from "../queue";

import * as appInsights from 'applicationinsights';
import { Logger } from "./abstract/logger";
import { environment } from "../../environment/environment";
/**
 * Default queue message logger 
 * This is implemented for Azure only and can be moved to separate orchestration
 */
export class TDEILogger implements Logger {

    private client: appInsights.TelemetryClient;

    constructor(connectionString: string) {
        appInsights.setup(connectionString)
            .setAutoCollectConsole(true, true)
            .start();
        this.client = appInsights.defaultClient;
        // Need to put the microservice name somewhere here.
    }

    recordMessage(message: QueueMessage, published: boolean = true) {
        // Get the internal thing and send the message
        const eventAction = published ? 'Published' : 'Received'; //TODO: Move to some constants.
        this.client.trackEvent({ name: message.messageType, properties: { content: message.message, eventAction: eventAction } });
    }

    recordMetric(name: string, value: number) {
        this.client.trackMetric({ name: name, value: value });
    }

    recordRequest(req:any,res:any){
        this.client.trackNodeHttpRequest({request:req,response:res});
    }

    sendAll() {
        // Basically flushes all the logs
        this.client.flush();
    }

}
// export default new TDEILogger();
const appInsightConnectionString = environment.connections.appInsights ?? "InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/";
export const tdeiLogger = new TDEILogger(appInsightConnectionString);