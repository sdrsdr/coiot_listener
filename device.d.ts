/// <reference types="node" />
import { Listener } from "./listener";
import { EventEmitter } from "events";
export declare class Property extends EventEmitter {
    id: number;
    value: unknown;
    constructor(id: number);
}
export interface Propery_List {
    [propid: number]: Property;
}
export declare class CoIoT_Device extends EventEmitter {
    lastserial?: number;
    _all_props: Propery_List;
    device_ip?: string;
    constructor(listener: Listener, dev_serial: string);
    handle_changed_state(G: any[]): void;
}
