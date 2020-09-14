// challenge 46
const bigint = require("big-integer")
const rsa = function () {
    const modInv = function (a, m) {
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
    const bigintCrypt = require("bigint-crypto-utils")
    const bigint = require("big-integer")
    let n = 0;
    let d = 0;
    let e = 0;
    // while (true) {
    //     // let p = bigint('1923283877082641291337713561253460612525090074002637673599656632465417691723000680742021849')
    //     // let q = bigint('1502165393276042203596602011337368874962930966434296757367642270485204256194914564468409041')
    //     let p = bigint(await bigintCrypt.prime(10, 16))
    //     let q = bigint(await bigintCrypt.prime(10, 16))
    //     n = p.multiply(q)

    //     let et = p.subtract(1).multiply(q.subtract(1))
    //     e = bigint(3)
    //     try {
    //         // d = bigintCrypt.modInv(e, et)
    //         d = modInv(e, et)
    //         break;
    //     } catch (error) {
    //     }
    // }
    let publicKey = { e: e, n: n }
    let privateKey = { d: d, n: n }

    const encrypt = function (message, pubKey) {
        // let i = bigint(Buffer.from(message).toString('hex'), '16')
        message = bigint(message)
        let c = message.modPow(pubKey.e, pubKey.n)
        return c
    }

    const decrypt = function (cipher, privKey) {
        // let i = bigint(cipher, '16')
        return cipher.modPow(privKey.d, privKey.n)
    }
    const oracle = function (privKey) {
        return function(cipher) {
            let decrypted = decrypt(cipher, privKey)
            return (decrypted.mod(2)).equals(0) // returns true if even
        }
    }
    return {
        publicKey: publicKey,
        privateKey: privateKey,
        encrypt: encrypt,
        oracle: oracle
    }
}
let n = bigint('1069038846817761844448126630349230726662742075359607985622039')
let privKey = {d : bigint('712692564545174562965417753564750679323837465331844354907227'), n: n}
let publicKey = { e: bigint(3), n: n }
let RSA = rsa()
let oracle = RSA.oracle(privKey)
let message = 15895115

let encrypted = RSA.encrypt(message, publicKey)
n
encrypted
function solve(c) {
    let LB = bigint(1)
    let UB = bigint(n)
    for (let i=1; i < 1000; i++) {
        let cdash = ((bigint(2).pow(3*i)).multiply(c)).mod(n)
        if (oracle(cdash)) {
            UB = UB.add(LB).divide(2).add(1)
        } else {
            LB = UB.add(LB).divide(2).subtract(1)
        }
        if (UB.subtract(LB) <= 8) {
            break;
        }
    }
    console.log("LB: ", LB, "UB:", UB)
}

solve(encrypted)
