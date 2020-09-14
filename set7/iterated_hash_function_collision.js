// challenge 52
function MD(M, H, pad=false) {
    crypto = require("crypto")
    function padBlock(input) {
        let block = Array.from(Buffer.from(input))
        if (block.length % blockSize == 0) return block
        let remainder = block.length - blockSize
        if (remainder <= 0) {
            remainder = -remainder
        } else {
            remainder = blockSize - remainder % blockSize
        }
        let padding_char = remainder;
        for (let i = 0; i < remainder; i++) {
            block.push(padding_char)
        }
        return block
    }
    function encrypt(plaintText, key) {
        key
        let cipher = crypto.createCipheriv('aes-128-ecb', key, null)
        cipher.setAutoPadding(false);
        let encrypted = cipher.update(Buffer.from(plaintText))
        encrypted += cipher.final()
        return encrypted
    }
    H = padBlock(H)
    if (pad) {
        M = padBlock(M) 
    }
    console.log(M)
    for (let i=0; i<M.length; i = i+blockSize) {
        let block = M.slice(i,i+blockSize)
        H = encrypt(block, Buffer.from(H))
    }
    let res =  Buffer.from(H, 'utf-8').slice(0,2)
    return res
}

const bigint = require("big-integer")
const blockSize = 16

function convertBytes(n) {
    let str = n.toString('2')
    let remainder = str.length % 8 == 0 ? 0: 8 - (str.length%8)
    str = Array(remainder).fill(0).join('') + str
    let byteArray = Array(str.length/8)
    for (let index = 0; index < str.length/8; index++) {
        byteArray[index] = parseInt(str.substring(index*8, index*8 + 8), 2)
    }
    let extraZeroCount = blockSize - byteArray.length
    return Array(extraZeroCount).fill(0).concat(byteArray) 
}

console.log(MD(convertBytes(3), [0,0]))

function findCollisions(hashFn, iv, length) {
    // birthday paradox attack
    let hashes = {}
    for (let i=0; i < 2**length; i+=1) {
        let paddedI = convertBytes(i)
        let hash = hashFn(paddedI, iv)
        if (hash in hashes) {

            console.log("Collision found", hash, i, hashes[hash])
            return (hash, i, hashes[hash])
        } else {
            hashes[hash] = i
        }
    }
    return (null, null, null)
}

let hashFn = MD
findCollisions(hashFn, Array(blockSize).fill(0), 16)