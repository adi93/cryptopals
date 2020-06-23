const fs = require("fs"), readline = require('readline');
const MAG_FACTOR = 100;
const CORPUS_DATA = fs.readFileSync('./set1/comc.txt',
    { encoding: 'utf8', flag: 'r' });

function get_freq(data) {
    corpus = {}
    total_chars = data.length / MAG_FACTOR
    for (var i = 0; i < data.length; i++) {
        var c = data[i];
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
    str_corpus = get_freq(Buffer.from(str, 'utf-8').toString())
    score = 0.0;
    for (let key in str_corpus) {
        corpus_score = corpus[key]
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
    possible_answers = []
    for (var n = 1; n < 128; n++) {
        var ans = [];
        for (var i = 0; i < str.length; i++) {
            var c = str[i] ^ n;
            if (c >= 128) {
                ans = '';
                break;
            }
            ans.push(c);
        }
        if (ans != []) {
            ans_score = get_freq_score(ans, CORPUS)
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

var answers = []
var rd = readline.createInterface({
    input: fs.createReadStream('./set1/4.txt')
});
var line_number = 0
rd.on('line', function (line) {
    var l = Buffer.from(line, 'hex')
    var decrypted = xor(l)
    decrypted.push(line_number)
    answers.push(decrypted)
    line_number += 1;
})
rd.on('close', function () {
    answers.sort((a, b) => b[1] - a[1])
    ans = answers[0]
    console.log("Line:", ans[3] + 1, "Content:", Buffer.from(ans[0]).toString(),
        "Key:", String.fromCharCode(ans[2]))
})
