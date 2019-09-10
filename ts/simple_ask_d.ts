import {Listener, DEFAULT_COAP_PORT} from "./listener"
import { Coap_Message, Coap_MinMessage } from "./coap_message";
import { coap_prepare_get } from "./coap_encode";
import { AddressInfo } from "net";
let l:Listener=new Listener();

let tgt=process.argv[2];
if (tgt=='' || tgt===undefined) {
	console.log("specify target ip!");
	process.exit(-1);
}
let desc='';
let tgt_rinfo:AddressInfo={
	address:tgt,
	family:"IPv4",
	port:DEFAULT_COAP_PORT

}
console.log("TARGET: "+tgt+':'+DEFAULT_COAP_PORT);

function trackdesc(resp:Coap_Message|undefined,req:Coap_MinMessage):void{
	if (resp==undefined) {
		console.log("Timeout for reply from "+tgt);
	} else {
		if (resp.pl==undefined) {
			console.log("CaAP reply from "+tgt+': ',resp);
		} else {
			console.log("CoIoT description from "+tgt+': '+resp.pl.toString('utf8'));
		}
	}
}

l.on('/cit/s',(m:Coap_Message)=>{
	if (m.pl!=undefined) {
		if (m.coiot_dev==undefined) return;
		if (m.rinfo.address!=tgt) return;
		let statadded:boolean;

		console.log("CoIoT status from "+m.coiot_devidrev+'@'+m.rinfo.address+':'+m.pl.toString('utf8'));
		if (desc!='') return;

		l.send_and_track(coap_prepare_get("/cit/d"),m.rinfo,trackdesc);
			
	} else {
		console.log("CoIoT status from "+m.coiot_devidrev+'@'+m.rinfo.address+' with no PL?!');
	}
})

l.on('msg',(m:Coap_Message)=>{
	if (m.uri_path!='/cit/s'){
		if (m.pl!=undefined) { 
			console.log("CoAP request for "+m.uri_path+" from "+m.coiot_devidrev+'@'+m.rinfo.address+' playload:'+m.pl.toString('utf8'));
		} else {
			console.log("CoAP request for "+m.uri_path+" from "+m.coiot_devidrev+'@'+m.rinfo.address+' no paload!');
		}
	}
})

l.on('ready',()=>{
	console.log("asking /cit/d ...");
	l.send_and_track(coap_prepare_get("/cit/d"),tgt_rinfo,trackdesc);
});
