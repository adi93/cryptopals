// Challenege 9
"use strict";
function pad_block(input, block_length) {
    let block = Array.from(Buffer.from(input))
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
    return Buffer.from(block).toString()
}

let input = "ICE ICE BABY"
let padded_input = pad_block(input, 16)
padded_input
console.assert(padded_input == "ICE ICE BABY\x04\x04\x04\x04")