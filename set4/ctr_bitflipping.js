// challenge 25

// challenge 18
const blockSize = 16
crypto = require("crypto")
class oracle {
    constructor(key, nonce) {
        this.key = key
        this.nonce = nonce
    }

    encrypt_without_sanitize(plaintText) {
        let cipherText = []
        let counter = 0
        for (let i=0; i<plaintText.length; i+=blockSize) {
            let keyStream = this.generateKeyStream(counter)
            counter += 1
            let encrypted = this.xor(keyStream, plaintText.slice(i, i+blockSize))
            cipherText = cipherText.concat(encrypted)
        }
        return cipherText
    }

    encrypt(plaintText) {
        const prefix = "comment1=cooking%20MCs;userdata="
        const suffix = ";comment2=%20like%20a%20pound%20of%20bacon"
        
        plaintText = this.convert(prefix + this.santize(plaintText) + suffix)
        this.encrypt_without_sanitize(plaintText)
    }

    santize(str) {
        return str.replace(';', '\x01').replace('=', '\x02')
    }

    generateKeyStream(counter) {
        let ks = this.keyStream(counter)
        let cipher = crypto.createCipheriv('aes-128-ecb', this.key, null)
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

    keyStream(counter) {
        let bytesTaken = Math.ceil(counter.toString(2).length/8)
        let padding = Array(8-bytesTaken).fill(0)
        let ks = this.nonce.slice(0)
        ks.push(counter)
        ks = ks.concat(padding)
        return ks
    }

    isAdmin(cipherText) {
        decrypted = this.decrypt(cipherText)
        return decrypted.includes(";admin=true;")
    }

    decrypt(cipherText) {
        return this.encrypt_without_sanitize(cipherText).map(c => String.fromCharCode(c)).join('')
    }
}

let key = "RandomKeeeeeeeey"
let nonce = [12,45,2,23,68,115,207,168]
oracle = new oracle(key, nonce)

let supplied = '1234123412341234'
let desired = ';admin=true;2345'
console.log(desired.length)

let a = oracle.encrypt(supplied)
target_block = a.slice(16,32)

// create attack block
let new_block = []
for (let i=0; i< 16; i++) {
    new_block.push(supplied.charCodeAt(i) ^ desired.charCodeAt(i) ^ target_block[i])
}

// replace it with original block
for (let i=0; i<16; i++) {
    a[i+16] = new_block[i]
}


