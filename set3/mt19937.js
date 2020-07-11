// challenge 21
"use strict";


function mt19937() {

    const w = 32n;
    const r = 31;
    const n = 624n;
    const m = 397n;
    const a = 0x9908B0DFn;
    const u = 11n;
    const d = 0xFFFFFFFFn;
    const s = 7n;
    const b = 0x9D2C5680n;
    const t = 15n;
    const c = 0xEFC60000n;
    const l = 18n;
    const f = 1812433253n;
    
    const lowerMask = BigInt((1 << r)) - 1n;
    const upperMask = ~lowerMask & (1n<<w - 1n)

    this.MT = Array(this.n);
    this.index = n - 1n;
    
    this.seed_mt = function(seed) {
        this.index = n
        this.MT[0] = BigInt(seed)
        for (let i = 1; i < n; i += 1) { // loop over each element
            this.MT[i] = (f * (this.MT[i - 1] ^ (this.MT[i - 1] >> BigInt(w - 2))) + BigInt(i)) & (1n<<w - 1n)
            console.log(this.MT[0])
        }
    }
   
    this.twist = function() {
        for (let i = 0; i < n; i += 1) {
            let x = (this.MT[i] & upperMask) + (this.MT[BigInt(i + 1) % n] & lowerMask)
            let xA = x >> 1n
            if ((x % 2n) != 0n) { // lowest bit of x is 1
                xA = xA ^ a
            }
            this.MT[i] = this.MT[(BigInt(i) + m) % n] ^ xA
        }
        this.index = 0n
    }

    this.extract_number = function() {
        if (this.index >= n) {
            if (this.index > n) {
                throw "Generator was never seeded"
            }
            this.twist()
        }
        let y = BigInt(this.MT[this.index])
        y = y ^ ((y >> u) & d)
        y = y ^ ((y << s) & b)
        y = y ^ ((y << t) & c)
        y = y ^ (y >> l)

        this.index += 1n
        return y & (1n<<w - 1n)
    }
    
}


let x = new mt19937()
x.seed_mt(1231)
