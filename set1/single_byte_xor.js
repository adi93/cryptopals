
const fs = require("fs")
const MAG_FACTOR = 100;
const data = fs.readFileSync('./set1/comc.txt',
    { encoding: 'utf8', flag: 'r' });
// console.log(repeating_xor(input, "ICE"))

function get_freq(data) {
    corpus = {}
    total_chars = data.length / MAG_FACTOR
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
const CORPUS = get_freq(data)
for (let key in CORPUS) {
    const cutoff = 1/MAG_FACTOR;
    if (CORPUS[key] < cutoff) {
        delete CORPUS[key]
    }
}

function xor(str) {
    possible_answers = []
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
            ans_score = get_freq_score(ans, CORPUS)
            // console.log(n, ans_score, ans)
            possible_answers.push([ans, ans_score, n])
        }
    }
    possible_answers.sort((a, b) => b[1] - a[1])
    // console.log(possible_answers[0])
    if (possible_answers.length != 0)
        return [possible_answers[0][0], possible_answers[0][2]]
    return [[], '']
}

const input_hex = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";
input = Buffer.from(input_hex, 'hex')
decoded = xor(input)
console.log("Key:", "'" + String.fromCharCode(decoded[1]) +"'", "Message:", Buffer.from(decoded[0], 'utf-8').toString())

