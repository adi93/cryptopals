// challenge 8
"use strict";
// The only way is if two sixteen bytes are same
function detect_ecb(buff) {
    let block_size = 16
    let m = new Set()
    for (let i=0; i<buff.length; i+= block_size) {
        let block = buff.slice(i, i+block_size).toString()
        if (m.has(block)) {
           return true
        } 
        m.add(block)
        
    }
    return false;
}

let fs = require("fs")
let readline = require("readline")
let rd = readline.createInterface({
    input: fs.createReadStream('./set1/8.txt')
});
let answers = []
let line_number = 1
rd.on('line', function (line) {
    let l = Buffer.from(line, 'hex')
    let decrypted = detect_ecb(l)
    if (decrypted) {
        answers.push(line_number)
        return
    }
    line_number += 1;
})
rd.on('close', function () {
    let ans = answers[0]
    console.log("Line:", ans, "(line_number starts from 1)")
})