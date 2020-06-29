// challenge 4
"use strict";
const fs = require("fs"), readline = require('readline');
const MAG_FACTOR = 100;
const CORPUS_DATA = fs.readFileSync('./set1/comc.txt',
    { encoding: 'utf8', flag: 'r' });

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


// build corpus
const CORPUS = get_freq(CORPUS_DATA)
for (let key in CORPUS) {
    const cutoff = 1 / MAG_FACTOR;
    if (CORPUS[key] < cutoff) {
        delete CORPUS[key]
    }
}

function xor(str) {
    let possible_answers = []
    for (let n = 1; n < 128; n++) {
        let ans = [];
        for (let i = 0; i < str.length; i++) {
            let c = str[i] ^ n;
            if (c >= 128) {
                ans = '';
                break;
            }
            ans.push(c);
        }
        if (ans != []) {
            let ans_score = get_freq_score(ans, CORPUS)
            // console.log(n, ans_score, ans)
            possible_answers.push([ans, ans_score, n])
        }
    }
    possible_answers.sort((a, b) => b[1] - a[1])
    // console.log(possible_answers[0])
    if (possible_answers.length != 0)
        return possible_answers[0]
    return [[], 0, '']
}

let answers = []
let rd = readline.createInterface({
    input: fs.createReadStream('./set1/4.txt')
});
let line_number = 0
rd.on('line', function (line) {
    let l = Buffer.from(line, 'hex')
    let decrypted = xor(l)
    decrypted.push(line_number)
    answers.push(decrypted)
    line_number += 1;
})
rd.on('close', function () {
    answers.sort((a, b) => b[1] - a[1])
    let ans = answers[0]
    console.log("Line:", ans[3] + 1, "Content:", Buffer.from(ans[0]).toString(),
        "Key:", String.fromCharCode(ans[2]))
})
