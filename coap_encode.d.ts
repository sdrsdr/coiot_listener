/// <reference types="node" />
import { Coap_MinMessage } from "./coap_message";
export declare function coap_encode(m: Coap_MinMessage): Buffer;
export declare function getMessageId(): number;
export declare function coap_prepare_get(uri: string, msgid?: number): Coap_MinMessage;
