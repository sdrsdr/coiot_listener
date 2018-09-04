"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listener_1 = require("./listener");
const coap_encode_1 = require("./coap_encode");
let l = new listener_1.Listener();
let first = true;
l.on('/cit/s', (m) => {
    if (m.pl != undefined) {
        console.log("CoIoT status from " + m.coiot_devidrev + '@' + m.rinfo.address + ':' + m.pl.toString('utf8'));
        if (first && m.coiot_dev == 'SHSW-44') {
            first = false;
            l.send_and_track(coap_encode_1.coap_prepare_get("/cit/d"), m.rinfo, (resp, req) => {
                if (resp == undefined) {
                    console.log("Timeout for reply from " + m.coiot_devidrev + '@' + m.rinfo.address);
                }
                else {
                    if (resp.pl == undefined) {
                        console.log("CaAP reply from " + m.coiot_devidrev + '@' + m.rinfo.address + ':', resp);
                    }
                    else {
                        console.log("CoIoT description from " + m.coiot_devidrev + '@' + m.rinfo.address + ':' + resp.pl.toString('utf8'));
                    }
                }
            });
        }
    }
    else {
        console.log("CoIoT status from " + m.coiot_devidrev + '@' + m.rinfo.address + ' with no PL?!');
    }
});
l.on('msg', (m) => {
    if (m.uri_path != '/cit/s') {
        if (m.pl != undefined) {
            console.log("CoAP request for " + m.uri_path + " from " + m.coiot_devidrev + '@' + m.rinfo.address + ' playload:' + m.pl.toString('utf8'));
        }
        else {
            console.log("CoAP request for " + m.uri_path + " from " + m.coiot_devidrev + '@' + m.rinfo.address + ' no paload!');
        }
    }
});
