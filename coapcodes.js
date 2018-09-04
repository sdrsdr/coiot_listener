"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Coap_MTypes;
(function (Coap_MTypes) {
    Coap_MTypes[Coap_MTypes["CON"] = 0] = "CON";
    Coap_MTypes[Coap_MTypes["NON"] = 1] = "NON";
    Coap_MTypes[Coap_MTypes["ACK"] = 2] = "ACK";
    Coap_MTypes[Coap_MTypes["RST"] = 3] = "RST";
})(Coap_MTypes = exports.Coap_MTypes || (exports.Coap_MTypes = {}));
;
var Coap_Codes;
(function (Coap_Codes) {
    //requests:
    Coap_Codes[Coap_Codes["EMPTY"] = 0] = "EMPTY";
    Coap_Codes[Coap_Codes["GET"] = 1] = "GET";
    Coap_Codes[Coap_Codes["POST"] = 2] = "POST";
    Coap_Codes[Coap_Codes["PUT"] = 3] = "PUT";
    Coap_Codes[Coap_Codes["DELETE"] = 4] = "DELETE";
    Coap_Codes[Coap_Codes["PUBLISH"] = 30] = "PUBLISH";
    //responces:
    Coap_Codes[Coap_Codes["CREATED_201"] = 65] = "CREATED_201";
    Coap_Codes[Coap_Codes["DELETED_202"] = 66] = "DELETED_202";
    Coap_Codes[Coap_Codes["VALID_203"] = 67] = "VALID_203";
    Coap_Codes[Coap_Codes["CHANGED_204"] = 68] = "CHANGED_204";
    Coap_Codes[Coap_Codes["CONTENT_205"] = 69] = "CONTENT_205";
    Coap_Codes[Coap_Codes["CONTINUE_231"] = 95] = "CONTINUE_231";
    Coap_Codes[Coap_Codes["BAD_REQUEST_400"] = 128] = "BAD_REQUEST_400";
    Coap_Codes[Coap_Codes["UNAUTHORIZED_401"] = 129] = "UNAUTHORIZED_401";
    Coap_Codes[Coap_Codes["BAD_OPTION_402"] = 130] = "BAD_OPTION_402";
    Coap_Codes[Coap_Codes["FORBIDDEN_403"] = 131] = "FORBIDDEN_403";
    Coap_Codes[Coap_Codes["NOT_FOUND_404"] = 132] = "NOT_FOUND_404";
    Coap_Codes[Coap_Codes["METHOD_NOT_ALLOWED_405"] = 133] = "METHOD_NOT_ALLOWED_405";
    Coap_Codes[Coap_Codes["NOT_ACCEPTABLE_406"] = 134] = "NOT_ACCEPTABLE_406";
    Coap_Codes[Coap_Codes["REQUEST_ENTITY_INCOMPLETE_408"] = 136] = "REQUEST_ENTITY_INCOMPLETE_408";
    Coap_Codes[Coap_Codes["PRECONDITION_FAILED_412"] = 140] = "PRECONDITION_FAILED_412";
    Coap_Codes[Coap_Codes["REQUEST_ENTITY_TOO_LARGE_413"] = 141] = "REQUEST_ENTITY_TOO_LARGE_413";
    Coap_Codes[Coap_Codes["UNSUPPORTED_CONTENT_FORMAT_415"] = 143] = "UNSUPPORTED_CONTENT_FORMAT_415";
    Coap_Codes[Coap_Codes["INTERNAL_SERVER_ERROR_500"] = 160] = "INTERNAL_SERVER_ERROR_500";
    Coap_Codes[Coap_Codes["NOT_IMPLEMENTED_501"] = 161] = "NOT_IMPLEMENTED_501";
    Coap_Codes[Coap_Codes["BAD_GATEWAY_502"] = 162] = "BAD_GATEWAY_502";
    Coap_Codes[Coap_Codes["SERVICE_UNAVAILABLE_503"] = 163] = "SERVICE_UNAVAILABLE_503";
    Coap_Codes[Coap_Codes["GATEWAY_TIMEOUT_504"] = 164] = "GATEWAY_TIMEOUT_504";
    Coap_Codes[Coap_Codes["PROXYING_NOT_SUPPORTED_505"] = 165] = "PROXYING_NOT_SUPPORTED_505";
})(Coap_Codes = exports.Coap_Codes || (exports.Coap_Codes = {}));
;
function isKnownMessageCode(code) {
    return Coap_Codes[code];
}
exports.isKnownMessageCode = isKnownMessageCode;
;
function allowsContent(code) {
    return !(code == Coap_Codes.GET || code == Coap_Codes.DELETE);
    return code == Coap_Codes.PUBLISH;
}
exports.allowsContent = allowsContent;
;
function getCodeClass(code) { return (code & 0x0ff) >> 5; }
exports.getCodeClass = getCodeClass;
;
function getCodeDetail(code) { return code & 0x01f; }
exports.getCodeDetail = getCodeDetail;
;
function isRequest(code) { return getCodeClass(code) == 0; }
exports.isRequest = isRequest;
;
function isResponse(code) { return getCodeClass(code) != 0; }
exports.isResponse = isResponse;
;
var Coap_Options;
(function (Coap_Options) {
    Coap_Options[Coap_Options["UNKNOWN"] = -1] = "UNKNOWN";
    Coap_Options[Coap_Options["IF_MATCH"] = 1] = "IF_MATCH";
    Coap_Options[Coap_Options["URI_HOST"] = 3] = "URI_HOST";
    Coap_Options[Coap_Options["ETAG"] = 4] = "ETAG";
    Coap_Options[Coap_Options["IF_NONE_MATCH"] = 5] = "IF_NONE_MATCH";
    Coap_Options[Coap_Options["OBSERVE"] = 6] = "OBSERVE";
    Coap_Options[Coap_Options["URI_PORT"] = 7] = "URI_PORT";
    Coap_Options[Coap_Options["LOCATION_PATH"] = 8] = "LOCATION_PATH";
    Coap_Options[Coap_Options["URI_PATH"] = 11] = "URI_PATH";
    Coap_Options[Coap_Options["CONTENT_FORMAT"] = 12] = "CONTENT_FORMAT";
    Coap_Options[Coap_Options["MAX_AGE"] = 14] = "MAX_AGE";
    Coap_Options[Coap_Options["URI_QUERY"] = 15] = "URI_QUERY";
    Coap_Options[Coap_Options["ACCEPT"] = 17] = "ACCEPT";
    Coap_Options[Coap_Options["LOCATION_QUERY"] = 20] = "LOCATION_QUERY";
    Coap_Options[Coap_Options["BLOCK_2"] = 23] = "BLOCK_2";
    Coap_Options[Coap_Options["BLOCK_1"] = 27] = "BLOCK_1";
    Coap_Options[Coap_Options["SIZE_2"] = 28] = "SIZE_2";
    Coap_Options[Coap_Options["PROXY_URI"] = 35] = "PROXY_URI";
    Coap_Options[Coap_Options["PROXY_SCHEME"] = 39] = "PROXY_SCHEME";
    Coap_Options[Coap_Options["SIZE_1"] = 60] = "SIZE_1";
    Coap_Options[Coap_Options["ENDPOINT_ID_1"] = 124] = "ENDPOINT_ID_1";
    Coap_Options[Coap_Options["ENDPOINT_ID_2"] = 189] = "ENDPOINT_ID_2";
    Coap_Options[Coap_Options["COIOT_DEVID"] = 3332] = "COIOT_DEVID";
    Coap_Options[Coap_Options["COIOT_STATUS_VALIDITY"] = 3412] = "COIOT_STATUS_VALIDITY";
    Coap_Options[Coap_Options["COIOT_STATUS_SERIAL"] = 3420] = "COIOT_STATUS_SERIAL";
})(Coap_Options = exports.Coap_Options || (exports.Coap_Options = {}));
;
