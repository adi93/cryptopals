crypto = require("crypto")
function createProfile(str) {
    if (!new.target) {
        return new createProfile(str);
    }
    list = str.split("&")
    for (let l in list) {
        kv = list[l].split("=")
        let k = kv[0]
        let v = kv[1]
        this[k] = v
    }
}

const key = crypto.randomBytes(16)

function encrypt_aes_128(message) {
    let cipher = crypto.createCipheriv('aes-128-ecb', key, null)

    encrypted = cipher.update(message)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    return encrypted
}

function decrypt_aes_128(message_buff) {
    let cipher = crypto.createDecipheriv('aes-128-ecb', key, null)
    let decrypted = cipher.update(message_buff)
    decrypted += cipher.final()
    return decrypted.toString()
}



function profile_for(email_string) {
    let sanitized_email = sanitize_email(email_string)
    let profile = createProfile("email=" + sanitized_email)
    profile.uid = 10
    profile.user = "user"
    encoded_profile = encode(profile)
    let encrypted_profile = encrypt_aes_128(Buffer.from(encoded_profile))
    return encrypted_profile
}

function sanitize_email(email_str) {
    return email_str.replace("&", "").replace("=", "")
}

function encode(profile_object) {
    str = ''
    for (let k in profile_object) {
        if (str != '') {
            str += '&'
        }
        str += k + '=' + profile_object[k]
    }
    return str
}


let first_encrypted_profile = profile_for("adi93@uci.edu") // Lol, This worked by chance, as this has exactly 
let second_profile = Buffer.concat([Buffer.from(Array(10).fill(10)), Buffer.from("admin"), Buffer.from(Array(11).fill(11))])
let second_encrypted_profile = profile_for(second_profile.toString())

let x = decrypt_aes_128(Buffer.concat([first_encrypted_profile.slice(0, 32), second_encrypted_profile.slice(16, 32)]))

console.log(x)