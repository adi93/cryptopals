// challenge 20
"use strict";
let crypto = require("crypto")
let underscorejs = require("underscore")
const blockSize = 16
let strings = ["SSBoYXZlIG1ldCB0aGVtIGF0IGNsb3NlIG9mIGRheQ==",
    "Q29taW5nIHdpdGggdml2aWQgZmFjZXM=",
    "RnJvbSBjb3VudGVyIG9yIGRlc2sgYW1vbmcgZ3JleQ==",
    "RWlnaHRlZW50aC1jZW50dXJ5IGhvdXNlcy4=",
    "SSBoYXZlIHBhc3NlZCB3aXRoIGEgbm9kIG9mIHRoZSBoZWFk",
    "T3IgcG9saXRlIG1lYW5pbmdsZXNzIHdvcmRzLA==",
    "T3IgaGF2ZSBsaW5nZXJlZCBhd2hpbGUgYW5kIHNhaWQ=",
    "UG9saXRlIG1lYW5pbmdsZXNzIHdvcmRzLA==",
    "QW5kIHRob3VnaHQgYmVmb3JlIEkgaGFkIGRvbmU=",
    "T2YgYSBtb2NraW5nIHRhbGUgb3IgYSBnaWJl",
    "VG8gcGxlYXNlIGEgY29tcGFuaW9u",
    "QXJvdW5kIHRoZSBmaXJlIGF0IHRoZSBjbHViLA==",
    "QmVpbmcgY2VydGFpbiB0aGF0IHRoZXkgYW5kIEk=",
    "QnV0IGxpdmVkIHdoZXJlIG1vdGxleSBpcyB3b3JuOg==",
    "QWxsIGNoYW5nZWQsIGNoYW5nZWQgdXR0ZXJseTo=",
    "QSB0ZXJyaWJsZSBiZWF1dHkgaXMgYm9ybi4=",
    "VGhhdCB3b21hbidzIGRheXMgd2VyZSBzcGVudA==",
    "SW4gaWdub3JhbnQgZ29vZCB3aWxsLA==",
    "SGVyIG5pZ2h0cyBpbiBhcmd1bWVudA==",
    "VW50aWwgaGVyIHZvaWNlIGdyZXcgc2hyaWxsLg==",
    "V2hhdCB2b2ljZSBtb3JlIHN3ZWV0IHRoYW4gaGVycw==",
    "V2hlbiB5b3VuZyBhbmQgYmVhdXRpZnVsLA==",
    "U2hlIHJvZGUgdG8gaGFycmllcnM/",
    "VGhpcyBtYW4gaGFkIGtlcHQgYSBzY2hvb2w=",
    "QW5kIHJvZGUgb3VyIHdpbmdlZCBob3JzZS4=",
    "VGhpcyBvdGhlciBoaXMgaGVscGVyIGFuZCBmcmllbmQ=",
    "V2FzIGNvbWluZyBpbnRvIGhpcyBmb3JjZTs=",
    "SGUgbWlnaHQgaGF2ZSB3b24gZmFtZSBpbiB0aGUgZW5kLA==",
    "U28gc2Vuc2l0aXZlIGhpcyBuYXR1cmUgc2VlbWVkLA==",
    "U28gZGFyaW5nIGFuZCBzd2VldCBoaXMgdGhvdWdodC4=",
    "VGhpcyBvdGhlciBtYW4gSSBoYWQgZHJlYW1lZA==",
    "QSBkcnVua2VuLCB2YWluLWdsb3Jpb3VzIGxvdXQu",
    "SGUgaGFkIGRvbmUgbW9zdCBiaXR0ZXIgd3Jvbmc=",
    "VG8gc29tZSB3aG8gYXJlIG5lYXIgbXkgaGVhcnQs",
    "WWV0IEkgbnVtYmVyIGhpbSBpbiB0aGUgc29uZzs=",
    "SGUsIHRvbywgaGFzIHJlc2lnbmVkIGhpcyBwYXJ0",
    "SW4gdGhlIGNhc3VhbCBjb21lZHk7",
    "SGUsIHRvbywgaGFzIGJlZW4gY2hhbmdlZCBpbiBoaXMgdHVybiw=",
    "VHJhbnNmb3JtZWQgdXR0ZXJseTo=",
    "QSB0ZXJyaWJsZSBiZWF1dHkgaXMgYm9ybi4="]

