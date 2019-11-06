import { Request, Response } from 'express'
import ErrorListHelper from '../helpers/ErrorListHelper'

class TwitterController {
  public async index (_req: Request, res: Response): Promise<Response> {
    const data = ErrorListHelper.getError(0)

    return res.json(data)
  }
}

export default new TwitterController()
