require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const webhookClient = new Discord.WebhookClient(process.env.DISCORD_WEBHOOK_ID, process.env.DISCORD_WEBHOOK_TOKEN)

if (process.env.USE_DISCORD === 'true') {
  client.once('ready', () => {
    console.log('Discord bot ready!')
    webhookClient.send('Lapp dashboard is ready')
  })
  
  client.login(process.env.DISCORD_TOKEN)
}

const sendMessage = (message) => {
  webhookClient.send('Lapp dashboard: ' + message)
  return
}

module.exports = sendMessage