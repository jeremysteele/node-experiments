const express = require("express")
const redis = require("redis")

const app = express()
const port = 3000

const client = redis.createClient({host: "localhost"})
client.on('error', err => {
    console.log('Error ' + err);
});

client.connect().catch((error) => {
    console.log("Connect error: " + error)
})

app.get('/', async (req, res) => {
    await client.set("bla", req.query.bla).then(() => {
        console.log("Var set")
    }).catch((error) => {
        console.log("Error: " + error)
    })

    res.send('Value saved' + req.query.bla)
})

app.get('/get',async (req, res) => {
    let response = ""

    await client.get("bla").then((result) => {
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