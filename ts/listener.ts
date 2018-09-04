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

import { EventEmitter } from "events";
import { Socket, createSocket } from "dgram";
import {networkInterfaces} from "os"
import { coap_decode } from "./coap_decode";
import { Coap_MinMessage, Coap_Message } from "./coap_message";
import { AddressInfo } from "net";
import { coap_encode } from "./coap_encode";
import { read } from "fs";
import { Coap_MTypes } from "./coapcodes";
export interface Track_Callback {
	(resp:Coap_Message|undefined,req:Coap_MinMessage):void;
}

interface Track_Data {
	req:Coap_MinMessage,
	cb:Track_Callback,
	tmo:any;
	//this should be more complicated to properly handle NSTART=1
	//  1. form a queue per destination  
	//  2. track if destionation ins pending responce and if so put in queue
	//  3. on responce get next from queue, set as current send .. wait 
}

export const DEFAULT_COAP_PORT=5683;
export class Listener extends EventEmitter {
	socket:Socket;
	trackdata:Map<number,Track_Data>=new Map<number,Track_Data>();
	constructor(public port:number=DEFAULT_COAP_PORT){
		super();
		this.socket=createSocket("udp4");
		this.socket.on('message', (msg, rinfo) => {
			//console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
			try {
				this.emit('rawmsg',msg,rinfo);
			} catch (e){
				this.emit('rawerr',e,rinfo);
				return;
			}
			let coapmsg;
			try {
				coapmsg=coap_decode(msg,rinfo);
			} catch(e) {
				this.emit("perror",msg,rinfo);
				return;
			}
			if (coapmsg==undefined) return;

			let trk:Track_Data|undefined=this.trackdata.get(coapmsg.messageID);
			if (trk!=undefined) {
				this.finish(trk); //cleanup
				trk.cb(coapmsg,trk.req);
			} else {
				try {
					this.emit('msg',coapmsg);
					if (
						coapmsg.uri_path==='/cit/s' 
						&& coapmsg.coiot_stat_serial!=undefined 
						&& coapmsg.coiot_dev!=undefined
						&& coapmsg.coiot_id!=undefined
					){
						this.emit('/cit/s',coapmsg,coapmsg.coiot_stat_serial,coapmsg.coiot_dev);
						this.emit('/cit/s@'+coapmsg.coiot_dev+"#"+coapmsg.coiot_id,coapmsg,coapmsg.coiot_stat_serial);

					}
				} catch(e){
					this.emit("herror",coapmsg);
					return;
				}
			}
		});

		this.socket.on('error',  (err)=>  {
			console.log('soket error:\n',err.stack);
			this.socket.close();
			this.emit('serror',err);
		});
		
		this.socket.bind(port,undefined,()=>{
			//console.log('soket bind to ',port,'OK');
			var ifaces = networkInterfaces();
			for(let ifname  in ifaces) if (ifaces.hasOwnProperty(ifname)) {
				let dev=ifaces[ifname];
				for(let addr of dev) {
					if (addr.internal || addr.family!='IPv4' ) continue;
					if (
						(addr.address.substr(0,3)=='10.')
						||(addr.address.substr(0,8)=='192.168.')
						||(addr.address.match(/172\.1[6789]\./)!==null)
						||(addr.address.match(/172\.2[0123456789]\./)!==null)
						||(addr.address.match(/172\.3[012]\./)!==null)
					) {
						console.log("Joining CoAP Multicast on ",addr.address);
						this.socket.addMembership("224.0.1.187",addr.address);
					}
				}
			}

		});


	}
	send_and_track(m:Coap_MinMessage,rinfo:AddressInfo, cb:Track_Callback){
		//we use the closure for private storage
		//the timout scheme is linear with 4 retrys 0.55s avarage seconds apart
		//as we're in the LAN so we don't have to wait too much to decide the peer is down   

		//queue handling here?

		let b=coap_encode(m);
		let trdata:Track_Data;
		let retry:any;
		let rleft=3;
		this.trackdata.set(m.messageID,(trdata={
			cb,req:m,tmo:setTimeout((retry=(()=>{
				if (rleft==0) {
					trdata.tmo=undefined;
					this.finish(trdata);
					cb(undefined,m);
					return;
				}
				rleft--;
				this.socket.send(b,rinfo.port,rinfo.address);
				trdata.tmo=setTimeout(retry,500+100*Math.random());
			})),500+100*Math.random())
		}));
		this.socket.send(b,rinfo.port,rinfo.address);
	}

	finish(trdata:Track_Data){
		if (trdata.tmo!=undefined) clearTimeout(trdata.tmo);
		//queue handling here?
		this.trackdata.delete(trdata.req.messageID);

	}
}