"use strict";
/*
 * device_generators.ts; device_generators.js
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
const id_forbid_re = /[^A-Za-z0-9_]/g;
function name_to_id(name) {
    let res = name.trim().replace(id_forbid_re, '_');
    if (!isNaN(Number(res.charAt(0))))
        res = '_' + res;
    return res;
}
function generate_from_strings(dev, pl) {
    let d;
    try {
        d = JSON.parse(pl);
    }
    catch (e) {
        return undefined;
    }
    if (d == undefined)
        return undefined;
    if (d == null)
        return undefined;
    if (typeof d != 'object' || Array.isArray(d))
        return undefined;
    let blks = d.blk;
    let sens = d.sen;
    if (!Array.isArray(blks))
        return undefined;
    if (!Array.isArray(sens))
        return undefined;
    let rootprops = {
        blkname: "root", blkid: -1,
        pcount: 0,
        p: {}
    };
    let last_blkprops = rootprops; //we keep this around  if we can do lvel removal latter on
    // the assignment itself is not really needed but it makes the compiler happy
    let blkprops = {};
    let nblk = 0;
    for (let b of blks) {
        if (typeof b.I != 'number' || typeof b.D != 'string')
            continue;
        last_blkprops = { blkid: b.I, blkname: name_to_id(b.D), pcount: 0, p: {} };
        blkprops[b.I] = last_blkprops;
        nblk++;
    }
    for (let s of sens) {
        if (s.D == undefined) {
            if (typeof s.T == 'string')
                s.D = s.T; //quirk to handle "Type as description" situation
        }
        if (typeof s.I != 'number' || typeof s.D != 'string')
            continue;
        let p = {
            id: s.I, name: name_to_id(s.D),
        };
        let l = s.L;
        let b;
        if (typeof l == 'number') {
            if (blkprops[l] == undefined) {
                b = rootprops;
            }
            else {
                b = blkprops[l];
            }
        }
        else {
            b = rootprops;
        }
        b.pcount++;
        b.p[p.id] = p;
    }
    //console.log("====== no merge results===================");
    //console.log("root props:",rootprops);
    //console.log("block props:",blkprops);
    //check if we can remove a level as we have single block with all properties in it
    if (nblk == 1 && rootprops.pcount == 0) {
        //yes we do we ubstitute root block with it and empty the blocks list
        rootprops = last_blkprops; //last and only
        blkprops = {}; //reset  so it appears that we have root-properties only
    }
    //console.log("====== merge results===================");
    //console.log("root props:",rootprops);
    //console.log("block props:",blkprops);
    let propsreg = '';
    let prolog = "export class " + name_to_id(dev) + " extends CoIoT_Device {\n";
    let rootprops_gen = '';
    let blockprops_gen = '';
    if (rootprops.pcount > 0) {
        for (let propid in rootprops.p)
            if (rootprops.p.hasOwnProperty(propid)) {
                let p = rootprops.p[propid];
                rootprops_gen += "\t" + p.name + ":Property=new Property(" + propid + ");\n";
                propsreg += "\t\t" + "this._all_props[" + propid + "]=this." + p.name + ";\n";
            }
    }
    for (let blkid in blkprops)
        if (blkprops.hasOwnProperty(blkid) && blkprops[blkid].pcount > 0) {
            let bprops = blkprops[blkid];
            blockprops_gen += (blockprops_gen == '' ? "\t" : "\n\t") + bprops.blkname + "={\n";
            for (let propid in bprops.p)
                if (bprops.p.hasOwnProperty(propid)) {
                    let p = bprops.p[propid];
                    blockprops_gen += "\t\t" + p.name + ":new Property(" + propid + "),\n";
                    propsreg += "\t\t" + "this._all_props[" + propid + "]=this." + bprops.blkname + "." + p.name + ";\n";
                }
            blockprops_gen += "\t};\n";
        }
    let epilog = "\tconstructor(listener:Listener,serial:string){\n";
    epilog += "\t\tsuper(listener,\"" + dev + "#\"+serial);\n";
    epilog += propsreg;
    epilog += "\t};\n}\n";
    return prolog + rootprops_gen + blockprops_gen + epilog;
}
exports.generate_from_strings = generate_from_strings;
function generate_from_descriptor(m) {
    if (m.pl == undefined || m.coiot_dev == undefined)
        return undefined;
    return generate_from_strings(m.coiot_dev, m.pl.toString('utf8'));
}
exports.generate_from_descriptor = generate_from_descriptor;
