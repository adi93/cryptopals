input = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";

function hex_to_ascii(hex) {
    var h = hex.toString();
    var ascii = '';
    for (var n = 0; n < h.length; n += 2) {
        ascii += String.fromCharCode(parseInt(h.substr(n, 2), 16))
    }
    return ascii.toString();
}


console.log(hex_to_ascii("1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736"))

function xor(b) {
    var str = hex_to_ascii(b);
    // console.log("hex is: ", str)
    for (var n = 1; n < 256; n++) {
        var ans = '';
        for (var i = 0; i < str.length; i++) {
            var c = parseInt(str.charCodeAt(i) ^ n);
            if (c >= 128) {
                ans = '';
                break;
            }
            ans += String.fromCharCode(c);
        }
    
        if (ans.includes(" ")) console.log("n: ", n, "ans: ", ans.toString())
    }
}



xor(input)

