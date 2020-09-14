// challenge 49
const crypto = require("crypto")
const cbc = function() {
    let algorithm = 'aes-128-cbc'
    const encrypt = function(buf, key, iv) {
        buf
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
        let e = encrypt(buf, key, iv)
        return e.slice(e.length-key.length)
    }
    return {
        encrypt: encrypt,
        decrypt: decrypt,
        mac: mac
    }

}

const server = function() {
    let CBC = cbc()
    const keys = {
        "me": "YELLOW SUBMARINE", // unknown to attacker
    }
    const verify = function(message, iv, mac) {
        // "from=#{from_id}&to=#{to_id}&amount=#{amount}"
        let parsed = message.match(/from=(.*)&to=(.*)&amount=(.*)/);
        let from = parsed[1], to = parsed[2], amount = parsed[3]
        let key = keys[from]
        let computedMac = CBC.mac(message, key, iv)
        computedMac
        if (mac.equals(computedMac)) {
            console.log("Transferred to ", to)
            return true;
        } else {
            throw "Invalid message"
        }

    }
    return {
        transfer: verify
    }
}

let myKey = "YELLOW SUBMARINE"
function simulate() {
    let message = "from=me&to=fred&amount=1000000"
    let iv = "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    let CBC = cbc()
    let myMac = CBC.mac(message, myKey, iv)
    myMac

    corruptedMsg = modifyMessage(message, iv)
    message = corruptedMsg.msg
    iv = corruptedMsg.iv
    SERVER = server()
    SERVER.transfer(message, iv, myMac)

    function modifyMessage(msg, iv) {
        // only works if to is less than "friend". We can always pad it.
        let desiredMsg = "from=me&to=gred&amount=1000000"

        // xor first 16 bytes
        let newIv = Array(16).fill(0)
        for (let i=0; i<16; i++) {
            newIv[i] = desiredMsg.charCodeAt(i) ^ msg.charCodeAt(i) ^ iv.charCodeAt(i)
        }
        newIv
        newIv = newIv.map(c => String.fromCharCode(c)).join('')
        newIv
        return {msg: desiredMsg, iv: newIv}
    }
}

simulate()