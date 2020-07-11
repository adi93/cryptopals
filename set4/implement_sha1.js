// challenge 28
function createSHA1() {
    if (!new.target) {
        return new createSHA1()
    }
    this.uint32 = require('uint32');

    this.leftRotate = function leftRotate(n, d) {
        return ((n << d) | (n >> (32 - d))) >>> 0
    }

    this.encrypt = function encrypt(mesg) {
        let h0 = 0x67452301
        let h1 = 0xEFCDAB89
        let h2 = 0x98BADCFE
        let h3 = 0x10325476
        let h4 = 0xC3D2E1F0

        let ml = mesg.length*8
        mesg = Array.from(mesg).map(ch => ch.charCodeAt(0))
        mesg.push(128)
        let desiredLength = Math.ceil(((ml/8)+9)/64)*64
        desiredLength
        console.log(mesg.length)

        console.log(desiredLength-8-(mesg.length%56))
        let temp = (desiredLength-8-(mesg.length%56))
        for (let i=0; i < temp; i+= 1) {
            mesg.push(0)
        }
        console.log(mesg.length)


        let bit64ml =  [0,0,0,0,(ml >> 24), ((ml <<8) >> 24 ), ((ml << 16) >> 24), ((ml << 24) >> 24)].map(ch => String.fromCharCode(ch)).join('')
        bit64ml
        mesg = Buffer.concat([Buffer.from(mesg), Buffer.from(bit64ml)])
        Uint16Array
        
        for (let k=0; k<mesg.length; k+=64) {
            let chunk = mesg.slice(k, k+64)
            let words = Array(80)
            for (let j=0; j<64; j+=4) {
                let word = this.uint.fromBytesBigEndian(chunk[j], chunk[j+1], chunk[j+2], chunk[j+3])
                words[j/4] = word
            }
            words

            for (let j=16; j<=79; j+=1 ) {
                words[j] = this.leftRotate(words[j-3] ^ words[j-8] ^ words[j-14] ^ words[j-16], 1)
            }

            let a = h0
            let b = h1
            let c = h2
            let d = h3
            let e = h4
            
          
            for (let i=0; i<80; i+=1) {
                let k = 0
                let f = 0
    
                if (i <= 19) {
                    f = (b & c) | (~b & d)
                    k = 0x5A827999
                } else if (i <= 39) {
                    f = b ^ c ^ d
                    k = 0x6ED9EBA1
                } else if (i <= 59) {
                    f = (b & c) | (b & d) | (c & d)
                    k = 0x8F1BBCDC
                } else {
                    f = b ^ c ^ d
                    k = 0xCA62C1D6
                }

                temp = this.leftRotate(a,5) + f + e + k + words[i]
                e = d
                d = c
                c = this.leftRotate(b, 30)
                b = a
                a = temp
            }

            h0 = h0 + a
            h1 = h1 + b
            h2 = h2 + c
            h3 = h3 + d
            h4 = h4 + e
        }
        h0
        h1
        h2
        h3
        h4
        
        return (BigInt(h0) << 128n) | (BigInt(h1) << 96n) | (BigInt(h2) << 64n) | (BigInt(h3) << 32n) | BigInt(h4)
    }
}

let s = new createSHA1()
console.log(s.encrypt("Hello World").toString(16))

let sha = require("crypto").createHash("sha1")
sha.update("Hello World")
console.log(sha.digest("Hello World", "hex"))