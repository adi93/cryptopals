// Challenege 9
function pad_block(block, block_length) {
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