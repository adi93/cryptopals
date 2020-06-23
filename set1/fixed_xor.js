const { assert } = require("console")

const hex_input = "1c0111001f010100061a024b53535009181c"
const hex_xor_key = "686974207468652062756c6c277320657965"

/**
 * XOR two arrays together
 * @param {Array.<number>} buf1 Array of bytes
 * @param {Array.<number>} key Array/Buffer of bytes for key
 */
function xor(buf1, key) {
    assert(buf1.length == key.length, "Buffers must have same length")
    ans = [];
    for (var i=0; i< buf1.length; i++) {
        ans.push(buf1[i] ^ key[i])
    }
    return Buffer.from(ans).toString()
}

input = Buffer.from(hex_input, 'hex')
xor_key = Buffer.from(hex_xor_key, 'hex')
assert(xor(input, xor_key) == Buffer.from("746865206b696420646f6e277420706c6179", 'hex').toString())