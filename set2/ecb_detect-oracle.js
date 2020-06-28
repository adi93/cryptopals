// Challenge 11
crypto = require("crypto")
function detect_ecb(buff) {
    let block_size = 16
    let m = new Map()
    for (let i = 0; i < buff.length; i += block_size) {
        block = buff.slice(i, i + block_size).toString()
        count = m.get(block)
        if (count == undefined || count == null) {
            m.set(block, 1)
        } else {
            return true
        }
        
    }
    return false;
}

function generate_random_bytes(size) {
    return crypto.randomBytes(size)
}

function generate_random_number(min, max) {
    return Math.floor((Math.random() * (max-min)) + min); 
}

let key = generate_random_bytes(16)
function encrypt_randomly(buff, mode) {
    let bytes_prefix = generate_random_bytes(generate_random_number(5,10))
    let bytes_postfix = generate_random_bytes(generate_random_number(5,10))
    
    let message = Buffer.concat([bytes_prefix, buff, bytes_postfix])

    if (mode == undefined) {
        mode = Math.random() > 0.5 ? 'ECB' : 'CBC'
    }
    let encrypted = undefined;
    if (mode = 'ECB') {
        let cipher = crypto.createCipheriv('aes-128-ecb', key, null)
        encrypted = cipher.update(message)
        encrypted = Buffer.concat([encrypted, cipher.final()])
    } else if (mode = 'CBC') {
        let cipher = crypto.createCipheriv('aes-128-cbc', key, null)
        encrypted = cipher.update(message)
        encrypted = Buffer.concat([encrypted, cipher.final()])
    }
    return encrypted
}

mode = 'ECB'
message = []
for (let i=0; i < 200; i++) {
    message.push('A'.charCodeAt(0))
}
encrypted = encrypt_randomly(Buffer.from(message), mode)
detect_ecb = detect_ecb(Buffer.from(encrypted))
console.assert (mode == 'ECB'? detect_ecb : !detect_ecb)
