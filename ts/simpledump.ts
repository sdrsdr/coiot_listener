import {Listener} from "./listener"
import { Coap_Message } from "./coap_message";
import { coap_prepare_get } from "./coap_encode";
let l:Listener=new Listener();
let first=true;
l.on('/cit/s',(m:Coap_Message)=>{
	if (m.pl!=undefined) {
		console.log("CoIoT status from "+m.coiot_devidrev+'@'+m.rinfo.address+':'+m.pl.toString('utf8'));
		if (first && m.coiot_dev=='SHSW-44'){
			first=false;
			l.send_and_track(coap_prepare_get("/cit/d"),m.rinfo,(resp,req)=>{
				if (resp==undefined) {
					console.log("Timeout for reply from "+m.coiot_devidrev+'@'+m.rinfo.address);
				} else {
					if (resp.pl==undefined) {
						console.log("CaAP reply from "+m.coiot_devidrev+'@'+m.rinfo.address+':',resp);
					} else {
						console.log("CoIoT description from "+m.coiot_devidrev+'@'+m.rinfo.address+':'+resp.pl.toString('utf8'));
					}
				}
			});
			
		}
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