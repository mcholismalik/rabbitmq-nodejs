const express = require('express')
const { connect } = require("amqplib")

const app = express()
const port = 3000
let ch

// conn rabbit
const connRabbit = async () => {
  try {
    const conn = await connect('amqp://127.0.0.1')
    ch = await conn.createChannel()
    console.log('RabbitMQ started ...')
    return ch
  } catch (err) {
    console.warn(err)
  }
}

const sendMessage = async (msg, q) => {
  try {
    msg = JSON.stringify(msg)
    await ch.assertQueue(q)
    await ch.sendToQueue(q, Buffer.from(msg))
    console.log('Message sent success ...')
    console.log(msg)
  } catch (err) {
    console.warn(err)
  }
}

// routes
app.get('/', async (req, res) => {
  let q = 'user-messages'
  // let msg = {
  //   vendor_id: 1,
  //   account_name: 'malik',
  //   account_number: 12983
  // }
  for (let i = 0; i < 6; i++) {
    let msg = `Pesan ke ${i}`
    await sendMessage(msg, q)
  }
  res.send('Send success ...')
})


// listen
app.listen(port, async () => {
  console.log(`Publisher app listening on port ${port}!`)
  await connRabbit()
})


