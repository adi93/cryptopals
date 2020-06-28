const crypto = require('crypto')
const fs = require("fs")
var data = fs.readFileSync('./set1/7.txt',
    { flag: 'r', encoding: 'utf8' })
let buff = Buffer.from(data, 'base64')

const key = "YELLOW SUBMARINE"
var decipher = crypto.createDecipheriv('aes-128-ecb', key, null)
decipher.setAutoPadding(false);
var decrypted = decipher.update(buff.slice(0,16))
decrypted += decipher.final()

console.log(decrypted)