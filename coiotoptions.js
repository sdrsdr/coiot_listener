'use strict';
var coiotopts = {
    COIOT_MC_PUBLISH: 30,
    COIOT_OPTION_BASE: 3332,
    COIOT_DEVID: 3332,
    COIOT_STATUS_VALIDITY: 3412,
    COIOT_STATUS_SERIAL: 3420,
    map: new Map()
};
coiotopts.map.set(coiotopts.COIOT_DEVID, "COIOT DEVID (" + coiotopts.COIOT_DEVID + ")");
coiotopts.map.set(coiotopts.COIOT_STATUS_VALIDITY, "COIOT STATUS VALIDITY (" + coiotopts.COIOT_STATUS_VALIDITY + ")");
coiotopts.map.set(coiotopts.COIOT_STATUS_SERIAL, "COIOT  STATUS SERIAL (" + coiotopts.COIOT_STATUS_SERIAL + ")");
coiotopts.optionNumber2optn = function (opt) {
    if (opt < coiotopts.COIOT_OPTION_BASE)
        return -1;
    if (opt % 8 != 4)
        return -1;
    return (opt - coiotopts.COIOT_OPTION_BASE) / 8;
};
coiotopts.asString = function (opt) {
    let result = coiotopts.map.get(opt);
    if (result == undefined) {
        if (opt >= coiotopts.COIOT_OPTION_BASE) {
            let optn = coiotopts.coiot_optionNumber2optn(opt);
            if (optn == -1)
                return "UNKOWN (" + opt + ")";
            return "COIOT_OPTN_" + optn + " (" + opt + ")";
        }
        else
            return "UNKOWN (" + opt + ")";
    }
    return result;
};
module.exports = coiotopts;
