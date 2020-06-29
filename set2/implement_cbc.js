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
    assert(buff.length % 8 == 0, "Buffer length should be a buffer of 8")
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
console.log(Buffer.from(decrypted).toString())