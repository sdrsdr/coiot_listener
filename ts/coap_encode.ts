/*
 * coap_encode.ts; coap_encode.js
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

import { Coap_Message, Coap_MinMessage, Coap_Option } from "./coap_message";
import { Coap_Codes, Coap_MTypes, Coap_Options } from "./coapcodes";

export function coap_encode(m:Coap_MinMessage):Buffer{
	let tokenLength=0;
	if (m.tok) tokenLength=m.tok.length;

	let encodedHeader=(1<<30)|((m.messageType &0x03)<<28) | ((tokenLength&0x0f)<<24) | ((m.messageCode&0x0ff)<<16) | (m.messageID &0x0ffff);
	let optlen=0;
	if (m.opt!=undefined) {
		for (let o of m.opt) {
			optlen+=5+o.val.length; //worst case
		}
		m.opt.sort((a,b)=>{
			return a.num-b.num;
		})
	}
	let b=Buffer.alloc(6+tokenLength+optlen+(m.pl==undefined?0:m.pl.length));
	b.writeInt32BE(encodedHeader,0);let pos=4;
	if (m.tok) {
		m.tok.copy(b,pos);pos+=m.tok.length;
	}
	let lastopt=0;
	if (m.opt) for (let o of m.opt) {
		let delta=o.num-lastopt;lastopt=o.num;

		let d2:number=0;
		
		if (delta>=269)  {
			d2=delta-269; delta=14;
		} else if (delta>=13) {
			d2=delta-13; delta=13;
		}

		let len=o.val.length;
		let l2:number=0;
		if (len>=269)  {
			l2=len-269; len=14;
		} else if (len>=13) {
			l2=len-13; len=13;
		}

		b[pos]=((delta &0x000f)<<4)|(len&0x000f);pos++;
		if (delta==14) {
			b[pos]=(d2>>8) &0x0ff; 
			b[pos+1]=d2 &0x0ff; 
			pos+=2;
		} else if (delta==13){
			b[pos]=(d2 &0x0ff); pos++;
		}
		if (len==14) {
			b[pos]=(l2>>8) &0x0ff; 
			b[pos+1]=l2 &0x0ff; 
			pos+=2;
		} else if (len==13){
			b[pos]=(l2 &0x0ff); pos++;
		}
		o.val.copy(b,pos); pos+=o.val.length;
	}
	b[pos]=0xff;pos++;  
	if (m.pl){
		m.pl.copy(b,pos); pos+=m.pl.length;
	}
	return b.slice(0,pos);

}
let getMessageId_base=0;
export function getMessageId():number{
	getMessageId_base++; 
	if (getMessageId_base>0x0ffff) getMessageId_base=1;
	return getMessageId_base;
}

export function coap_prepare_get(uri:string,msgid?:number):Coap_MinMessage{
	if (msgid==undefined) msgid=getMessageId();
	let m:Coap_MinMessage={
		messageID:msgid,
		messageCode:Coap_Codes.GET,
		messageType:Coap_MTypes.CON,
	}
	m.opt=new Array<Coap_Option>();
	let parts=uri.split('/');
	for (let p of parts) if (p!='') {
		m.opt.push({num:Coap_Options.URI_PATH,val:Buffer.from(p,"utf8")});
	}
	return m;
}
