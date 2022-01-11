const { Kafka } = require('kafkajs')

const group_id = "hellokafka-group"
const topic = "hellokafka"

const kafka = new Kafka({
    clientId: 'hellokafka',
    brokers: ['localhost:9092']
})



async function produceMessage(topic, message) {
    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
        topic: topic,
        messages: [
            message,
        ],
    })

    await producer.disconnect()

    return message
}

async function consumeTopic(topic) {
    const consumer = kafka.consumer({ groupId: group_id })

    await consumer.connect()
    await consumer.subscribe({ topic: topic, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            })
        },
    })
}

produceMessage(topic, { value: "Hello"}).then((result) => { console.log("Produced message: " + result.value)})
produceMessage(topic, { value: "Goodbye"}).then((result) => { console.log("Produced message: " + result.value)})
consumeTopic(topic).then(() => { console.log("Messages consumed")})
