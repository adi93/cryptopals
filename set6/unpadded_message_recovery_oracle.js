// challenge 41
// Implement unpadded message recovery oracle
const bigint = require("big-integer")
const modInv = function (a, m) {
    const bigint = require("big-integer")
    a = bigint(a)
    m = bigint(m)
    let m0 = m
    let y = bigint(0)
    let x = bigint(1)

    if (m == 1) {
        return 0
    }

    while (a > 1) {
        let q = a.divide(m)
        let t = m

        m = a.mod(m)
        a = t
        t = y

        y = x.subtract(q.multiply(y))
        x = t


    }
    if (x < 0) {
        x = x.add(m0)
    }

    return x
}
const rsa = async function () {
    const bigintCrypt = require("bigint-crypto-utils")
    const bigint = require("big-integer")
    let n;
    let d;
    let e;
    while (true) {
        // let p = bigint('1923283877082641291337713561253460612525090074002637673599656632465417691723000680742021849')
        // let q = bigint('1502165393276042203596602011337368874962930966434296757367642270485204256194914564468409041')
        let p = bigint(await bigintCrypt.prime(512, 16))
        let q = bigint(await bigintCrypt.prime(512, 16))
        n = p.multiply(q)

        let et = p.subtract(1).multiply(q.subtract(1))
        e = bigint(3)
        try {p
            // d = bigintCrypt.modInv(e, et)
            d = modInv(e, et)
            break;
        } catch (error) {
        }
    }
    let publicKey = { e: e, n: n }
    let privateKey = { d: d, n: n }

    encrypt = function (message, pubKey) {
        return message.modPow(pubKey.e, pubKey.n)
    }

    decrypt = function (cipher, privKey) {
        // let i = bigint(cipher, '16')
        // return Buffer.from(cipher.modPow(privKey.d, privKey.n).toString('16'), 'hex').toString()
        return cipher.modPow(privKey.d, privKey.n)
    }
    return {
        publicKey: publicKey,
        privateKey: privateKey,
        encrypt: encrypt,
        decrypt: decrypt
    }
}

function nth_root(x, n) {
    x = bigint(n)
    n = bigint(n)
    let upper_bound = bigint(1)
    while (upper_bound.pow(n) <= x) {
        upper_bound = upper_bound.multiply(2)
    }
    let lower_bound = bigint(1)
    
    while (lower_bound < upper_bound) {
        let mid = (lower_bound.add(upper_bound)).divide(2)
        let mid_nth = mid.pow(n)
        if (lower_bound < mid && mid_nth < x)
            lower_bound = mid
        else if (upper_bound > mid && mid_nth > x) 
            upper_bound = mid
        else
            return mid
    }
    return mid.add(1)
}

let message = "Hello"
let a = rsa().then(function(result) {
    message = bigint(Buffer.from(message).toString('hex'), 16)
    console.log(message)
    let cipherText = result.encrypt(message, result.publicKey)
    let n = result.publicKey.n
    let e = result.publicKey.e
    let s = bigint(2)
    let cdash = s.modPow(e,n).multiply(cipherText)
    let pdash = result.decrypt(cdash, result.privateKey)
    let p = pdash.divide(s).mod(n)
    console.log(p)
})