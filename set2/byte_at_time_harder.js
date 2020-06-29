// Challenge 14
crypto = require("crypto")
function generate_random_bytes(size) {
    return Array.from(crypto.randomBytes(size))
}

function generateRandomNumber(min, max) {
    if (min == undefined) {
        min = 5
    }
    if (max == undefined) {
        max = 32 
    }
    return Math.floor((Math.random() * (max-min)) + min); 
}

class oracle {
    constructor(key, unknown_arr, mode) {
        this.known_string = []
        if (typeof(unknown_arr) == "string") {
            unknown_arr = Buffer.from(unknown_arr)
        }
        this.unknown_arr = unknown_arr
        this.key = key
        for (let i=0; i<50; i++) {
            this.known_string.push(1)
        }
        this.mode = mode
        if (mode == 'SAME_LENGTH') {
            this.prefix_length = generateRandomNumber()
        }
        if (mode == 'SAME_KEY') {
            this.prefix_length = generateRandomNumber()
            this.random_prefix = generate_random_bytes(this.prefix_length)
        }
        this.block_size = 16
        
    }

    getPrefix() {
        if (this.mode == 'NEW') {
            return generate_random_bytes(generateRandomNumber())
        } else if (this.mode == 'SAME_LENGTH') {
            return generate_random_bytes(this.prefix_length)
        } else {
            return this.random_prefix
        }
    }

    encrypt_ecb = function(known) {
        let known_buff = Buffer.from(this.pad_block(known, this.block_size))
        let cipher = crypto.createCipheriv('aes-128-ecb', this.key, null)
        let encrypted = cipher.update(known_buff)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return Array.from(encrypted)
    }

    encrypt = function(known_arr) {
        let random_prefix = this.getPrefix()
        let net_arr = random_prefix.concat(known_arr).concat(this.unknown_arr)
        return this.encrypt_ecb(net_arr, this.key)
    }

    pad_block(block, block_length) {
        let remainder = block.length - block_length
        if (remainder <= 0) {
            remainder = -remainder
        } else {
            remainder = block_length - remainder % block_length
        }
        let padding_char = remainder;
        for (var i=0; i< remainder; i++) {
            block.push(padding_char)
        }
        return block
    }
}

o = new oracle("AAAAAAAAAAAAAAAA", [], 'x')
a = o.encrypt("Hello World".split('').map(c => c.charCodeAt(0)))
a


console.log(a.length)