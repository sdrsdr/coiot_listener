/*
 * coap_message.ts; coap_message.js
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
import { AddressInfo } from "net";
import { Coap_MTypes, Coap_Codes } from "./coapcodes";

export interface Coap_Option{
	num:number,
	val:Buffer,
}

export interface Coap_MinMessage{
	messageType:Coap_MTypes,
	messageCode:Coap_Codes,
	messageID:number, 
	tok?:Buffer, 
	opt?:Coap_Option[], 
	pl?:Buffer
}

export interface Coap_Message  extends Coap_MinMessage{
	rinfo:AddressInfo;
	uri_path?:string;
	coiot_devidrev?:string;
	coiot_dev?:string;
	coiot_id?:string;
	coiot_rev?:string;
	coiot_stat_serial?:number;
};
