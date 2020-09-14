// challenge 42
// Bleichenbacher e=3 attack
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

    decrypt = function (cipher, d, n) {
        // let i = bigint(cipher, '16')
        // return Buffer.from(cipher.modPow(privKey.d, privKey.n).toString('16'), 'hex').toString()
        return cipher.modPow(d, n)
    }
    return {
        publicKey: publicKey,
        privateKey: privateKey,
        encrypt: encrypt,
        decrypt: decrypt
    }
}

function convertBytes(n, base) {
    if (base) {
        n = bigint(n.toString(), base)
    } else {
        n = bigint(n)
    }
    let str = n.toString('2')
    let remainder = str.length % 8 == 0 ? 0: 8 - (str.length%8)
    str = Array(remainder).fill(0).join('') + str
    let byteArray = Array(str.length/8)
    for (let index = 0; index < str.length/8; index++) {
        byteArray[index] = parseInt(str.substring(index*8, index*8 + 8), 2)
    }
    return byteArray
}

function convertBigInt(n) {
    let x = bigint(0)
    n = n.reverse()
    for (let i=0; i < n.length; i++) {
        x = bigint(256).pow(i).multiply(n[i]).add(x)
    }
    return x
}

function sha1(message) {
    let sha = require("crypto").createHash("sha1")
    sha.update(message)
    return sha.digest("hex")
}






const d = bigint('45646765937508807147751354805732739280730565762086148706003106585628119122839304858193063314675067032581824937045843400707126154489318784434055050012662111011439904509899000565765732584338639538485749122438417386412170313858859983072279411037857300720043449050907674896224275034060947305139686608455094916907')
const n = bigint('68470148906263210721627032208599108921095848643129223059004659878442178684258957287289594972012600548872737405568765101060689231733978176651082575018993183084120151065575161235641419381555544676099563314503873551697370375841588027775667117934048814400515037977789026808669496887472907915604201440025990421949')
const e = bigint(3)
let message = "Hello"
console.log(convertBytes(sha1(message), 16))

let signature = [0,1,255,255,255,255,255,255,255,255,0].concat(convertBytes(sha1(message), 16))
console.log(signature)

let encrypt = function (message, d, n) {
    message = convertBigInt(message)
    return message.modPow(d, n)
}

signature = encrypt(signature, d, n)

let decrypt = function (cipher, e, n) {
    return cipher.modPow(e, n)
}

async function verify(message, signature) {
    let encrypted = decrypt(signature, e, n)
    encrypted = convertBytes(encrypted)
    if (encrypted[0] != 1) {
        return false
    }
    

    let sepIndex = encrypted.indexOf(0)
    if (sepIndex == -1) return false

    let hash = Array(encrypted.slice(sepIndex+1))[0]
    let computedHash = convertBytes(sha1(message), 16)
    if (hash.length != computedHash.length) return false
    for (let i=0; i < hash.length; i++) {
        if (hash[i] != computedHash[i]) return false
    }
    return true
}
verify(message, signature, {e: e, n: n}).then(function(res) {
    console.log(res)
})

