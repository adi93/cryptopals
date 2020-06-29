// challenge 5
"use strict";
const input = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"
function repeating_xor(input, key) {
    let ans = [];
    let key_len = key.length;
    for (let i = 0; i < input.length; i++) {
        ans.push(input[i] ^ key[i % key_len]);
    }
    return ans
}
const key = "ICE"
const result = "0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f"
var xored = repeating_xor(Buffer.from(input), Buffer.from(key))
console.assert(Buffer.from(xored).toString() == Buffer.from(result, 'hex')) 
let a = Buffer.from(xored).toString()
a