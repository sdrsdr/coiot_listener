/*
 * coapcodes.ts; coapcodes.js
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

export enum Coap_MTypes{
	CON=0,
	NON=1,
	ACK=2,
	RST=3,
};

export enum Coap_Codes {
//requests:
	EMPTY = 0,
	GET = 1,
	POST = 2,
	PUT  = 3,
	DELETE = 4,
	PUBLISH = 30 , //NON Standart for broadcast with payload (no responce expected)
	
//responces:
	CREATED_201 = 65,
	DELETED_202 = 66,
	VALID_203 = 67,
	CHANGED_204 = 68,
	CONTENT_205 = 69,
	CONTINUE_231 = 95,
	BAD_REQUEST_400 = 128,
	UNAUTHORIZED_401 = 129,
	BAD_OPTION_402 = 130,
	FORBIDDEN_403 = 131,
	NOT_FOUND_404 = 132,
	METHOD_NOT_ALLOWED_405 = 133,
	NOT_ACCEPTABLE_406 = 134,
	REQUEST_ENTITY_INCOMPLETE_408 = 136,
	PRECONDITION_FAILED_412 = 140,
	REQUEST_ENTITY_TOO_LARGE_413 = 141,
	UNSUPPORTED_CONTENT_FORMAT_415 = 143,
	INTERNAL_SERVER_ERROR_500 = 160,
	NOT_IMPLEMENTED_501 = 161,
	BAD_GATEWAY_502 = 162,
	SERVICE_UNAVAILABLE_503 = 163,
	GATEWAY_TIMEOUT_504 = 164,
	PROXYING_NOT_SUPPORTED_505 = 165,
};


export function isKnownMessageCode(code:number):string|undefined {
	return Coap_Codes[code];
};

export function allowsContent( code:number) {
	return !(code == Coap_Codes.GET || code == Coap_Codes.DELETE);
	return code == Coap_Codes.PUBLISH ;
};




export function getCodeClass (code:number):number {	return (code & 0x0ff) >> 5;};
export function getCodeDetail(code:number) { return code & 0x01f; };
export function isRequest (code:number) { return  getCodeClass(code)==0;  };
export function isResponse (code:number) {	return getCodeClass(code)!=0; };


export enum Coap_Options {
	UNKNOWN = -1,
	IF_MATCH = 1,
	URI_HOST = 3,
	ETAG = 4,
	IF_NONE_MATCH = 5,
	OBSERVE = 6,
	URI_PORT = 7,
	LOCATION_PATH = 8,
	URI_PATH = 11,
	CONTENT_FORMAT = 12,
	MAX_AGE = 14,
	URI_QUERY = 15,
	ACCEPT = 17,
	LOCATION_QUERY = 20,
	BLOCK_2 = 23,
	BLOCK_1 = 27,
	SIZE_2 = 28,
	PROXY_URI = 35,
	PROXY_SCHEME = 39,
	SIZE_1 = 60,
	ENDPOINT_ID_1 = 124,
	ENDPOINT_ID_2 = 189,


	COIOT_DEVID = 3332,
	COIOT_STATUS_VALIDITY = 3412,
	COIOT_STATUS_SERIAL = 3420,
};