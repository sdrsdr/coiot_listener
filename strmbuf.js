"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Strmbuf {
    constructor(buffer_, ofs_, len_) {
        this.buffer_ = buffer_;
        if (ofs_ == undefined)
            ofs_ = 0;
        if (len_ == undefined)
            len_ = buffer_.length;
        this.b = buffer_;
        this.p = ofs_;
        this.l = len_;
        this.avb = len_;
    }
    readInt(sz) {
        if (sz == undefined)
            sz = 4;
        if (this.avb == 0)
            return undefined;
        let res = 0;
        while (sz) {
            res = (res << 8) | this.b[this.p];
            this.p++;
            this.avb--;
            if (this.avb == 0)
                break;
            sz--;
        }
        return res;
    }
    readByte() {
        if (this.avb == 0)
            return undefined;
        let res = this.b[this.p];
        this.p++;
        this.avb--;
        return res & 0x0FF;
    }
    readByteOrThrow() {
        if (this.avb == 0)
            throw new Error("Out of data?!");
        let res = this.b[this.p];
        this.p++;
        this.avb--;
        return res & 0x0FF;
    }
    readBuf(sz) {
        if (this.avb < sz)
            return undefined;
        let res = this.b.slice(this.p, this.p + sz);
        this.p += sz;
        this.avb -= sz;
        return res;
    }
    readBufOrThrow(sz) {
        if (this.avb < sz)
            throw new Error("Out of data?!");
        let res = this.b.slice(this.p, this.p + sz);
        this.p += sz;
        this.avb -= sz;
        return res;
    }
}
exports.Strmbuf = Strmbuf;
;
