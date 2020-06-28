// Challenege 9
function pad_block(block, block_length) {
    remainder = block_length - block.length
    if (remainder <= 0) {
        return
    }
    let padding_char = remainder;
    for (var i=0; i< remainder; i++) {
        block.push(padding_char)
    }
    return block
}
