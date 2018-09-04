"use strict";
/****************************************************************************************
 * Auto generated from device descriptons by Stoian Ivanov at 2018-08-30T00:41:57.370Z
*****************************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("./device");
//===== SHSEN-1 =====
class SHSEN_1 extends device_1.CoIoT_Device {
    constructor(listener, serial) {
        super(listener, "SHSEN-1#" + serial);
        this.motion = new device_1.Property(11);
        this.charger = new device_1.Property(22);
        this.temperature = new device_1.Property(33);
        this.humidity = new device_1.Property(44);
        this.lux = new device_1.Property(66);
        this.battery = new device_1.Property(77);
        this._all_props[11] = this.motion;
        this._all_props[22] = this.charger;
        this._all_props[33] = this.temperature;
        this._all_props[44] = this.humidity;
        this._all_props[66] = this.lux;
        this._all_props[77] = this.battery;
    }
    ;
}
exports.SHSEN_1 = SHSEN_1;
//===== SHSW-44 =====
class SHSW_44 extends device_1.CoIoT_Device {
    constructor(listener, serial) {
        super(listener, "SHSW-44#" + serial);
        this.Relay0 = {
            W: new device_1.Property(111),
            Switch: new device_1.Property(112),
        };
        this.Relay1 = {
            W: new device_1.Property(121),
            Switch: new device_1.Property(122),
        };
        this.Relay2 = {
            W: new device_1.Property(131),
            Switch: new device_1.Property(132),
        };
        this.Relay3 = {
            W: new device_1.Property(141),
            Switch: new device_1.Property(142),
        };
        this._all_props[111] = this.Relay0.W;
        this._all_props[112] = this.Relay0.Switch;
        this._all_props[121] = this.Relay1.W;
        this._all_props[122] = this.Relay1.Switch;
        this._all_props[131] = this.Relay2.W;
        this._all_props[132] = this.Relay2.Switch;
        this._all_props[141] = this.Relay3.W;
        this._all_props[142] = this.Relay3.Switch;
    }
    ;
}
exports.SHSW_44 = SHSW_44;
