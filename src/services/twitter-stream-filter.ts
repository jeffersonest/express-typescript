/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
const request = require('request')
const util = require('util')
const TwitterMention = require('../../../../models/twitterstreammentions.model')
const Channel = require('../../../../../src/models/channel.model')

const get = util.promisify(request.get)
const post = util.promisify(request.post)

let consumer_key = ''
let consumer_secret = ''
let auth_config = ''

const setConfig = async () => {
  const TwitterInfo = await Channel.findOne({ Name: 'TWITTER' })
  consumer_key = TwitterInfo.Config.Bot.TWITTER_CONSUMER_KEY
  consumer_secret = TwitterInfo.Config.Bot.TWITTER_CONSUMER_SECRET

  auth_config = {
    user: consumer_key,
    pass: consumer_secret
  }
}

const bearerTokenURL = new URL('https://api.twitter.com/oauth2/token')
const rulesURL = new URL('https://api.twitter.com/labs/1/tweets/stream/filter/rules')

const mentionsData = []

module.exports = {
  async bearerToken () {
    await setConfig()

    const requestConfig = {
      url: bearerTokenURL,
      auth: auth_config,
      form: {
        grant_type: 'client_credentials'
      }
    }

    const response = await post(requestConfig)
    return JSON.parse(response.body).access_token
  },

  async getAllRules (token) {
    const requestConfig = {
      url: rulesURL,
      auth: {
        bearer: token
      }
    }

    const response = await get(requestConfig)
    if (response.statusCode !== 200) {
      throw new Error(response.body)
      return null
    }

    return JSON.parse(response.body)
  },

  async deleteAllRules (rules, token) {
    if (!Array.isArray(rules.data)) {
      return null
    }

    const ids = rules.data.map(rule => rule.id)

    const requestConfig = {
      url: rulesURL,
      auth: {
        bearer: token
      },
      json: {
        delete: {
          ids: ids
        }
      }
    }

    const response = await post(requestConfig)
    if (response.statusCode !== 200) {
      throw new Error(JSON.stringify(response.body))
      // eslint-disable-next-line no-unreachable
      return null
    }

    return response.body
  },

  async setRules (rules, token) {
    const requestConfig = {
      url: rulesURL,
      auth: {
        bearer: token
      },
      json: {
        add: rules
      }
    }

    const response = await post(requestConfig)
    if (response.statusCode !== 201) {
      throw new Error(JSON.stringify(response.body))
    }

    return response.body
  },

  streamConnect (token) {
    // Listen to the stream
    const config = {
      url: 'https://api.twitter.com/labs/1/tweets/stream/filter?format=detailed',
      auth: {
        bearer: token
      },
      timeout: 0
    }

    const stream = request.get(config)
    console.log('Connecting...')
    stream.on('data', async (data) => {
      try {
        const json = JSON.parse(data)

        const { id, created_at, text, author_id, stats, lang, possibly_sensitive } = json.data

        const message_id = id

        await TwitterMention.create({ message_id, created_at, text, author_id, stats, lang, possibly_sensitive })
      } catch (e) {
        // console.log(e);
      }
    }).on('error', error => {
      if (error.code === 'ETIMEDOUT') {
        stream.emit('timeout')
      }
    })
    console.log('Connected.')
    return stream
  },

  async start () {
    let token, currentRules
    const rules = [
      { value: 'oi_oficial -grumpy has:mentions', to: 'oi_oficial' },
      { value: 'accenturecenter -grumpy has:mentions', to: 'accenturecenter' },
      { value: 'oi_oficial anatel -grumpy has:mentions', to: 'oi_oficial' }

    ]

    try {
      // Exchange your credentials for a Bearer token
      token = await this.bearerToken({ consumer_key, consumer_secret })
    } catch (e) {
      console.error(`Could not generate a Bearer token. Please check that your credentials are correct and that the Filtered Stream preview is enabled in your Labs dashboard. (${e})`)
      process.exit(-1)
    }

    try {
      // Gets the complete list of rules currently applied to the stream
      currentRules = await this.getAllRules(token)

      // Delete all rules. Comment this line if you want to keep your existing rules.
      await this.deleteAllRules(currentRules, token)

      // Add rules to the stream. Comment this line if you want to keep your existing rules.
      await this.setRules(rules, token)
    } catch (e) {
      console.error(e)
      process.exit(-1)
    }

    // Listen to the stream.
    // This reconnection logic will attempt to reconnect when a disconnection is detected.
    // To avoid rate limites, this logic implements exponential backoff, so the wait time
    // will increase if the client cannot reconnect to the stream.

    const stream = this.streamConnect(token)
    let timeout = 0
    stream.on('timeout', () => {
      // Reconnect on error
      console.warn('A connection error occurred. Reconnecting…')
      setTimeout(() => {
        timeout++
        this.streamConnect(token)
      }, 2 ** timeout)
      this.streamConnect(token)
    })
  },

  mentionsData

}
