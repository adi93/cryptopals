// Challenge 10
"use strict";
const crypto = require('crypto')
const fs = require("fs")
const { assert } = require('console')
var data = fs.readFileSync('./set2/10.txt',
    { flag: 'r', encoding: 'utf8' })
let buff = Buffer.from(data, 'base64')

const key = "YELLOW SUBMARINE"
function decrypt_cbc(buff, key, iv) {
    assert(buff.length % 16 == 0, "Buffer length should be a buffer of 16")
    let block_size = key.length
    let prev_xor = iv;
    let decrypted_buff = []
    let decipher = crypto.createDecipheriv('aes-128-ecb', key, null)
    decipher.setAutoPadding(false);
    for (let i=0; i<buff.length; i+=block_size) {
        let current_block = buff.slice(i, i+block_size)
        let decrypted = decipher.update(current_block)
        let xored = xor(prev_xor, decrypted)
        for (let j=0; j<xored.length; j+=1) {
            decrypted_buff.push(xored[j])
        }
        prev_xor = current_block
    }
    return decrypted_buff
}

function xor(buf1, str) {
    let ans = []
    for (let i=0; i<buf1.length; i++) {
        ans.push(buf1[i] ^ str[i])
    }
    return ans
}
let iv = "\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
let decrypted = decrypt_cbc(buff, key, iv)

const blockSize = 16
class oracle {
    constructor() {
        this.nonce = [123, 12, 174, 38, 48, 229, 45, 93]
    }
    encrypt(plaintText, key, nonce) {
        nonce = nonce || this.nonce
        let cipherText = []
        let counter = 0
        for (let i=0; i<plaintText.length; i+=blockSize) {
            let encryptedKeystream = this.generateEncryptedKeystream(key, nonce, counter)
            counter += 1
            let encrypted = this.xor(encryptedKeystream, plaintText.slice(i, i+blockSize))
            cipherText = cipherText.concat(encrypted)
        }
        return cipherText
    }


    generateEncryptedKeystream(key, nonce, counter) {
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

    edit(cipherText, offset, newText) {
        this.nonce
    }
}