/****************************************************************************************
 * Auto generated from device descriptons by Stoian Ivanov at 2018-08-30T00:41:57.370Z
*****************************************************************************************/
import { CoIoT_Device, Property } from "./device";
import { Listener } from "./listener";
export declare class SHSEN_1 extends CoIoT_Device {
    motion: Property;
    charger: Property;
    temperature: Property;
    humidity: Property;
    lux: Property;
    battery: Property;
    constructor(listener: Listener, serial: string);
}
export declare class SHSW_44 extends CoIoT_Device {
    Relay0: {
        W: Property;
        Switch: Property;
    };
    Relay1: {
        W: Property;
        Switch: Property;
    };
    Relay2: {
        W: Property;
        Switch: Property;
    };
    Relay3: {
        W: Property;
        Switch: Property;
    };
    constructor(listener: Listener, serial: string);
}
