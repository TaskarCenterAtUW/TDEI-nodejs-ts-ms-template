import { CloudConfig, CloudType } from "../../common/cloud_config";
import { Sender } from "../abstract/sender";
import { AzureSender } from "./azure/azure_sender";

export class TDEISender {

    static getQueueSender(cloudConfig: CloudConfig, queueName: string): Sender{
        if(cloudConfig.cloudType == CloudType.Azure){
            return new AzureSender(cloudConfig.connectionString,queueName);
            }
            else {
                throw new TypeError("Not implemented cloud Configuration "+cloudConfig.cloudType);
            }
    }
}