"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listener_1 = require("./listener");
const coap_encode_1 = require("./coap_encode");
let l = new listener_1.Listener();
let stat_from = new Set();
let desc_from = new Set();
l.on('/cit/s', (m) => {
    if (m.pl != undefined) {
        if (m.coiot_dev == undefined)
            return;
        let statadded;
        if ((statadded = stat_from.has(m.coiot_dev)) && desc_from.has(m.coiot_dev))
            return;
        if (!statadded) {
            stat_from.add(m.coiot_dev);
            console.log("CoIoT status from " + m.coiot_devidrev + '@' + m.rinfo.address + ':' + m.pl.toString('utf8'));
        }
        l.send_and_track(coap_encode_1.coap_prepare_get("/cit/d"), m.rinfo, (resp, req) => {
            if (m.coiot_dev == undefined || desc_from.has(m.coiot_dev))
                return;
            if (resp == undefined) {
                console.log("Timeout for reply from " + m.coiot_devidrev + '@' + m.rinfo.address);
            }
            else {
                if (resp.pl == undefined) {
                    console.log("CaAP reply from " + m.coiot_devidrev + '@' + m.rinfo.address + ':', resp);
                }
                else {
                    desc_from.add(m.coiot_dev);
                    console.log("CoIoT description from " + m.coiot_devidrev + '@' + m.rinfo.address + ':' + resp.pl.toString('utf8'));
                }
            }
        });
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
