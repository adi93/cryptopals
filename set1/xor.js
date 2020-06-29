//challenge 2
function xor(b) {
    var str = Buffer.from(b, 'hex').toString('utf-8');
    // console.log("hex is: ", str)
    possible_ans = []
    for (var n = 1; n < 256; n++) {
        var ans = '';
        for (var i = 0; i < str.length; i++) {
            var c = parseInt(str.charCodeAt(i) ^ n);
            if (!printable(c)) {
                ans = '';
                break;
            }
            ans += String.fromCharCode(c);
        }
        if (ans.includes(" ")) { // arbitrary condition, should do a proper frequency analysis here
            possible_ans.push([n, ans])
        }
        
    }
    return possible_ans
}

input = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";
function printable(ch) {
    if ((ch >= 32 && ch <= 127) || ch == 10 || ch == 9) {
        return true;
    }
    return false;
}

a = xor(input)
a.forEach(element => {
    console.log("Key:", element[0], "Answer:", element[1])
});