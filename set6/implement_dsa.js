// challenge 43
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
    const sha256 = function(message) {
        let fixedMessage = "For those that envy a MC it can be hazardous to your health\nSo be friendly, a matter of life and death, just like a etch-a-sketch"
        if (fixedMessage == message) {
            return bigint('d2d0714f014a9784047eaeccf956520045c45265', 16)
        }
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
    const hash = params.hash || sha256

    const keypair = function() {
        let x = bigint.randBetween(1, q.subtract(1))
        let y = g.modPow(x, p)
        return {privKey: x, pubKey: y}
    }

    const sign = function(message, privKey, k) {
        k = bigint.randBetween(1, q-1)
        // k = k || bigint.randBetween(1, 2**16)
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
        r
        v
        return (v.equals(r))
    }
    const findPrivKey = function(signature, message, k) {
        let s = signature.s
        let r = signature.r
        let x = s.multiply(bigint(k)).subtract(DSA.hash(message)).multiply(modInv(r, q)).mod(q)
        return x
    }
    return {
        keypair,
        sign,
        verify,
        findPrivKey,
        hash
    }
}

let message = "Hello"
let DSA = dsa()

console.log(DSA.hash(message).toString(16))

let signature = {
    r: bigint('548099063082341131477253921760299949438196259240'),
    s: bigint('857042759984254168557880549501802188789837994940')
}
message = "For those that envy a MC it can be hazardous to your health\nSo be friendly, a matter of life and death, just like a etch-a-sketch"
function findPrivateKey() {
    for (let k = 1; k < 2 ** 16; k++) {
        if (k%1000 == 0) {
            console.log("k", k)
        }
        try {
            let possiblePrivKey = DSA.findPrivKey(signature, message, k)
            let newSignature = DSA.sign(message, possiblePrivKey, k)
            if (newSignature.r.equals(signature.r)) {
                console.log("k was", k)
                console.log("possiblePrivKey", possiblePrivKey)
                return
            }
        } catch {
            continue
        }
   }
   console.log("Didn't find the key")
}

findPrivateKey()