"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelly_1 = require("./shelly");
const listener_1 = require("./listener");
let listener = new listener_1.Listener();
let sen = new shelly_1.SHSEN_1(listener, '4B3F9E');
let sw = new shelly_1.SHSW_44(listener, '06231A');
sen.on('newip', () => {
    console.log("sensor is now at ip " + sen.device_ip);
});
sen.motion.on('change', () => {
    console.log("we got motion on sensor,temp is " + sen.temperature.value);
});
sen.temperature.on('change', () => {
    console.log("we got temperature change on sensor:" + sen.temperature.value);
});
sw.on('newip', () => {
    console.log("switch is now at ip " + sw.device_ip + " relay states: " + sw.Relay0.Switch.value + "/" + sw.Relay1.Switch.value + "/" + sw.Relay2.Switch.value + "/" + sw.Relay3.Switch.value);
});
sw.Relay0.W.on('change', () => {
    console.log("Powerusage on relay 0 at ip :" + sw.device_ip + " is now " + sw.Relay0.W.value);
});
