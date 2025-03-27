export default class SeededRandom {
    x = 0;
    y = 0;
    z = 0;
    w = 0;

    constructor(seed: string = "") {
        for (let k = 0; k < seed.length + 64; k++) {
            this.x ^= (seed.charCodeAt(k) | 0);
            this.next();
        }
    }

    next(): number {
        const t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w ^= ((this.w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
        return this.w / 0x100000000;
    }
}