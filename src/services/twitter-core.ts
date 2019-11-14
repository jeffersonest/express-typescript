/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable node/no-deprecated-api */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
import TwitterMention from '../app/models/MentionModel'
import Channel from '../app/models/ChannelModel'
import axios from 'axios'
import qs from 'query-string'
import request from 'request'
import util from 'util'
import ErrnoException from '../interfaces/IError'
import Twit from 'twit'

class TwitterCore {
  public Twit: any;
  private get = util.promisify(request.get);
  private post = util.promisify(request.post);
  public TWITTER_CONSUMER_KEY = ' '
  public TWITTER_CONSUMER_SECRET = ' '
  public TWITTER_ACCESS_TOKEN = ' '
  public TWITTER_ACCESS_TOKEN_SECRET = ' '
  public TWITTER_BEARER_TOKEN = ' '
  protected TWITTER_STREAM_URL = 'https://api.twitter.com/labs/1/tweets/stream/filter?format=detailed'
  protected TWITTER_RULES_URL = 'https://api.twitter.com/labs/1/tweets/stream/filter/rules'
  protected TWITTER_OAUTH_URL = 'https://api.twitter.com/oauth2/token'

  // Important:
  // For use methods use mountServices() and call what you want, like: T.mountServices(); T.sendMessage(...); for initialize tokens
  async mountServices (): Promise<void> {
    // get Twitter Consts from database
    try {
      const TwitterInfo: any = await Channel.findOne({ Name: 'TWITTER' })

      this.TWITTER_CONSUMER_KEY = TwitterInfo.Config.Bot.TWITTER_CONSUMER_KEY
      this.TWITTER_CONSUMER_SECRET = TwitterInfo.Config.Bot.TWITTER_CONSUMER_SECRET
      this.TWITTER_ACCESS_TOKEN = TwitterInfo.Config.Bot.TWITTER_ACCESS_TOKEN
      this.TWITTER_ACCESS_TOKEN_SECRET = TwitterInfo.Config.Bot.TWITTER_ACCESS_TOKEN_SECRET

      // Prepair credential to send a request for get a Bearer Token
      const credentials = `${this.TWITTER_CONSUMER_KEY}:${this.TWITTER_CONSUMER_SECRET}`
      const credentialsBase64Encoded = new Buffer(credentials).toString('base64')

      const requestBody = {
        grant_type: 'client_credentials'
      }

      const url = this.TWITTER_OAUTH_URL

      const axiosConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          // eslint-disable-next-line quote-props
          Authorization: `Basic ${credentialsBase64Encoded}`
        }
      }

      // Send Request to get twitter Bearer Token
      const body = await axios.post(url, qs.stringify(requestBody), axiosConfig)

      this.TWITTER_BEARER_TOKEN = body.data.access_token

      // Setup TWITTER API
      this.Twit = new Twit({
        consumer_key: this.TWITTER_CONSUMER_KEY,
        consumer_secret: this.TWITTER_CONSUMER_SECRET,
        access_token: this.TWITTER_ACCESS_TOKEN,
        access_token_secret: this.TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true // optional - requires SSL certificates to be valid.
      })
    } catch (error) {
      throw new Error('Problem to generate new Token')
    }
  }

  async setRules (rules: any): Promise<request.Response> {
    const requestConfig = {
      url: this.TWITTER_RULES_URL,
      auth: {
        bearer: this.TWITTER_BEARER_TOKEN
      },
      json: {
        add: rules
      }
    }
    const response = await this.post(requestConfig)
    if (response.statusCode !== 201) {
      throw new Error(JSON.stringify(response.body))
    }
    return response.body
  }

  async deleteAllRules (rules: any): Promise<request.Response> {
    const ids = rules.data.map((rule: { id: any }) => rule.id)

    const requestConfig = {
      url: this.TWITTER_RULES_URL,
      auth: {
        bearer: this.TWITTER_BEARER_TOKEN
      },
      json: {
        delete: {
          ids: ids
        }
      }
    }

    const response = await this.post(requestConfig)
    if (response.statusCode !== 200) {
      throw new Error(JSON.stringify(response.body))
    }

    return response.body
  }

  async getAllRules (): Promise<request.Response> {
    const requestConfig = {
      url: this.TWITTER_RULES_URL,
      auth: {
        bearer: this.TWITTER_BEARER_TOKEN
      }
    }

    const response = await this.get(requestConfig)
    if (response.statusCode !== 200) {
      throw new Error(response.body)
    }

    return JSON.parse(response.body)
  }

  public startStream (): request.Request {
    // Listen to the stream
    const config = {
      url: this.TWITTER_STREAM_URL,
      auth: {
        bearer: this.TWITTER_BEARER_TOKEN
      },
      timeout: 0
    }

    const stream = request.get(config)
    console.log('Connecting...')
    stream.on('data', async (data: any) => {
      try {
        const json = JSON.parse(data)
        console.log(json)
        const { id, created_at, text, author_id, stats, lang, possibly_sensitive } = json.data

        const message_id = id
        // save  Mention Data on database
        const DB = await TwitterMention.create({ message_id, created_at, text, author_id, stats, lang, possibly_sensitive })

        await this.sendMessage(author_id, 'Vi que está tendo problemas, você poderia me falar um pouco mais sobre o seu problema?')

        console.log('Created: ', DB)
      } catch (e) {
        // console.log(e) commented for exclude json parse twitter errors
      }
    }).on('error', (error: ErrnoException) => {
      if (error.code === 'ETIMEDOUT') {
        stream.emit('timeout')
      }
    })
    console.log('Connected.')
    return stream
  }

  public async start (): Promise<void> {
    try {
      const rules = [
      // { value: 'oi_oficial -grumpy has:mentions', to: 'oi_oficial' },
        { value: 'accenturecenter -grumpy has:mentions', to: 'accenturecenter' }
      // { value: 'oi_oficial anatel -grumpy has:mentions', to: 'oi_oficial' }
      ]
      const currentRules = await this.getAllRules()
      this.deleteAllRules(currentRules)
      this.setRules(rules)
      this.startStream()
    } catch (error) {
      console.log(error)
    }
  }

  public async sendMessage (userId: string, message: string): Promise<any> {
    try {
      const data = {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id: userId
            },
            message_data: { text: message }
          }
        }
      }

      const res = await this.Twit.post('direct_messages/events/new', data)
    } catch (error) {
      console.log(error)
    }
  }
}

export default new TwitterCore()
