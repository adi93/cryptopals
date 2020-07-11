// challenge 27
crypto = require("crypto")
class oracle {
    constructor(key) {
        this.key = key
        this.iv = key
    }
    encrypt_aes = function encrypt_aes(str) {
        let known_buff = Buffer.from(this.pad_block(str, 16))
        let c = known_buff.length
        let cipher = crypto.createCipheriv('aes-128-cbc', this.key, this.iv)
        cipher.setAutoPadding(false)
        let encrypted = cipher.update(known_buff)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        
        let x = Array.from(encrypted)
        return x
    }
    pad_block = function pad_block(block, block_length) {
        if (block.length % block_length == 0) return block
        let remainder = block.length - block_length
        if (remainder <= 0) {
            remainder = -remainder
        } else {
            remainder = block_length - remainder % block_length
        }
        let padding_char = remainder;
        for (let i=0; i< remainder; i++) {
            block.push(padding_char)
        }
        return block
    }
    
    convert = function convert(str) {
        return str.split('').map(ch => ch.charCodeAt(0))
    }
    
    decrypt_aes(encrypted) {
        encrypted = Buffer.from(encrypted)
        let cipher = crypto.createDecipheriv('aes-128-cbc', this.key, this.iv)
        cipher.setAutoPadding(false)
        let decrypted = cipher.update(encrypted)
        decrypted = Buffer.concat([decrypted, cipher.final()])
        
       return decrypted
    
    }
    
}

// If cipertext is C1, 0, C1, then
// P1 = E(C1, K) xor K
// P2 = E(C0, K) xor C1
// P3 = E(C1, K) xor 0 = E(C1, K)
// Therefore, P1 xor P3 = K. Wtf....

let plainText = "YELLOW SUBMARINE GREEN SUBMARINE BLACK SUBMARINE"
let o = new oracle("Random Keeeeeeey")

let encrypted = o.encrypt_aes(plainText)
encrypted = encrypted.slice(0,16).concat(Array(16).fill(0)).concat(encrypted.slice(0,16))

let decrypted = o.decrypt_aes(encrypted)

function xor(a1, a2) {
    let xored = Array(a1.length)
    for (let i=0; i < a1.length; i+=1) {
        xored[i] = a1[i] ^ a2[i]
    }
    return xored
}
let key = xor(decrypted.slice(0,16), decrypted.slice(32,48))
console.log(key.map(c => String.fromCharCode(c)).join(''))
