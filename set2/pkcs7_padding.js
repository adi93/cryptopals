// Challenege 9
"use strict";
function padBlock(input, block_length) {
    let block = Array.from(Buffer.from(input))
    if (block.length % block_length == 0) return block
    let remainder = block.length - block_length
    if (remainder <= 0) {
        remainder = -remainder
    } else {
        remainder = block_length - remainder % block_length
    }
    let padding_char = remainder;
    for (let i = 0; i < remainder; i++) {
        block.push(padding_char)
    }
    return block
}

let input = "ICE ICE BABY"
let padded_input = pad_block(input, 16)
padded_input
console.assert(padded_input == "ICE ICE BABY\x04\x04\x04\x04")