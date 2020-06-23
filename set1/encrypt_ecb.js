const crypto = require('crypto')
const fs = require("fs")
var data = fs.readFileSync('./set1/7.txt',
    { flag: 'r', encoding: 'utf8' })
let buff = Buffer.from(data, 'base64')

const key = "YELLOW SUBMARINE"
var decipher = crypto.createDecipheriv('aes-128-ecb', key, null)
var decrypted = decipher.update(buff, 'base64', 'utf8')
decrypted += decipher.final('utf-8')

console.log(decrypted)