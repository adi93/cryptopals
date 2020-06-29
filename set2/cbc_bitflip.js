// challenge 16
crypto = require("crypto")
const iv = "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
class oracle {
    constructor(key) {
        this.key = key
    }
    encrypt_aes = function encrypt_aes(str) {
        const prefix = "comment1=cooking%20MCs;userdata="
        const suffix = ";comment2=%20like%20a%20pound%20of%20bacon"
        
        str = this.convert(prefix + this.santize(str) + suffix)
        let known_buff = Buffer.from(this.pad_block(str, 16))
        let c = known_buff.length
        let cipher = crypto.createCipheriv('aes-128-cbc', this.key, iv)
        cipher.setAutoPadding(false)
        let encrypted = cipher.update(known_buff)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        
        let x = Array.from(encrypted)
        return x
    }
    pad_block = function pad_block(block, block_length) {
        let remainder = block.length - block_length
        if (remainder <= 0) {
            remainder = -remainder
        } else {
            remainder = block_length - remainder % block_length
        }
        let padding_char = remainder;
        for (var i=0; i< remainder; i++) {
            block.push(padding_char)
        }
        return block
    }
    
    convert = function convert(str) {
        return str.split('').map(ch => ch.charCodeAt(0))
    }
    
    santize(str) {
        return str.replace(';', '\x01').replace('=', '\x02')
    }
    
    decrypt_aes(encrypted) {
        let cipher = crypto.createDecipheriv('aes-128-cbc', this.key, iv)
        cipher.setAutoPadding(false)
        let decrypted = cipher.update(encrypted)
        decrypted = Buffer.concat([decrypted, cipher.final()])
        
       return decrypted
    
    }

    isAdmin(encrypted) {
        let decrypted = this.decrypt_aes(encrypted)
        return decrypted.toString().includes(";admin=true;")
    }
    
}

let key = "RandomKeeeeeeeey"
oracle = new oracle(key)

let supplied = '1234123412341234'
let desired = ';admin=true;2345'
console.log(desired.length)

let a = oracle.encrypt_aes(supplied, key)
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

b = oracle.isAdmin(Buffer.from(a))
b
