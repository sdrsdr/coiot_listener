/// <reference types="node" />
export declare class Strmbuf {
    buffer_: Buffer;
    b: Buffer;
    p: number;
    l: number;
    avb: number;
    constructor(buffer_: Buffer, ofs_?: number, len_?: number);
    readInt(sz: number): number | undefined;
    readByte(): number | undefined;
    readByteOrThrow(): number;
    readBuf(sz: number): Buffer | undefined;
    readBufOrThrow(sz: number): Buffer;
}
