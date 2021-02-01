/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express'
import ErrorListHelper from '../../helpers/ErrorListHelper'
import Twitter from '../models/MentionModel'

class TwitterController {
  public async index (_req: Request, res: Response): Promise<Response> {
    const data = ErrorListHelper.getError(0)

    const Mention = await Twitter.create({
      message_id: '1189990237474377731',
      created_at: '2019-10-31T19:39:16.000+00:00',
      text: '@jeffersonest Filter Online',
      author_id: 'xxxxxsample',
      stats: {
        retweet_count: 0,
        reply_count: 0,
        like_count: 0,
        quote_count: 0
      },
      lang: 'en',
      possibly_sensitive: 'false'
    })

    return res.json(Mention)
  }
}

export default new TwitterController()
