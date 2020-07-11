// challenge 17 
let crypto = require("crypto")
let underscorejs = require("underscore")
const underscore = require("underscore")
class oracle {
    constructor() {
        this.randomStrings = [
            "YELLOW SUBMARINEYELLOW SUBMARINEYELLOW SUBMO", // length 44
            "MDAwMDAwTm93IHRoYXQgdGhlIHBhcnR5IGlzIGp1bXBpbmc=",
            "MDAwMDAxV2l0aCB0aGUgYmFzcyBraWNrZWQgaW4gYW5kIHRoZSBWZWdhJ3MgYXJlIHB1bXBpbic=",
            "MDAwMDAyUXVpY2sgdG8gdGhlIHBvaW50LCB0byB0aGUgcG9pbnQsIG5vIGZha2luZw==",
            "MDAwMDAzQ29va2luZyBNQydzIGxpa2UgYSBwb3VuZCBvZiBiYWNvbg==",
            "MDAwMDA0QnVybmluZyAnZW0sIGlmIHlvdSBhaW4ndCBxdWljayBhbmQgbmltYmxl",
            "MDAwMDA1SSBnbyBjcmF6eSB3aGVuIEkgaGVhciBhIGN5bWJhbA==",
            "MDAwMDA2QW5kIGEgaGlnaCBoYXQgd2l0aCBhIHNvdXBlZCB1cCB0ZW1wbw==",
            "MDAwMDA3SSdtIG9uIGEgcm9sbCwgaXQncyB0aW1lIHRvIGdvIHNvbG8=",
            "MDAwMDA4b2xsaW4nIGluIG15IGZpdmUgcG9pbnQgb2g=",
            "MDAwMDA5aXRoIG15IHJhZy10b3AgZG93biBzbyBteSBoYWlyIGNhbiBibG93"]
        this.iv = String.fromCharCode.apply(null, Array(16).fill(0))
    }
    encrypt(choice, mode) {
        this.key = this.key || this.generateRandomKey(mode)
        if (choice == undefined) {
            choice = underscorejs.random(this.randomStrings.length - 1)
        }
        let chosenString = this.randomStrings[choice]
        let chosenArr = this.padBlock(chosenString, 16)
        let cll = chosenArr.length
        cll
        return [this.encrypt_cbc(chosenArr, this.key, this.iv), this.iv]

    }

    encrypt_cbc(arr, key, iv) {
        let a = key.length
        let cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
        cipher.setAutoPadding(false)
        let encrypted = cipher.update(Buffer.from(arr))
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return Array.from(encrypted)
    }

    isValid(cipherText) {
        let decrypted_buff = this.decrypt_cbc(cipherText, this.key, this.iv)
        let validString = this.validatePadding(decrypted_buff)
        return validString
    }

    decrypt_cbc(arr, key, iv) {
        let buff = Buffer.from(arr)
        console.assert(buff.length % 16 == 0, "Buffer length should be a buffer of 16")
        let block_size = key.length
        let prev_xor = iv;
        let decrypted_buff = []
        let decipher = crypto.createDecipheriv('aes-128-ecb', key, null)
        decipher.setAutoPadding(false);
        for (let i = 0; i < buff.length; i += block_size) {
            let current_block = buff.slice(i, i + block_size)
            let decrypted = decipher.update(current_block)
            let xored = this.xor(prev_xor, decrypted)
            for (let j = 0; j < xored.length; j += 1) {
                decrypted_buff.push(xored[j])
            }
            prev_xor = current_block
        }

        return decrypted_buff
    }

    xor(buf1, str) {
        let ans = []
        for (let i = 0; i < buf1.length; i++) {
            ans.push(buf1[i] ^ str[i])
        }
        return ans
    }

    validatePadding(buff) {
        if (buff.length == 0) return false
        if (buff.length % 16 != 0) {
            return false
        }
        if (typeof (buff) == "string") {
            buff = buff.split('').map(ch => ch.charCodeAt(0))
        }
        let last_byte = buff[buff.length - 1]
        for (let i = 0; i < last_byte; i += 1) {
            if (buff[buff.length - i - 1] != last_byte) {
                return false;
            }
        }
        return true
    }


