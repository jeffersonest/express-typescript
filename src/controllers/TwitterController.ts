import { Request, Response } from 'express'
import ErrorListHelper from '../helpers/ErrorListHelper'
import TwitterMentions from '../models/MentionsSchema'

class TwitterController {
  public async index (_req: Request, res: Response): Promise<Response> {
    const data = ErrorListHelper.getError(0)

    const Mention = await TwitterMentions.create({
      messageId: '1189990237474377731',
      createdAt: '2019-10-31T19:39:16.000+00:00',
      text: '@AccentureCenter Filter Online',
      authorId: '1138099951853064192',
      stats: {
        retweetCount: 0,
        replyCount: 0,
        likeCount: 0,
        quoteCount: 0
      },
      lang: 'en',
      possiblySensitive: 'false'
    })

    return res.json(Mention)
  }
}

export default new TwitterController()
