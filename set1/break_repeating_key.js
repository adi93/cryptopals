// challenge 6
"use strict";
const fs = require("fs")
const MAG_FACTOR = 100;
const corpus_data = fs.readFileSync('./set1/comc.txt',
    { encoding: 'utf8', flag: 'r' });

function get_freq(data) {
    let corpus = {}
    let total_chars = data.length / MAG_FACTOR
    for (let i = 0; i < data.length; i++) {
        let c = data.charAt(i);
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
    let str_corpus = get_freq(str)
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

// build the main corpus
const CORPUS = get_freq(corpus_data)
for (let key in CORPUS) {
    const cutoff = 1/MAG_FACTOR;
    if (CORPUS[key] < cutoff) {
        delete CORPUS[key]
    }
}

/**
 * Computes hamming distance between two equal length strings
 * @param {string} str1 string 1
 * @param {string} str2 string 2
 */
function hamming(str1, str2) {
  
  let result = 0
  for (let i=0; i<str1.length; i++) {
    let b1 = str1.charCodeAt(i)
    let b2 = str2.charCodeAt(i)
    let hamming = b1 ^ b2;
    while (hamming > 0) {
      result += 1;
      hamming &= (hamming -1);
    }
  }
  return result
}
console.assert(hamming("this is a test", "wokka wokka!!!") == 37, "Hamming distance failed")

/**
 * Return top 3 possible key sizes for a hex encoded string
 * @param {string} data_hex hex encoded string
 */
function possible_key_sizes(data_hex) {
  let data = Buffer.from(data_hex, 'hex').toString('utf-8')
  let arr = [];
  for (let k=2; k < 40; k++) {
    let distance = hamming(data.substring(0, 8*k), data.substring(4*k, 8*k)) / k;
    // console.log("substring: ", data.substring(0, 4*k))
    arr.push([k, distance])
  }
  return arr.sort((a,b) => a[1] - b[1])
}

function single_key_xor(b) {
    let str = hex_to_ascii(b);
    // console.log("hex is: ", str)
    let possible_answers = []
    for (let n = 1; n < 128; n++) {
        let ans = '';
        for (let i = 0; i < str.length; i++) {
            let c = parseInt(str.charCodeAt(i) ^ n);
            if (c >= 128) {
                ans = '';
                break;
            }
            ans += String.fromCharCode(c);
        }
        if (ans != '') {
            let ans_score = get_freq_score(ans, CORPUS)
            // console.log(n, ans_score, ans)
            possible_answers.push([ans, ans_score, n])
        }
    }
    possible_answers.sort((a, b) => b[1] - a[1])
    // console.log(possible_answers[0])
    return possible_answers[0][2]
}

function hex_to_ascii(hex) {
  let h = hex.toString();
  let ascii = '';
  for (let n = 0; n < h.length; n += 2) {
      ascii += String.fromCharCode(parseInt(h.substr(n, 2), 16))
  }
  return ascii.toString();
}

/**
 * Divides a string into blocks, then transposes them:
 * make a block that is the first byte of every block, and a block that is the 
 * second byte of every block, and so on. 
 * 
 * Returns a list of the above-mentioned transposed blocks, as string
 * @param {string} str1 The string to be divided, in hex-encoded format (2 characters are meant to be one byte)
 * @param {int} block_size block size
 */
function transpose(str1, block_size) {
  let transposed_blocks = []
  for (let i=0; i< block_size; i++) {
    transposed_blocks.push('')
  }
  let block_counter = 0;
  for (let i=0; i<str1.length; i+= 2) {
    let c =  str1.substr(i, 2)
    transposed_blocks[block_counter] += c;
    block_counter = (block_counter + 1) % block_size; 
  }
  return transposed_blocks;
}

// console.log(transpose("1d421f4d0b0f021f", 3))
function zip() {
  let args = [].slice.call(arguments);
  args = args.slice(0, args.length - 1)
  return args[0].map(function(_,i){
      return args.map(function(array){return array[i]})
  });
}


function break_decryption(b) {
  let possible_key_size = possible_key_sizes(b)

  // try top 5 key sizes
  let answers = []
  for (let i=0; i<3; i++) {
    let key_size = possible_key_size[i][0]
    let blocks = transpose(b, key_size)
    let possible_key = '';
    for (let block in blocks) {
      let c = single_key_xor(blocks[block])
      possible_key += String.fromCharCode(c)
    }
    // console.log("key size:", key_size, " key:", possible_key)
    let decoded = repeating_xor(b, possible_key)
    answers.push([get_freq_score(decoded, CORPUS), key_size, possible_key, decoded])
  }
  answers.sort((a,b) => b[0] - a[0])
  let ans = answers[0]
  console.log("Key size:", ans[1], "KEY:["+ans[2]+"] Content:", ans[3])
}

/**
 * Applies repeating key xor to the input. Can be used to both encode/decode.
 * @param {str} input hex-encoded string, to be decoded/encoded
 * @param {str} key key
 * 
 * Returns a utf-8 string
 */
function repeating_xor(input, key) {
  let ans = '';
  let key_len = key.length;
  for (let i = 0; i < input.length; i+=2) {
    ans += String.fromCharCode(parseInt(input.substr(i, 2), 16) ^ key.charCodeAt((i/2) % key_len))
  }
  return ans.toString()
}


const data = fs.readFileSync('./set1/6.txt',
    { encoding: 'utf8', flag: 'r' });
let data_hex = Buffer.from(data, 'base64').toString('hex')
// console.log(possible_key_sizes(data_hex))
break_decryption(data_hex)
// console.log(data_hex)
