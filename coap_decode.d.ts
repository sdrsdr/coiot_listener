/// <reference types="node" />
import { AddressInfo } from "net";
import { Coap_Message } from "./coap_message";
export declare function coap_decode(rawbuffer: Buffer, rinfo: AddressInfo): Coap_Message | undefined;
