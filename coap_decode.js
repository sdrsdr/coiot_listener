"use strict";
/*
 * coap_decode.ts; coap_decode.js
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
const strmbuf_1 = require("./strmbuf");
const coapcodes_1 = require("./coapcodes");
const PROTOCOL_VERSION = 1;
const MAX_TOKEN_LENGTH = 8;
function coap_decode(rawbuffer, rinfo) {
    let buffer = new strmbuf_1.Strmbuf(rawbuffer);
    //Decode the Message Header which must have a length of exactly 4 bytes
    //Decode the header values
    let encodedHeader = buffer.readInt(4);
    if (encodedHeader == undefined) {
        throw new Error("Encoded CoAP messages MUST have min. 4 bytes. This has " + buffer.l + "!");
    }
    let version = (encodedHeader >>> 30) & 0x03;
    let messageType = (encodedHeader >>> 28) & 0x03;
    let tokenLength = (encodedHeader >>> 24) & 0x0F;
    let messageCode = (encodedHeader >>> 16) & 0x0FF;
    let messageID = (encodedHeader) & 0x0FFFF;
    //console.logebug("Decoded Header: (T) {}, (TKL) {}, (C) {}, (ID) {}", new Object[]{messageType, tokenLength, messageCode, messageID});
    //Check whether the protocol version is supported (=1)
    if (version != PROTOCOL_VERSION) {
        throw new Error("CoAP version (" + version + ") is other than " + PROTOCOL_VERSION + "!");
    }
    //Check whether TKL indicates a not allowed token length
    if (tokenLength > MAX_TOKEN_LENGTH) {
        throw new Error("TOKEN LENGTH value (" + tokenLength + ") is larger than " + MAX_TOKEN_LENGTH + "!");
    }
    //Check whether there are enough unread bytes left to read the token
    if (buffer.avb < tokenLength) {
        throw new Error("TKL value is " + tokenLength + " but only " + buffer.avb + " bytes left!");
    }
    //Read the token
    let token = undefined;
    if (tokenLength > 0)
        token = buffer.readBuf(tokenLength);
    //Handle empty message (ignore everything but the first 4 bytes)
    if (messageCode == coapcodes_1.Coap_Codes.EMPTY) {
        let msg = {
            rinfo,
            messageType: messageType,
            messageCode: coapcodes_1.Coap_Codes.EMPTY,
            messageID,
            tok: token,
            opt: undefined, pl: undefined,
        };
        return msg;
    }
    //Handle non-empty messages (CON, NON or ACK)
    let msg = {
        rinfo,
        messageType: messageType,
        messageCode: messageCode,
        messageID, tok: token,
        opt: undefined,
        pl: undefined
    };
    if (coapcodes_1.isKnownMessageCode(msg.messageCode) == undefined) {
        return msg;
    }
    try {
        //Decode and set the options
        if (buffer.avb > 0)
            setOptions(msg, buffer);
    }
    catch (e) {
        return msg;
    }
    if (buffer.avb > 0) {
        msg.pl = buffer.readBuf(buffer.avb);
    }
    if (msg.messageType != coapcodes_1.Coap_MTypes.RST) {
        expand_common(msg);
    }
    return msg;
}
exports.coap_decode = coap_decode;
function opt_as_be_int(opt) {
    if (opt.val.length > 4)
        return undefined;
    let res = 0;
    for (let i = 0; i < opt.val.length; i++)
        res = (res << 8) | (opt.val[i] & 0x0FF);
    return res;
}
function opt_as_le_int(opt) {
    if (opt.val.length > 4)
        return undefined;
    let res = 0;
    for (let i = opt.val.length - 1; i >= 0; i--)
        res = (res << 8) | (opt.val[i] & 0x0FF);
    return res;
}
function setOptions(msg, buffer) {
    //Decode the options
    let previousOptionNumber = 0;
    let firstByte = buffer.readByte();
    if (firstByte == undefined)
        return;
    while (firstByte != 0xFF && buffer.avb >= 0) {
        //console.log("OPTS: new option starts at "+buffer.p);
        let optionDelta = (firstByte & 0x0F0) >>> 4;
        let optionLength = firstByte & 0x0F;
        //console.log("OPTS:temp. delta:"+optionDelta+", temp. length:"+optionLength);
        if (optionDelta == 13) {
            optionDelta += buffer.readByteOrThrow();
        }
        else if (optionDelta == 14) {
            optionDelta = 269 + ((buffer.readByteOrThrow()) << 8) + (buffer.readByteOrThrow());
        }
        if (optionLength == 13) {
            optionLength += buffer.readByteOrThrow();
        }
        else if (optionLength == 14) {
            optionLength = 269 + ((buffer.readByteOrThrow() & 0x0FF) << 8) + (buffer.readByteOrThrow() & 0x0FF);
        }
        //console.log("OPTS:Previous option:"+ previousOptionNumber+" Option delta:"+optionDelta);
        let actualOptionNumber = previousOptionNumber + optionDelta;
        //console.log("OPTS: option no "+actualOptionNumber+": value with len "+optionLength+" at "+buffer.p);
        let optionValue = buffer.readBufOrThrow(optionLength);
        //console.log("OPTS: option value loaded! pos now "+buffer.p);
        if (msg.opt == undefined)
            msg.opt = new Array();
        msg.opt.push({ num: actualOptionNumber, val: optionValue });
        previousOptionNumber = actualOptionNumber;
        if (buffer.avb > 0) {
            firstByte = buffer.readByteOrThrow();
        }
        else {
            // this is necessary if there is no payload and the last option is empty (e.g. UintOption with value 0)
            firstByte = 0xFF;
        }
        //console.log("OPTS:"+buffer.avb+" readable bytes remaining.");
    }
}
function expand_common(msg) {
    if (msg.opt)
        for (let opt of msg.opt) {
            if (opt.num == coapcodes_1.Coap_Options.URI_PATH) {
                if (!msg.uri_path)
                    msg.uri_path = '/' + opt.val.toString('utf8');
                else
                    msg.uri_path = msg.uri_path + '/' + opt.val.toString('utf8');
            }
            else if (opt.num == coapcodes_1.Coap_Options.COIOT_DEVID) {
                msg.coiot_devidrev = opt.val.toString('utf8');
                let dp = msg.coiot_devidrev.split('#');
                msg.coiot_dev = dp[0];
                msg.coiot_id = dp[1];
                msg.coiot_rev = dp[2];
            }
            else if (opt.num == coapcodes_1.Coap_Options.COIOT_STATUS_SERIAL) {
                msg.coiot_stat_serial = 0;
                let sh = 0;
                for (let b of opt.val) {
                    msg.coiot_stat_serial |= ((b & 0x0ff) << sh);
                    sh += 8;
                }
            }
        }
}
