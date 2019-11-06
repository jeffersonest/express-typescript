import { Request, Response } from 'express'

class TwitterController {
  public async index (_req: Request, res: Response): Promise<Response> {
    const data = {
      mentions: ['um', 'dois']
    }

    return res.json(data)
  }
}

export default new TwitterController()
