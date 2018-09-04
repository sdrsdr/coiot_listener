"use strict";
/*
 * device.ts; device.js
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
class Property extends events_1.EventEmitter {
    constructor(id) {
        super();
        this.id = id;
    }
}
exports.Property = Property;
class CoIoT_Device extends events_1.EventEmitter {
    constructor(listener, dev_serial) {
        super();
        this._all_props = {};
        listener.on('/cit/s@' + dev_serial, (m, stat_serial) => {
            if ((this.lastserial == undefined || this.lastserial != stat_serial) && m.pl != undefined) {
                let pl;
                try {
                    pl = JSON.parse(m.pl.toString('utf8'));
                }
                catch (e) {
                    return;
                }
                if (Array.isArray(pl.G)) {
                    if (this.device_ip !== m.rinfo.address) {
                        this.device_ip = m.rinfo.address;
                        this.emit('newip', this.device_ip);
                    }
                    ;
                    this.handle_changed_state(pl.G);
                }
            }
        });
    }
    ;
    handle_changed_state(G) {
        for (let tuple of G) {
            if (Array.isArray(tuple) && tuple.length == 3) {
                let propid;
                if (tuple[0] === 0 && typeof (tuple[1]) == 'number') {
                    let prop = this._all_props[tuple[1]];
                    if (prop == undefined)
                        continue;
                    if (prop.value === tuple[2])
                        continue;
                    let oldvalue = prop.value;
                    prop.value = tuple[2];
                    prop.emit('change', prop.value, oldvalue);
                }
            }
        }
    }
}
exports.CoIoT_Device = CoIoT_Device;
