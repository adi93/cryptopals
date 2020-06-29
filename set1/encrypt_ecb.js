// challenge 7
"use strict";

const crypto = require('crypto')
const fs = require("fs")

let data = fs.readFileSync('./set1/7.txt',
    { flag: 'r', encoding: 'utf8' })
let buff = Buffer.from(data, 'base64')

const key = "YELLOW SUBMARINE"
let decipher = crypto.createDecipheriv('aes-128-ecb', key, null)
decipher.setAutoPadding(false);
let decrypted = decipher.update(buff.slice(0,16))
decrypted += decipher.final()

console.log(decrypted)