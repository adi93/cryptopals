// challenge 44
const bigint = require("big-integer")
const { assert } = require("console")
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
const dsa = function(params) {
    const crypto = require("crypto")

    const sha = function(message) {
        let sha = crypto.createHash("sha1")
        sha.update(message)
        return bigint(sha.digest("hex"), 16)
    }

    if (!params) {
        params = {}
    }
    params
    const p = params.p || bigint('800000000000000089e1855218a0e7dac38136ffafa72eda7859f2171e25e65eac698c1702578b07dc2a1076da241c76c62d374d8389ea5aeffd3226a0530cc565f3bf6b50929139ebeac04f48c3c84afb796d61e5a4f9a8fda812ab59494232c7d2b4deb50aa18ee9e132bfa85ac4374d7f9091abc3d015efc871a584471bb1', 16)
    const q = params.q || bigint('f4f47f05794b256174bba6e9b396a7707e563c5b', 16)
    const g = params.g || bigint(`5958c9d3898b224b12672c0b98e06c60df923cb8bc999d119458fef538b8fa4046c8db53039db620c094c9fa077ef389b5322a559946a71903f990f1f7e0e025e2d7f7cf494aff1a0470f5b64c36b625a097f1651fe775323556fe00b3608c887892878480e99041be601a62166ca6894bdd41a7054ec89f756ba9fc95302291`, 16) 
    const hash = params.hash || sha

    const keypair = function() {
        let x = bigint.randBetween(1, q.subtract(1))
        let y = g.modPow(x, p)
        return {privKey: x, pubKey: y}
    }

    const sign = function(message, privKey, k) {
        k = k || bigint.randBetween(1, q.subtract(1))
        let r = g.modPow(k, p).mod(q)
        let kInverse = modInv(k, q)
        let s = hash(message).add(privKey.multiply(r)).multiply(kInverse).mod(q)
        return {r, s, k}
    }

    function verify(signature, message, publicKey) {
        let r = signature.r
        let s = signature.s
        assert (0 < r && r < q, "r should be between 0 and q")
        assert (0 < s && s < q, "s should be between 0 and q")
        let w = modInv(s,q)
        let u1 = hash(message).multiply(w).mod(q)
        let u2 = r.multiply(w).mod(q)
        let v = (g.modPow(u1, p).multiply(publicKey.modPow(u2, p))).mod(p).mod(q)
        return (v.equals(r))
    }
    const findPrivKey = function(signature, message, k, hash) {
        let s = signature.s
        let r = signature.r
        hash = hash || DSA.hash(message)
        let x = s.multiply(bigint(k)).subtract(hash).multiply(modInv(r, q)).mod(q)
        return x < 0 ? x.add(q) : x
    }
    return {
        keypair,
        sign,
        verify,
        findPrivKey,
        hash,
        params: {q: q, p:p, g:g}
    }
}
let DSA = dsa()
let rd = require("readline").createInterface({
    input: fs.createReadStream('./set6/44.txt')
});
let counter = 0
let messages = []
let message, s, r, h
rd.on('line', function (line) {
    let text = Buffer.from(line).toString().split(": ")[1]
    if (counter % 4 == 0) {
        message = text
    } else if (counter % 4 == 1) {
        s = bigint(text)
    } else if (counter % 4 == 2) {
        r = bigint(text)
    } else if (counter %4 == 3) {
       h = bigint(text, 16)
       assert (h.equals(DSA.hash(message)))
       messages.push({m: message, s: s, r: r, hm: h})
    }
    counter++
})
let kmap = new Map()
function getK(mesg1, mesg2) {
    let hm1 = mesg1.hm
    let hm2 = mesg2.hm

    let s1 = mesg1.s
    let s2 = mesg2.s

    let q = DSA.params.q
    let diff = hm1.subtract(hm2)
    let modi = modInv(s1.subtract(s2), q)

    let ans = (diff.multiply(modi)).mod(q) 
    return ans < 0 ? ans.add(q) : ans
}
rd.on('close', function () {
    for (let i=0; i<messages.length; i++) {
        let m1 = messages[i]
        for (let j=0; j<messages.length; j++) {
            if (i == j) continue
            try {
                let m2 = messages[j]
                let k = getK(m1, m2)
                let privKey = DSA.findPrivKey({ r: m2.r, s: m2.s }, m2.m, k)
                let newSign = DSA.sign(m2.m, privKey, k)
                if (newSign.s.equals(m2.s)) {
                    console.log("Priv key", privKey)
                    console.log("Priv key", DSA.hash(privKey.toString(16)).toString(16))
                }
            } catch (error) {
            }
        }
    }
})
