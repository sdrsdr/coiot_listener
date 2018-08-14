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
