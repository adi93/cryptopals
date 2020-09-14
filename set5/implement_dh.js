// challenge 33
/*
set a variable "p" to 37 and "g" to 5. This algorithm is so easy I'm not even going to explain it. Just do what I do.


Generate "a", a random number mod 37. Now generate "A", which is "g" raised to the "a" power mode 37 --- A = (g**a) % p.

Do the same for "b" and "B".

"A" and "B" are public keys. Generate a session key with them; set "s" to "B" raised to the "a" power mod 37 --- s = (B**a) % p.

Do the same with A**b, check that you come up with the same "s".

To turn "s" into a key, you can just hash it to create 128 bits of key material (or SHA256 it to create a key for encrypting and a key for a MAC). 
*/
const dh = function () {
    const crypto = require("crypto")
    const bigint = require("big-integer")
    const key = function () {
        const p = bigint(0xffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffffn);
        const g = bigint(2n);
        
        let a = bigint.randBetween(0, p)
        let A = g.modPow(a, p)

        let b = bigint.randBetween(0, p)
        let B = g.modPow(b, p) 


        let s = B.modPow(a, p)
        console.log(p.toString(10).length)

        sha256 = crypto.createHash('sha256')
        sha256.update(s.toString(10))
        
        return sha256.digest()
    }
    return {
        key: key
    }
    
}

let a = dh().key() 
a
