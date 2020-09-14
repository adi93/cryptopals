const Srp = function () {

    const crypto = require("crypto")
    const bigint = require("big-integer")
    const N = bigint(0xffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffffn);
    const g = bigint(2);
    const k = bigint(3);
    const I = "adi93@orakem.site"
    const P = "password"

    const server = function () {
        const salt = genRandomInt()
        let xH = sha256(salt.toString() + P)
        let x = bigint(xH, 16)
        let v = g.modPow(x, N)
        const b = bigint.randBetween(0, N)
        b
        const B = k.multiply(v).add(g.modPow(b, N))
        
        const sendToClient = function(client) {
            client.salt = this.salt
            client.B = this.B
        }

        const computeK = function() {
            let uH = sha256(this.A.toString() + this.B.toString())
            let u = bigint(uH, 16)
            b
            let S = (this.A.multiply(v.modPow(u,N))).modPow(b,N)
            S
            let K = sha256(S.toString())
            this.K = K
        }

        return {
            v: v,
            B: B,
            salt: salt,
            sendToClient: sendToClient,
            computeK: computeK
        }
    }

    const client = function () {
        
        const a = bigint.randBetween(0, N)
        const A = g.modPow(a, N)
        const sendToServer = function(server) {
            server.A = bigint(this.A)
        }
        const computeK = function() {
            let uH = sha256(this.A.toString() + this.B.toString())
            let u = bigint(uH, 16)
            let xH = sha256(this.salt.toString() + P)
            let x = bigint(xH, 16)

            // Generate S = (B - k * g**x)**(a + u * x) % N
            let S = (this.B.subtract(k.multiply(g.modPow(x,N)))).modPow(a.add(u.multiply(x)), N)
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
        s
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

console.log(client.K == server.K)


