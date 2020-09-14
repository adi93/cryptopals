
// challenge 50
const crypto = require("crypto")
const cbc = function() {
    let algorithm = 'aes-128-cbc'
    const encrypt = function(buf, key, iv) {
        let cipher = crypto.createCipheriv(algorithm, key, iv)
        let encrypted = cipher.update(buf)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return encrypted
    }
    const decrypt = function(buff, key, iv) {
        function xor(buf1, str) {
            let ans = []
            for (let i = 0; i < buf1.length; i++) {
                ans.push(buf1[i] ^ str[i])
            }
            return ans
        }
        assert(buff.length % 16 == 0, "Buffer length should be a buffer of 16")
        let block_size = key.length
        let prev_xor = iv;
        let decrypted_buff = []
        let decipher = crypto.createDecipheriv(algorithm, key, iv)
        decipher.setAutoPadding(false);
        for (let i = 0; i < buff.length; i += block_size) {
            let current_block = buff.slice(i, i + block_size)
            let decrypted = decipher.update(current_block)
            let xored = xor(prev_xor, decrypted)
            for (let j = 0; j < xored.length; j += 1) {
                decrypted_buff.push(xored[j])
            }
            prev_xor = current_block
        }
        return Buffer.from(decrypted_buff)
    }
    const mac = function(plaintext, key, iv) {
        let buf = Buffer.from(plaintext)
        console.log(buf.length)
        let e = Buffer.from(encrypt(buf, key, iv))
        return e.slice(e.length-key.length)
    }
    return {
        encrypt: encrypt,
        decrypt: decrypt,
        mac: mac
    }

}

function simulate() {
    function xor(buf1, str) {
        let ans = []
        for (let i = 0; i < buf1.length; i++) {
            ans.push(buf1[i] ^ str[i])
        }
        return ans
    }
    let origMesg = "alert('MZA who was that?');\n"
    desMesg = "alert('Ayo, the Wu is back!');//";
    console.log(desMesg.length)
    let iv = "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    let key = "YELLOW SUBMARINE"
    let CBC = cbc()
    let origMac = CBC.mac(origMesg, key, iv)
    let desMac = CBC.mac(desMesg, key, iv)
    let modMesg1 = xor(origMesg.slice(0,16), desMac);
    modMesg1
    modMesg2 = origMes[16:]
    let a = Buffer.from(myMac).toString("hex")
    a
}

simulate()