// challenge 31
const http = require("http")
const url = require("url")
const generateHash = function() {

}

const sleep = async function(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}

const insecure_compare = function(str1, str2) {
    for (let i=0; i<Math.min(str1.length, str2.length); i+=1) {
        if (str1[i] != str2[i]) return false
        sleep(5000)
    }
    return true
}
const app = http.createServer((req, resp) => {
    let query = url.parse(req.url, true).query;
    console.log(query)
    let file = query.file
    let signature = query.signature

    let fileHash = generateHash(file)

    let hashesAreEqual = insecure_compare(fileHash, signature)

    resp.writeHead(200, {"Content-Type": "text/html"});
    resp.write("Your query is:" + JSON.stringify(query))
    resp.end()
})
app.listen(3000)

