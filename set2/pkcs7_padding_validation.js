//challenge 15
function validatePadding(str) {
    if (str.length == 0) return false;  
    if (str.length % 16 != 0) {
        return false;
    }
    let strArr = str.split('').map(ch => ch.charCodeAt('0'))
    let c = strArr[strArr.length-1]
    let count = 1;
    let i;
    for (i=strArr.length-2; i > strArr.length - 1 - c; i-=1) {
        let ch = strArr[i]
        if (ch != c) {
            return false;
        } else {
            count+=1
        }
    }

    if (count != c) {
        return false
    }

    return true
}

a = validatePadding("ICE ICE\x09\x09\x09\x09\x09\x09\x09\x09\x09")
a