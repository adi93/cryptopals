
const bigint = require("big-integer")

function convertBigInt(n) {
    let x = bigint(0)
    let m = [...n]
    m = m.reverse()
    for (let i=0; i < n.length; i++) {
        x = bigint(256).pow(i).multiply(m[i]).add(x)
    }
    return x
}
/**
 *  Converts a number to bytes.
 * Useage: let n = convertToBytes('257')
 * 
 * returns n = [1,1] 
 * @param {string} n bigint number to be converted
 * @param {number} base base of number, default is 10
 */
const convertToBytes = function(n, base) {
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
const rsa = function (bits) {
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
    bits = bits || 128;
    const bigintCrypt = require("bigint-crypto-utils")
    const bigint = require("big-integer")
    let n = 0;
    let d = 0;
    let e = 0;
    let p = 0
    let q = 0
    while (true) {
        p = bigint('260620229113602109067811273750478007093')
        q = bigint('229656222621606939676457870185057314683')
        // p = bigint(await bigintCrypt.prime(bits, 25))
        // q = bigint(await bigintCrypt.prime(bits, 25))
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

    const encrypt = function (message, pubKey) {
        pubKey
        let padM = padMessage(message)
        let x = (convertBigInt(padM)).modPow(pubKey.e, pubKey.n)
        return x
    }

    const padMessage = function(message) {
        let nbits = 2*bits;
        bits
        let messageBytes = convertToBytes(message);
        let paddedLength = (nbits/8) - 3 -  messageBytes.length
        paddedLength
        let paddedString = Array(paddedLength).fill(3);
        return [0,2].concat(paddedString, [0], messageBytes)
    }


    const decrypt = function (cipher, privKey) {
        return bigint(cipher).modPow(privKey.d, privKey.n)
    }

    const decryptMessage = function (cipher, privKey) {
        let paddedM = convertToBytes(decrypt(cipher, privKey))
        return paddedM.slice(paddedM.indexOf(0)+1)
    }

    const oracle = function (privKey) {
        return function(cipher) {
            cipher

            decrypted = [0].concat(convertToBytes(decrypt(cipher, privKey)))
            if (decrypted.length != bits/4) return false;
            if (decrypted[0] != 0 || decrypted[1] != 2) return false;

            for (let i=2; i<10; i++) {
                if (decrypted[i] == 0) {
                    return false;
                }
            }
            return decrypted.indexOf(0, 1) >= 10
        }
    }
    return {
        publicKey: publicKey,
        privateKey: privateKey,
        decryptMessage: decryptMessage,
        padMessage: padMessage,
        encrypt: encrypt,
        oracle: oracle
    }
}

let k = 13
let RSA = rsa(52)
let message = 1234
let n = bigint('7296077795225506636334586743803')
let e = bigint(3)
let d = bigint('4864051863483667489385735919499')
let privateKey = {d: d, n: n}
let publicKey = {e: e, n: n}
let c = RSA.encrypt(message, publicKey)
c

let oracle = RSA.oracle(privateKey)
// let an = oracle(c)
// an
let c0 = c
M0
let i=1
function findS1(s1_min) {
    // let s1 = n.divide(B.multiply(3))
    let s1 = bigint(s1_min)
    s1
    while (true) {
        let cdash = c0.multiply(s1.modPow(e, n)).mod(n)
        if (oracle(cdash)) {
            return s1;
        }
        if (s1.mod(10000) == 0) console.log("s1:", s1)
        s1 = s1.add(1);
    }
}
function breakMessage(c) {

    function merge(intervals) {
        if (!intervals.length) return intervals
        intervals.sort((a, b) => a.start !== b.start ? a.start - b.start : a.end - b.end)
        var prev = intervals[0]
        var res = [prev]
        for (var curr of intervals) {
            if (curr.start <= prev.end) {
                prev.end = Math.max(prev.end, curr.end)
            } else {
                res.push(curr)
                prev = curr
            }
        }
        return res
    }
    function aggregate(pair, aggregator) {
        // step 3
        let a = pair[0]
        let b = pair[1]
        let rmin = a.multiply(s1).subtract(B.multiply(3)).add(1).divide(n)
        let rmax = b.multiply(s1).subtract(B.multiply(2)).divide(n)
        for (let i = rmin; i < rmin + 1; i++) {
            let x = a > B.multiply(2).add(n.multiply(i)).divide(s1) ? a : B.multiply(2).add(n.multiply(i)).divide(s1)
            let y = b > B.multiply(3).subtract(1).add(n.multiply(i)).divide(s1) ? B.multiply(3).subtract(1).add(n.multiply(i)).divide(s1) : b
            if (x <= y) {
                aggregator.add([x, y])
            }
        }
        //union aggregator
        aggregator = merge(aggregator)
    }

    let s1 = bigint(445305);
    let c0 = c
    let B = bigint(2).pow(8*(k-2))
    let prevM = [[B.multiply(2), B.multiply(3).subtract(1)]]
    let M = []
    let i = 1;
    while(true) {
        let arr = []
        // 2.a
        if (i==1) {
            prevM.forEach(p => aggregate(p, arr))
        } else {

        }
        
    }
}
let s1 = findS1(n, B, c0)
console.log(s1)
// let cdash = c0.multiply(bigint(10667).modPow(e,n)).mod(n)
// console.log(oracle(cdash))