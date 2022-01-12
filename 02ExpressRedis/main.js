const express = require("express")
const redis = require("redis")
const {response} = require("express");

const client = redis.createClient({host: "localhost"})
client.on("error", err => {
    console.log("Error: " + err);
});

client.connect().catch((error) => {
    console.log("Connect error: " + error)
    process.exit(1)
})

const app = express()
const port = 3000

async function RedisTimeout(timeoutMs, redisCall) {
    return new Promise((resolve, reject) => {
        var timer = setTimeout(() => {
            reject("Timeout error")
        }, timeoutMs)

        redisCall().then((result) => {
            resolve(result)
            clearTimeout(timer)
        }).catch((error) => {
            reject(error)
            clearTimeout(timer)
        })
    })
}

app.get("/", async (req, res) => {
    let response = ""

    await RedisTimeout(2000, () => {
        return client.set("bla", req.query.bla)
    }).then((result) => {
        response = "Value saved" + req.query.bla
    }).catch((error) => {
        console.log("Error: " + error)
        response = "Error encountered: " + error
    })

    res.send(response)
})

app.get("/get",async (req, res) => {
    let response = ""

    await RedisTimeout(2000, () => {
        return client.get("bla")
    }).then((result) => {
        response = "The secret var is: " + result
    }).catch((error) => {
        console.log("Get error: " + error)
        response = "Error while fetching super-secret var"
    })

    res.send(response)
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})