//challenge 15
function validatePadding(buff) {
    if (buff.length == 0) return false
    if (buff.length % 16 != 0) {
        return false
    }
    if (typeof(buff) == "string") {
        buff = buff.split('').map(ch => ch.charCodeAt(0))
    }
    let last_byte = buff[-1]
    for (let i=0; i < last_byte; i+=1) {
        if (buff[buff.length-i-1] != last_byte) {
            return false;
        }
    }
    return true
}

a = validatePadding("ICE ICE KISS M\x02\x02")
a