class oracle {
    constructor() {
    }
    encrypt(plaintText, key, nonce) {
        let cipherText = []
        let counter = 0
        for (let i = 0; i < plaintText.length; i += blockSize) {
            let keyStream = this.generateKeyStream(key, nonce, counter)
            counter += 1
            let encrypted = this.xor(keyStream, plaintText.slice(i, i + blockSize))
            cipherText = cipherText.concat(encrypted)
        }
        return cipherText
    }


    generateKeyStream(key, nonce, counter) {
        let ks = this.keyStream(counter, nonce)
        let cipher = crypto.createCipheriv('aes-128-ecb', key, null)
        let encrypted = cipher.update(Buffer.from(ks))
        return Array.from(encrypted)
    }


    xor(a, b) {
        let ans = []
        for (let i = 0; i < b.length; i += 1) {
            ans.push(a[i] ^ b[i])
        }
        return ans
    }

    keyStream(counter, nonce) {
        let bytesTaken = Math.ceil(counter.toString(2).length / 8)
        let padding = Array(8 - bytesTaken).fill(0)
        let ks = nonce.slice(0)
        ks.push(counter)
        ks = ks.concat(padding)
        return ks

    }

    decrypt(cipherText, key, nonce) {
        return this.encrypt(cipherText, key, nonce)
    }
}


const nonce = Array(8).fill(0)
const key = "YELLOW SUBMARINE"
let encryptedTexts = strings.map(s => {
    let o = new oracle();
    return o.encrypt(Buffer.from(s, "base64"), key, nonce);
})

console.log(encryptedTexts)


function get_freq(data) {
    let corpus = {}
    let total_chars = data.length / MAG_FACTOR
    for (let i = 0; i < data.length; i++) {
        let c = data[i];
        if (c in corpus) {
            corpus[c] = corpus[c] + 1;
        } else {
            corpus[c] = 0;
        }
    };
    for (let key in corpus) {
        corpus[key] = corpus[key] / total_chars;
    }
    return corpus
}

function get_freq_score(str, corpus) {
    let str_corpus = get_freq(Buffer.from(str, 'utf-8').toString())
    let score = 0.0;
    for (let key in str_corpus) {
        let corpus_score = corpus[key]
        if (corpus_score == undefined) {
            continue
        }
        score += corpus_score * str_corpus[key]
    }
    return score
}


const fs = require("fs");
const MAG_FACTOR = 100;
const data = fs.readFileSync('./set1/comc.txt', // Count of Monte Cristo, yeah!
    { encoding: 'utf8', flag: 'r' });
// console.log(repeating_xor(input, "ICE"))


// build corpus
const CORPUS = get_freq(data)
for (let key in CORPUS) {
    const cutoff = 1/MAG_FACTOR;
    if (CORPUS[key] < cutoff) {
        delete CORPUS[key]
    }
}


let byteNumbers = []
let minLength = encryptedTexts.slice(0).sort((a,b) => a.length > b.length)
for (let byteNumber = 0; byteNumber < 100; byteNumber+= 1) {
    let decryptedStringsArr = []
    for (let i = 0; i < 256; i += 1) {
        let decrypted = []
        encryptedTexts.forEach(e => {
            if (byteNumber < e.length) {
                decrypted.push(e[byteNumber] ^ i)
            }
        });
        decryptedStringsArr.push([decrypted, i])
    }
    let stringsToBeTested = underscorejs.filter(decryptedStringsArr, dei => {
        let d = dei[0]
        if (d.length == 0) return false;
        for (let i = 0; i < d.length; i += 1) {
            let c = d[i]
            if (c < 32 || c > 127) {
                return false;
            }
        }
        return true;
    }).map(dei => {
        let str = Buffer.from(dei[0]).toString().toLowerCase()
        return [str, dei[1]]
    })
    stringsToBeTested

    let scores = []
    for (let i = 0; i < stringsToBeTested.length; i += 1) {
        let string = stringsToBeTested[i][0]
        let score = get_freq_score(string, CORPUS)
        scores.push([string, score, stringsToBeTested[i][1]])
    }

    scores.sort((a, b) => b[1] - a[[1]])
    if (scores.length > 0) byteNumbers.push([byteNumber, scores[0][2]])
}

let ks = byteNumbers.map(b => b[1])
encryptedTexts.forEach(e => {
    let str = ''
    for (let i=0; i < ks.length; i+=1) {
        str += String.fromCharCode(ks[i] ^ e[i])
    }
    console.log(str)
})

