// challenge 29
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
    const secretKey = "YELLOW SUBMARINEY"

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

    const getPadding = function(len) {
        let ml = len*8
        padding = [128]
        padding = padding.concat(Array(paddingSize(len + 1)).fill(0)).concat([0, 0, 0, 0, (ml & 0xFF000000) >> 24, (ml & 0xFF0000) >> 16, (ml & 0xFF00) >> 8, ml & 0xFF])
        return padding
    }

    /**
     * 
     * @param {string} mesg message to be encrypted
     */
    const encrypt = function(mesg, hh, length) {
        let h0 = 0x67452301
        let h1 = 0xEFCDAB89
        let h2 = 0x98BADCFE
        let h3 = 0x10325476
        let h4 = 0xC3D2E1F0
        if (hh != undefined) {
            h0 = hh[0]
            h1 = hh[1]
            h2 = hh[2]
            h3 = hh[3]
            h4 = hh[4]
        }

        mesg = Array.from(mesg).map(ch => ch.charCodeAt(0))
        if (length == undefined) {
            mesg = mesg.concat(getPadding(mesg.length))
        } else {
            mesg = mesg.concat(getPadding(length))
        }

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

                let temp = mask(leftRotate(a,5) + f + e + k + words[i])
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
        encryptWithKey: function(mesg) {
            return encrypt(secretKey + mesg)
        },
        customEncrypt: function(mesg, hh, length) {
            return encrypt(mesg, hh, length)
        }
    }
}


function forgeNewMessage(message, newMessage) {
    let sha = createSHA1()
     const getH = function(hash) {
        // hash is a hex encoded string
        hash = hash.padStart(40, 0)
        return [hash.slice(0, 8), hash.slice(8, 16), hash.slice(16, 24), hash.slice(24, 32), hash.slice(32, 40)].map(c => parseInt(c, 16))
    }

    const getPadding = function(len) {
        let ml = len * 8
        padding = [128]
        padding = padding.concat(Array(paddingSize(len + 1)).fill(0)).concat([0, 0, 0, 0, (ml & 0xFF000000) >> 24, (ml & 0xFF0000) >> 16, (ml & 0xFF00) >> 8, ml & 0xFF])
        return padding
        function paddingSize(len) {
            // inefficient, but works only once per message, so it's fine
            for (let i = 0; i < 64; i += 1) {
                if ((i + 8 + len) % 64 == 0) {
                    return i
                }
            }
        }
    }

    for (let keyLength=1; keyLength<30; keyLength+=1) {

        let messageHashWithKey = sha.encryptWithKey(message).toString(16)
        let hh = getH(messageHashWithKey)
        let targetMessage = Array(keyLength).fill(0).map(c => String.fromCharCode(c)).join('') +
            message + getPadding(keyLength + message.length).map(c => String.fromCharCode(c)).join('')
        let targetMessageLen = (targetMessage.length + newMessage.length)
        let forgedMessageHash = sha.customEncrypt(newMessage, hh, targetMessageLen).toString(16)
        let actualHash = sha.encryptWithKey(targetMessage.slice(keyLength) + newMessage).toString(16)
        if (forgedMessageHash == actualHash) {
            console.log("Found key length: ", keyLength)
            return forgedMessageHash
        } 
    }
    return null

}
let message = "comment1=cooking%20MCs;userdata=foo;comment2=%20like%20a%20pound%20of%20bacon"
let newMesage = ";admin=true"

let a = forgeNewMessage(message, newMesage)
a