    generateRandomKey(mode) {
        if (mode) {
            return "ABCDEFGHIJKLMNOP"
        }
        let str = ''
        for (let i = 0; i < 16; i += 1) {
            let c = underscorejs.random(32, 126)
            str += String.fromCharCode(c)
        }
        return str
    }

    padBlock(input, block_length) {
        let block = Array.from(Buffer.from(input))
        if (input.length % block_length == 0) return block

        let remainder = block.length - block_length
        if (remainder <= 0) {
            remainder = -remainder
        } else {
            remainder = block_length - remainder % block_length
        }
        let padding_char = remainder;
        for (var i = 0; i < remainder; i++) {
            block.push(padding_char)
        }
        return block
    }
}

function getPaddingLength(encrypted, blockSize) {
    blockSize = blockSize || 16
    for (let i = 1; i <= blockSize; i += 1) {
        let index = encrypted.length - (i + blockSize)
        let c = encrypted[index]
        encrypted[index] = 128
        if (o.isValid(encrypted)) {
            return i - 1
        }
        encrypted[index] = c
    }
    return 0
}

function decrypt(oracle, encrypted, paddingByte, blockSize) {
    blockSize = blockSize || 16
    let blockNum =  (encrypted.length / blockSize) - 1
    let plainText = ''
    while (blockNum >= 0) {
        let pt = decryptCurrentBlock(oracle, encrypted, blockNum, blockSize, paddingByte)
        blockNum -= 1
        plainText = Buffer.from(pt).toString() + plainText
        paddingByte = 0
    }
    return plainText

    function decryptCurrentBlock(oracle, encrypted, blockNum, blockSize, paddingByte) {

        let prevBlockEnd = blockNum * blockSize
        let prevBlockStart = blockNum * blockSize - blockSize
        let e2 = undefined;

        e2 = Array(blockSize).fill(NaN)
        for (let i = 1; i <= paddingByte; i += 1) {
            e2[blockSize - i] = encrypted[prevBlockEnd - i] ^ paddingByte
        }
        let currentByte = paddingByte + 1
        // we have to fill e2
        while (currentByte <= blockSize) {
            let prevBlock = undefined;
            if (prevBlockEnd <= 0) {
                // the first block, handle that using iv
                prevBlock = oracle.iv
            } else {
                prevBlock = encrypted.slice(prevBlockStart, prevBlockEnd)
                // set mask on previous block
            }
            for (let i = 1; i < currentByte; i += 1) {
                prevBlock[blockSize - i] = e2[blockSize - i] ^ currentByte
            }
    
            
            
            // cycle through bytes
            if (prevBlockEnd <= 0) {
                tempEncrypted = encrypted.slice(0,blockSize)
            } else {
                tempEncrypted = encrypted.slice(0, prevBlockStart).concat(prevBlock).concat(encrypted.slice(prevBlockEnd))
            }
            let index = tempEncrypted.length - blockSize - currentByte
            for (let i = 0; i < 256; i += 1) {
                tempEncrypted[index] = i
                if (oracle.isValid(tempEncrypted)) {
                    e2[blockSize - currentByte] = i ^ currentByte
                    break;
                }
            }
            currentByte += 1
        }

        let plainText = Array(blockSize).fill(NaN)
        for (let i = 0; i < blockSize; i += 1) {
            plainText[i] = encrypted[prevBlockStart + i] ^ e2[i]
        }
        return plainText
    }

}

function betterDecrypt(oracle, encrypted) {
    let paddingByte = getPaddingLength(encrypted)
    knownBytes = []
    for (let i=0; i <paddingByte; i+=1) {
        knownBytes.push(paddingByte)
    }
    while (knownBytes.length < encrypted.length) {
        newByte = recoverOneMoreByte(oracle, encrypted, knownBytes)
        knownBytes = [newByte].concat(knownBytes)
    }
    return knownBytes

    function recoverOneMoreByte(oracle, encrypted, knownBytes) {
        let numBlocksToDrop = knownBytes.length / 16
        let targetByteIndex = encrypted.length - (knownBytes.length % 16) - 1 
    }
}

o = new oracle()
let encrypted_obj = o.encrypt(5, true)
let encrypted = encrypted_obj[0]
let el = encrypted.length
el
encrypted
// this challenge is why they say to never roll your own crypto
let paddingByte = getPaddingLength(encrypted)
// now the fun begins, gonna crack open this guy
console.log(decrypt(o, encrypted, paddingByte, 16))