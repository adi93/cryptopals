// challenge 22
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


function routine(seconds) {
    seconds = seconds || Math.floor(Math.random()*960) + 40
    let timestamp = parseInt(Date.now() / 1000) + (seconds)
    seed_mt(timestamp)
    return extract_number()
}



let curentTime = parseInt(Date.now() / 1000)
let randomNumber = routine()
for (let i=1; i<1000; i+=1) {
    if (i%100 == 0) {
        console.log("i:", i)
    }
    seed_mt(i + curentTime)
    let num = extract_number()
    if (num == randomNumber) {
        console.log("Seed was ", i + curentTime)
        break;
    }
}