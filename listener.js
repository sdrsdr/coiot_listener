"use strict";
/*
 * listener.ts; listener.js
 *
 * Copyright (c) 2018, Stoian Ivanov. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation version 3.0
 * of the License.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
*/
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const dgram_1 = require("dgram");
const os_1 = require("os");
const coap_decode_1 = require("./coap_decode");
const coap_encode_1 = require("./coap_encode");
exports.DEFAULT_COAP_PORT = 5683;
class Listener extends events_1.EventEmitter {
    constructor(port = exports.DEFAULT_COAP_PORT) {
        super();
        this.port = port;
        this.trackdata = new Map();
        this.socket = dgram_1.createSocket("udp4");
        this.socket.on('message', (msg, rinfo) => {
            //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
            try {
                this.emit('rawmsg', msg, rinfo);
            }
            catch (e) {
                this.emit('rawerr', e, rinfo);
                return;
            }
            let coapmsg;
            try {
                coapmsg = coap_decode_1.coap_decode(msg, rinfo);
            }
            catch (e) {
                this.emit("perror", msg, rinfo);
                return;
            }
            if (coapmsg == undefined)
                return;
            let trk = this.trackdata.get(coapmsg.messageID);
            if (trk != undefined) {
                this.finish(trk); //cleanup
                trk.cb(coapmsg, trk.req);
            }
            else {
                try {
                    this.emit('msg', coapmsg);
                    if (coapmsg.uri_path === '/cit/s'
                        && coapmsg.coiot_stat_serial != undefined
                        && coapmsg.coiot_dev != undefined
                        && coapmsg.coiot_id != undefined) {
                        this.emit('/cit/s', coapmsg, coapmsg.coiot_stat_serial, coapmsg.coiot_dev);
                        this.emit('/cit/s@' + coapmsg.coiot_dev + "#" + coapmsg.coiot_id, coapmsg, coapmsg.coiot_stat_serial);
                    }
                }
                catch (e) {
                    this.emit("herror", coapmsg);
                    return;
                }
            }
        });
        this.socket.on('error', (err) => {
            console.log('soket error:\n', err.stack);
            this.socket.close();
            this.emit('serror', err);
        });
        this.socket.bind(port, undefined, () => {
            //console.log('soket bind to ',port,'OK');
            var ifaces = os_1.networkInterfaces();
            for (let ifname in ifaces)
                if (ifaces.hasOwnProperty(ifname)) {
                    let dev = ifaces[ifname];
                    for (let addr of dev) {
                        if (addr.internal || addr.family != 'IPv4')
                            continue;
                        if ((addr.address.substr(0, 3) == '10.')
                            || (addr.address.substr(0, 8) == '192.168.')
                            || (addr.address.match(/172\.1[6789]\./) !== null)
                            || (addr.address.match(/172\.2[0123456789]\./) !== null)
                            || (addr.address.match(/172\.3[012]\./) !== null)) {
                            console.log("Joining CoAP Multicast on ", addr.address);
                            this.socket.addMembership("224.0.1.187", addr.address);
                        }
                    }
                }
            this.emit('ready');
        });
    }
    send_and_track(m, rinfo, cb) {
        //we use the closure for private storage
        //the timout scheme is linear with 4 retrys 0.55s avarage seconds apart
        //as we're in the LAN so we don't have to wait too much to decide the peer is down   
        //queue handling here?
        let b = coap_encode_1.coap_encode(m);
        let trdata;
        let retry;
        let rleft = 3;
        this.trackdata.set(m.messageID, (trdata = {
            cb, req: m, tmo: setTimeout((retry = (() => {
                if (rleft == 0) {
                    trdata.tmo = undefined;
                    this.finish(trdata);
                    cb(undefined, m);
                    return;
                }
                rleft--;
                this.socket.send(b, rinfo.port, rinfo.address);
                trdata.tmo = setTimeout(retry, 500 + 100 * Math.random());
            })), 500 + 100 * Math.random())
        }));
        this.socket.send(b, rinfo.port, rinfo.address);
    }
    finish(trdata) {
        if (trdata.tmo != undefined)
            clearTimeout(trdata.tmo);
        //queue handling here?
        this.trackdata.delete(trdata.req.messageID);
    }
}
exports.Listener = Listener;
