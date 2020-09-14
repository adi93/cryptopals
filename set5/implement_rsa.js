// challenge 39
const rsa = async function () {
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

// const bigintCrypto = require("bigint-crypto-utils")
// let x = bigintCrypto.modInv(17, 3120)
// x
let a = rsa().then(function (result) {
    const bigint = require("big-integer")
    let pubKey = result.publicKey
    let privKey = result.privateKey
    let message = "ll"

    let cipherText = result.encrypt(message, pubKey)
    let plaintText = result.decrypt(cipherText, privKey)
    console.log(message)
    console.log(plaintText)
})