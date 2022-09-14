import { AbstractDomainEntity, Prop } from "../../model";

/**
 * Abstract model for Queue Message entity
 * This class can be extended and used for the
 * remaining types based on the event type
 */
export class QueueMessage extends AbstractDomainEntity {
    
    /**
     * Unique message ID to represent this message
     */
    @Prop()
    messageId!:string;

    /**
     * Message type for this queue message
     */
    @Prop()
    messageType!:string;

    /**
     * Optional message string for the message
     */
    @Prop()
    message:string | undefined;

}