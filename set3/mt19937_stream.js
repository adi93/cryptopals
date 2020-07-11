// challenge 24
// challenge 21
"use strict";


const w = 32
const n = 624n
const m = 397n
const r = 31
const a = 0x9908B0DFn
const u = 11n
const d = 0xFFFFFFFFn
const s = 7n
const b = 0x9D2C5680n
const t = 15n
const c = 0xEFC60000n
const l = 18n
const f = 1812433253n

let MT = Array(n)
let index = n - 1n
const lowerMask = BigInt((1 << r)) - 1n
const upperMask = lowestBits(~lowerMask, w)

function seed_mt(seed) {
    index = n
    MT[0] = BigInt(seed)
    for (let i = 1; i < n; i += 1) { // loop over each element
        MT[i] = lowestBits(f * (MT[i - 1] ^ (MT[i - 1] >> BigInt(w - 2))) + BigInt(i), w)
    }
}
function lowestBits(num, bitCount) {
    let n = 1n
    for (let i = 1; i < bitCount; i += 1) {
        n = n * 2n + 1n
    }
    return num & n
}
function extract_number() {
    if (index >= n) {
        if (index > n) {
            throw "Generator was never seeded"
        }
        twist()
    }
    let y = MT[index]
    y = y ^ ((y >> u) & d)
    y = y ^ ((y << s) & b)
    y = y ^ ((y << t) & c)
    y = y ^ (y >> l)

    index += 1n
    return lowestBits(y, w)
}
function twist() {
    for (let i = 0; i < n; i += 1) {
        let x = (MT[i] & upperMask) + (MT[BigInt(i + 1) % n] & lowerMask)
        let xA = x >> 1n
        if ((x % 2n) != 0n) { // lowest bit of x is 1
            xA = xA ^ a
        }
        MT[i] = MT[(BigInt(i) + m) % n] ^ xA
    }
    index = 0n
}


function encrypt(plaintText, key) {
    seed_mt(key);
    let cipherText = Array(plaintText.length)
    for (let i=0; i<plaintText.length; i+=1) {
        let num = Number(extract_number()>>24n);
        cipherText[i] = num ^ plaintText.charCodeAt(i)
    }
    return cipherText.map(ch => String.fromCharCode(ch)).join('')
}

function decrypt(cipherText, key) {
    seed_mt(key);
    let plainText = Array(cipherText.length)
    for (let i=0; i<cipherText.length; i+=1) {
        let num = Number(extract_number()>>24n);
        plainText[i] = num ^ cipherText.charCodeAt(i)
    }
    return plainText.map(ch => String.fromCharCode(ch)).join('')
}

let randomBytes = 'qbuiv4p 2v1vo71o8'

let text = randomBytes + 'AAAAAAAAAAAAA'
let key = 1234
let cipherText = encrypt(text, key)
console.log(cipherText)
console.log(decrypt(cipherText, 1234))

function attack(ciphertext) {
    for (let i=0; i<65535; i+=1) {
        let decrypted = decrypt(cipherText, i)
        if (decrypted.endsWith('AAAAAAAAAAAAA')) {
            console.log("Key:",i,"Plain Text:", decrypted)
            return i
        }
    }
    console.log("Could not break cipher text")
    return -1
}

attack(cipherText)