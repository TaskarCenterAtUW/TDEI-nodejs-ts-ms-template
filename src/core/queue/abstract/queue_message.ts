import { AbstractDomainEntity, Prop } from "../../model";

export class QueueMessage extends AbstractDomainEntity {
    
    @Prop()
    messageId!:string;

    @Prop()
    messageType!:string;

    @Prop()
    message:string | undefined;

}