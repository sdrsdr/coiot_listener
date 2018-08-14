import { Listener } from "./listener";
import { Coap_Message } from "./coap_message";
import { EventEmitter } from "events";
export class Property extends EventEmitter{
	value:unknown;
	constructor(public id:number) {
		super();
	}
}
export interface Propery_List{
	[propid:number]:Property;
}
export class CoIoT_Device extends EventEmitter{
	lastserial?:number;
	_all_props:Propery_List;
	device_ip?:string;
	constructor(listener:Listener,dev_serial:string){
		super();
		this._all_props={};
		listener.on('/cit/s@'+dev_serial,(m:Coap_Message,stat_serial:number)=>{
			if ((this.lastserial==undefined || this.lastserial!=stat_serial) && m.pl!=undefined){
				let pl:any;
				try {
					pl=JSON.parse(m.pl.toString('utf8'));
				} catch (e) {
					return;
				}
				if ( Array.isArray(pl.G)) {
					if (this.device_ip!==m.rinfo.address){
						this.device_ip=m.rinfo.address;
						this.emit('newip',this.device_ip);
					};
					this.handle_changed_state(pl.G);
				}
			}
		})
	};
	handle_changed_state(G:any[]){
		for (let tuple of G){
			if (Array.isArray(tuple) && tuple.length==3){
				let propid:number;
				if (tuple[0]===0 && typeof(tuple[1])=='number') {
					let prop=this._all_props[tuple[1]];
					if (prop==undefined) continue;
					if (prop.value===tuple[2]) continue;
					let oldvalue=prop.value;
					prop.value=tuple[2];
					prop.emit('change',prop.value,oldvalue);

				}
			}
		}
	}
}