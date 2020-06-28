// Challenge 12
crypto = require("crypto")
function generate_random_bytes(size) {
    return crypto.randomBytes(size)
}
function createOracle(key, unknown_arr) {
    this.known_string = []
    for (let i=0; i<50; i++) {
        this.known_string.push(1)
    }
    this.block_size = 16
    this.encrypt_ecb = function(known) {
        known_buff = Buffer.from(this.pad_block(known, this.block_size))
        let cipher = crypto.createCipheriv('aes-128-ecb', key, null)
        encrypted = cipher.update(known_buff)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return Array.from(encrypted)
    }

    this.encrypt = function(known_arr) {
        let net_arr = known_arr.concat(unknown_arr)
        return this.encrypt_ecb(net_arr, key)
    }

    this.pad_block = function pad_block(block, block_length) {
        let remainder = block_length - block.length
        if (remainder <= 0) {
            return block
        }
        let padding_char = remainder;
        for (var i=0; i< remainder; i++) {
            block.push(padding_char)
        }
        return block
    }
}
o = new createOracle("RandomKey", "")
console.log(o.pad_block([1], 3))


function recover_next_byte(decoded, oracle) {
    // construct input
    // see the byte which we have to recover
    padding = oracle.known_string.slice(0, oracle.block_size - (decoded.length)%oracle.block_size - 1)
    target_block_num = Math.floor(decoded.length / oracle.block_size)
    let block_start = target_block_num*oracle.block_size
    let block_end =  (target_block_num+1)*oracle.block_size
    target_block = oracle.encrypt(padding).slice(block_start, block_end)
    for (let i=0; i < 256; i++) {
        try_block = padding.concat(decoded).concat(i)
        encrypted_block = oracle.encrypt_ecb(try_block).slice(block_start, block_end)
        if (compare_blocks(encrypted_block, target_block) == true) {
            return i
        }
    }
    function compare_blocks(block1, block2) {
        for (let j=0; j < oracle.block_size; j++) {
            if (block1[j] != block2[j]) {
                return false
            }
        }
        return true
    }
    return 0
}



function find_unknown_string(unknown_arr) {
    let decoded = []
    const key = generate_random_bytes(16)
    oracle = new createOracle(key, unknown_arr)
    for (let i = 0; i < unknown_arr.length; i++) {
        known_byte = recover_next_byte(decoded, oracle)
        decoded.push(known_byte)
    }
    return Buffer.from(decoded).toString()

}


const unknown_arr = Array.from(Buffer.from(`Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkg
aGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBq
dXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUg
YnkK`, 'base64'))

t = find_unknown_string(unknown_arr)
t