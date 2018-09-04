/// <reference types="node" />
import { EventEmitter } from "events";
import { Socket } from "dgram";
import { Coap_MinMessage, Coap_Message } from "./coap_message";
import { AddressInfo } from "net";
export interface Track_Callback {
    (resp: Coap_Message | undefined, req: Coap_MinMessage): void;
}
interface Track_Data {
    req: Coap_MinMessage;
    cb: Track_Callback;
    tmo: any;
}
export declare const DEFAULT_COAP_PORT = 5683;
export declare class Listener extends EventEmitter {
    port: number;
    socket: Socket;
    trackdata: Map<number, Track_Data>;
    constructor(port?: number);
    send_and_track(m: Coap_MinMessage, rinfo: AddressInfo, cb: Track_Callback): void;
    finish(trdata: Track_Data): void;
}
export {};
