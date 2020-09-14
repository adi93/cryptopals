// challenge 40
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
        try {
            // d = bigintCrypt.modInv(e, et)
            d = modInv(e, et)
            break;
        } catch (error) {
        }
    }
    let publicKey = { e: e, n: n }
    let privateKey = { d: d, n: n }

    encrypt = function (message, pubKey) {
        // let i = bigint(Buffer.from(message).toString('hex'), '16')
        message = bigint(Buffer.from(message).toString('hex'), 16)
        let c = message.modPow(pubKey.e, pubKey.n)
        console.log("C", c)
        return c
    }

    decrypt = function (cipher, privKey) {
        // let i = bigint(cipher, '16')
        return Buffer.from(cipher.modPow(privKey.d, privKey.n).toString('16'), 'hex').toString()
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
let solve = async function(message) {
    let c0p0 = await rsa().then(function (result) {
        let pubKey = result.publicKey
        let c0 = result.encrypt(message, pubKey)
        let p0 = pubKey
        return { c0: c0, p0: p0 }
    })
    let c1p1 = await rsa().then(function (result) {
        let pubKey = result.publicKey
        let c1 = result.encrypt(message, pubKey)
        let p1 = pubKey
        return { c1: c1, p1: p1 }
    })
    let c2p2 = await rsa().then(function (result) {
        let pubKey = result.publicKey
        let c2 = result.encrypt(message, pubKey)
        let p2 = pubKey
        return { c2: c2, p2: p2 }
    })

    let c0 = c0p0.c0.mod(c0p0.p0.n)
    let c1 = c1p1.c1.mod(c1p1.p1.n)
    let c2 = c2p2.c2.mod(c2p2.p2.n)

    let ms0 = c1p1.p1.n.multiply(c2p2.p2.n)
    let ms1 = c0p0.p0.n.multiply(c2p2.p2.n)
    let ms2 = c1p1.p1.n.multiply(c0p0.p0.n)

    let result = (c0.multiply(ms0).multiply(modInv(ms0, c0p0.p0.n))).add(
        (c1.multiply(ms1).multiply(modInv(ms1, c1p1.p1.n)))).add(
            (c2.multiply(ms2).multiply(modInv(ms2, c2p2.p2.n))))
    let n012 = c0p0.p0.n.multiply(c1p1.p1.n).multiply(c2p2.p2.n)

    result = result.mod(n012)
    let ans = nth_root(result, 3)
    return ans
}

solve(message).then(function(result) {
     console.log(result)
})