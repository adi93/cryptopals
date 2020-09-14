// challenge 51 
const zlib = require('zlib'); 
const crypto = require('crypto')

class CTR {
    constructor() {
        this.nonce = [123, 12, 174, 38, 48, 229, 45, 93]
        this.blockSize = 16
    }
    encrypt(plaintText, key) {
        let nonce = this.nonce
        let cipherText = []
        let counter = 0
        let blockSize = this.blockSize
        for (let i=0; i<plaintText.length; i+=blockSize) {
            let keyStream = this.generateKeyStream(key, nonce, counter)
            counter += 1
            let encrypted = this.xor(keyStream, plaintText.slice(i, i+blockSize))
            cipherText = cipherText.concat(encrypted)
        }
        return cipherText
    }


    generateKeyStream(key, nonce, counter) {
        let ks = this.keyStream(counter, nonce)
        let cipher = crypto.createCipheriv('aes-128-ecb', key, null)
        let encrypted = cipher.update(Buffer.from(ks))
        return Array.from(encrypted)
    }


    xor(a, b) {
        let ans = []
        for (let i=0; i< b.length; i+= 1) {
            ans.push(a[i]^b[i])
        }
        return ans
    }

    keyStream(counter, nonce) {
        let bytesTaken = Math.ceil(counter.toString(2).length/8)
        let padding = Array(8-bytesTaken).fill(0)
        let ks = nonce.slice(0)
        ks.push(counter)
        ks = ks.concat(padding)
        return ks

    }

    decrypt(cipherText, key, nonce) {
        return this.encrypt(cipherText, key, nonce)
    }
}

function oracle(request) {
    let ctr = new CTR()
    function format_request(req) {
        let str = `
        ${req.method} ${req.URL} ${req.PROTOCOL}
        Host: ${req.host}
        Cookie: sessionid=${req.sessionId}
        Content-Length: (${req.mesg.length})
        ${req.mesg}
        `
        return str
    }

    function compress(request) {
        return zlib.gzipSync(request)
    }

    function encrypt(plainText) {
        function randomKey() {
            let buff =  crypto.randomBytes(16);
            return buff.toString('ascii');
        }
        let algorithm = 'aes-128-cbc'
        let key = randomKey()
        return ctr.encrypt(plainText, key)
    }
    let len = encrypt(compress(format_request(request))).length
    return len
}


let request = {
    URL: "/",
    method: "POST",
    PROTOCOL: "HTTP/1.1",
    host: "hapless.com",
    sessionId: "TmV2ZXIgcmV2ZWFsIHRoZSBXdS1UYW5nIFNlY3JldCE=",
    mesg: "sessionid="
}

console.log(oracle(request))
let asciiChars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

let currentLength = oracle(request)
let mesg = "sessionid=Tm"
let minLength = 100000
let correctChar = '';

origMesg = mesg
while(true) {
    minLength = 10000
    asciiChars.forEach(ch => {
        mesg = origMesg + ch;
        request.mesg = mesg;
        let length = oracle(request)
        // console.log(mesg, length)
        if (minLength >= length) {
            minLength = length;
            correctChar = ch
        }
    })
    origMesg = origMesg + correctChar
    console.log(origMesg)
    request.mesg = origMesg
    if (oracle(request) < currentLength) {
        console.log(origMesg)
        break;
    }
}