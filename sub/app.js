const { connect } = require("amqplib")
let ch

// conn rabbit
const connRabbit = async () => {
  try {
    const conn = await connect('amqp://127.0.0.1')
    ch = await conn.createChannel()
    console.log('RabbitMQ started ...')
    await receiveMessage()
  } catch (err) {
    console.warn(err)
  }
}

const receiveMessage = async () => {
  try {
    const q = 'user-messages'
    await ch.assertQueue(q)
    ch.consume(q, msg => {
      if (msg !== '') {
        console.log(msg.content.toString())
        // ch.ack(msg)
        // noAck means act
      }
    })
    // }, { noAck: false })
  } catch (err) {
    console.warn(err)
  }
}

connRabbit()