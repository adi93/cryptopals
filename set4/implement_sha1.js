// challenge 28

function createSHA1() {
    if (!new.target) {
        return new createSHA1()
    }
    
    this.uint32 = require('uint32');

    this.leftRotate = function leftRotate(n, d) {
        return this.uint32.rotateLeft(n, d);
    }


    this.mask = function(value) {
        return value >>> 0
    }

    this.paddingSize = function(len) {
        for (let i=0; i<64; i+=1) {
            if ((i+8+len)%64 == 0) {
                return i
            }
        }
    }

    this.encrypt = function encrypt(mesg) {
        let h0 = this.uint32.toUint32(0x67452301)
        let h1 = this.uint32.toUint32(0xEFCDAB89)
        let h2 = this.uint32.toUint32(0x98BADCFE)
        let h3 = this.uint32.toUint32(0x10325476)
        let h4 = this.uint32.toUint32(0xC3D2E1F0)

        let len = mesg.length

        mesg = Array.from(mesg).map(ch => ch.charCodeAt(0))
        mesg.push(128)
        mesg = mesg.concat(Array(this.paddingSize(len+1)).fill(0))
        let ml = len*8
        mesg = mesg.concat([0,0,0,0,(ml&0xFF000000)>>24, (ml&0xFF0000)>>16, (ml&0xFF00)>>8, ml&0xFF])

        for (let k=0; k<mesg.length; k+=64) {
            let chunk = mesg.slice(k, k+64)
            let words = Array(80)
            for (let j=0; j<64; j+=4) {
                let word = this.uint32.fromBytesBigEndian(chunk[j], chunk[j+1], chunk[j+2], chunk[j+3])
                words[j/4] = word
            }

            for (let j=16; j<=79; j+=1 ) {
                words[j] = this.leftRotate(words[j-3] ^ words[j-8] ^ words[j-14] ^ words[j-16], 1)
            }

            let a = this.uint32.toUint32(h0)
            let b = this.uint32.toUint32(h1)
            let c = this.uint32.toUint32(h2)
            let d = this.uint32.toUint32(h3)
            let e = this.uint32.toUint32(h4)
            
          
            for (let i=0; i<80; i+=1) {
                let k = this.uint32.toUint32(0)
                let f = this.uint32.toUint32(0)
    
                if (i >= 0 && i <= 19) {
                    f = this.uint32.toUint32((b & c) | (~b & d))
                    k = 0x5A827999
                } else if (i >= 20 && i <= 39) {
                    f = this.uint32.toUint32(b ^ c ^ d)
                    k = 0x6ED9EBA1
                } else if (i >= 40 && i <= 59) {
                    f = this.uint32.toUint32((b & c) | (b & d) | (c & d))
                    k = 0x8F1BBCDC
                } else {
                    f = this.uint32.toUint32(b ^ c ^ d)
                    k = 0xCA62C1D6
                }

                temp = this.mask(this.leftRotate(a,5) + f + e + k + words[i])
                e = d
                d = c
                c = this.mask(this.leftRotate(b, 30))
                b = a
                a = temp
            }

            h0 = this.mask(h0 + a)
            h1 = this.mask(h1 + b)
            h2 = this.mask(h2 + c)
            h3 = this.mask(h3 + d)
            h4 = this.mask(h4 + e)
        }
        return (BigInt(h0) << 128n) | (BigInt(h1) << 96n) | (BigInt(h2) << 64n) | (BigInt(h3) << 32n) | BigInt(h4)
    }
}

let s = new createSHA1()
console.log(s.encrypt(sampleText))



let sha = require("crypto").createHash("sha1")
sha.update(sampleText)
let libsha = sha.digest("hex")
console.log(libsha)