"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listener_1 = require("./listener");
const coap_encode_1 = require("./coap_encode");
let l = new listener_1.Listener();
let tgt = process.argv[2];
if (tgt == '' || tgt === undefined) {
    console.log("specify target ip!");
    process.exit(-1);
}
let desc = '';
let tgt_rinfo = {
    address: tgt,
    family: "IPv4",
    port: listener_1.DEFAULT_COAP_PORT
};
console.log("TARGET: " + tgt + ':' + listener_1.DEFAULT_COAP_PORT);
function trackdesc(resp, req) {
    if (resp == undefined) {
        console.log("Timeout for reply from " + tgt);
    }
    else {
        if (resp.pl == undefined) {
            console.log("CaAP reply from " + tgt + ': ', resp);
        }
        else {
            console.log("CoIoT description from " + tgt + ': ' + resp.pl.toString('utf8'));
        }
    }
}
l.on('/cit/s', (m) => {
    if (m.pl != undefined) {
        if (m.coiot_dev == undefined)
            return;
        if (m.rinfo.address != tgt)
            return;
        let statadded;
        console.log("CoIoT status from " + m.coiot_devidrev + '@' + m.rinfo.address + ':' + m.pl.toString('utf8'));
        if (desc != '')
            return;
        l.send_and_track(coap_encode_1.coap_prepare_get("/cit/d"), m.rinfo, trackdesc);
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
l.on('ready', () => {
    console.log("asking /cit/d ...");
    l.send_and_track(coap_encode_1.coap_prepare_get("/cit/d"), tgt_rinfo, trackdesc);
});
