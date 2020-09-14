// challenge 38
const Srp = function () {

    const crypto = require("crypto")
    const bigint = require("big-integer")
    const N = bigint(0xffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffffn);
    const g = bigint(2);
    const k = bigint(3);
    const I = "adi93@orakem.site"
    const P = "pass"

    const server = function () {
        const salt = genRandomInt()
        let xH = sha256(salt.toString() + P)
        let x = bigint(xH, 16)
        let v = g.modPow(x, N)
        const b = bigint.randBetween(1, N.subtract(1))
        const u = bigint.randBetween(1,2**128)
        const B = g.modPow(b, N)
        
        const sendToClient = function(client) {
            client.salt = this.salt
            client.B = this.B
            client.u = this.u
        }

        const computeK = function() {
            let S = (this.A.multiply(v.modPow(u,N))).modPow(b,N)
            let K = sha256(S.toString())
            this.K = K
        }

        return {
            v: v,
            u: u,
            B: B,
            salt: salt,
            sendToClient: sendToClient,
            computeK: computeK
        }
    }

    const client = function () {
        
        const a = bigint.randBetween(1, N.subtract(1))
        const A = g.modPow(a, N)

        const sendToServer = function(server) {
            server.A = bigint(this.A)
        }

        const computeK = function() {
            let xH = sha256(this.salt.toString() + P)
            let x = bigint(xH, 16)
            // Generate S = (B - k * g**x)**(a + u * x) % N
            let S = this.B.modPow(a.add(this.u.multiply(x)), N)
            S
            let K = sha256(S.toString())
            this.K = K

        }
        return {
            A: A,
            sendToServer: sendToServer,
            computeK: computeK
        }
    }

    const genRandomInt = function() {
        return 123
    }

    const sha256 = function (s) {
        let sha256 = crypto.createHash('sha256')
        sha256.update(s)
        return sha256.digest('hex')
    }
    return {
        server: server,
        client: client
    }

}

let srp = Srp()
let server = srp.server()
let client = srp.client()

client.sendToServer(server)
server.sendToClient(client)

server.computeK()
client.computeK()

console.log(server.K == client.K)

function attack() {
    const bigint = require("big-integer")
    const crypto = require("crypto")
    const n = bigint(0xffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffffn);
    const sha256 = function (s) {
        let sha256 = crypto.createHash('sha256')
        sha256.update(s)
        return sha256.digest('hex')
    }
    let passwordFound = false
    possible_passwords.forEach(candidate => {
        let g = bigint(2)
        let client = srp.client()
        let server = {
            salt: "",
            B: bigint(2),
            u: 1,
        }

        client.sendToServer(server)
        
        client.salt = ""
        client.B = bigint(2)
        client.u = bigint(1)

        client.computeK()

        let clientK = client.K
        let x = sha256(candidate) 
        x = bigint(x, 16)
        let v = g.modPow(x,n)
        let A = server.A
        let S = (A.multiply(v)).modPow(1,n)
        let serverK = sha256(S.toString())
        if (serverK == clientK) {
            passwordFound = true
            console.log("Passowrd:", candidate)
            return
        }
    })
    if (passwordFound == false) {
        console.log("Not found")
    }
    
}
let possible_passwords = ["password1", "password", "passe", "password2", "pass"]
attack()

