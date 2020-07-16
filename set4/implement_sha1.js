// challenge 28
// whole problem with this challenge was that js does not have unsigned int
// and its ints are represented in 54 bits (max int is 2**53 - 1, and min is -(2**53-1))
function createSHA1() {

    /**
     * 
     * @param {number} n 32 bit number
     * @param {number} d bit rotation
     */
    const leftRotate = function leftRotate(n, d) {
        return (((n << d) >>> 0) | (n >>> (32 - d))) >>> 0;
    }
    const secretKey = "YELLOW SUBMARINE"

    const mask = function (value) {
        return value >>> 0
    }

    const paddingSize = function(len) {
        // inefficient, but works only once per message, so it's fine
        for (let i=0; i<64; i+=1) {
            if ((i+8+len)%64 == 0) {
                return i
            }
        }
    }

    /**
     * 
     * @param {string} mesg message to be encrypted
     */
    const encrypt = function(mesg) {
        let h0 = 0x67452301
        let h1 = 0xEFCDAB89
        let h2 = 0x98BADCFE
        let h3 = 0x10325476
        let h4 = 0xC3D2E1F0

        let len = mesg.length

        mesg = Array.from(mesg).map(ch => ch.charCodeAt(0))
        mesg.push(128) // meant to add 1 bit, but 
        mesg = mesg.concat(Array(paddingSize(len+1)).fill(0))
        let ml = len*8
        mesg = mesg.concat([0,0,0,0,(ml&0xFF000000)>>24, (ml&0xFF0000)>>16, (ml&0xFF00)>>8, ml&0xFF])

        for (let k=0; k<mesg.length; k+=64) {
            let chunk = mesg.slice(k, k+64)
            let words = Array(80)

            // initialize words array
            for (let j=0; j<64; j+=4) {
                words[j/4] = ((chunk[j] << 24) | (chunk[j+1] << 16) | (chunk[j+2] << 8) | chunk[j+3]) >>> 0
            }

            for (let j=16; j<=79; j+=1 ) {
                words[j] = leftRotate(words[j-3] ^ words[j-8] ^ words[j-14] ^ words[j-16], 1)
            }

            let a = h0
            let b = h1
            let c = h2
            let d = h3
            let e = h4
            
          
            for (let i=0; i<80; i+=1) {
                let k = 0
                let f = 0
    
                if (i >= 0 && i <= 19) {
                    f = (b & c) | (~b & d)
                    k = 0x5A827999
                } else if (i >= 20 && i <= 39) {
                    f = b ^ c ^ d
                    k = 0x6ED9EBA1
                } else if (i >= 40 && i <= 59) {
                    f = (b & c) | (b & d) | (c & d)
                    k = 0x8F1BBCDC
                } else {
                    f = b ^ c ^ d
                    k = 0xCA62C1D6
                }

                temp = mask(leftRotate(a,5) + f + e + k + words[i])
                e = d
                d = c
                c = mask(leftRotate(b, 30))
                b = a
                a = temp
            }

            h0 = mask(h0 + a)
            h1 = mask(h1 + b)
            h2 = mask(h2 + c)
            h3 = mask(h3 + d)
            h4 = mask(h4 + e)
        }
        return (BigInt(h0) << 128n) | (BigInt(h1) << 96n) | (BigInt(h2) << 64n) | (BigInt(h3) << 32n) | BigInt(h4)
    }
    return {
        encrypt: function(key, mesg) {
            if (mesg == undefined) {
                mesg = ''
            }
            return encrypt(key + mesg)
        },
        encryptWithKey: function(mesg) {
            return encrypt(secretKey + mesg)
        }
    }
}

let sha = createSHA1()
let sampleText = "YELLOW SUBMARINE"
console.log(s.encrypt(sampleText).toString(16))

let sha = require("crypto").createHash("sha1")
sha.update(sampleText)
let libsha = sha.digest("hex")
console.log(libsha)