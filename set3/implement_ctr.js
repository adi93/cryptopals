// challenge 18
const blockSize = 16
crypto = require("crypto")
class oracle {
    constructor() {
    }
    encrypt(plaintText, key, nonce) {
        let cipherText = []
        let counter = 0
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

o = new oracle()

const nonce = Array(8).fill(0)
const key = "YELLOW SUBMARINE"
console.log(o.keyStream(1, nonce))
const input = "L77na/nrFsKvynd6HzOoG7GHTLXsTVu9qvY/2syLXzhPweyyMTJULu/6/kXX0KSvoOLSFQ=="
let d = Buffer.from(input, "base64")
d
let b = o.encrypt(d, key, nonce )
console.log(Buffer.from(b).toString())
