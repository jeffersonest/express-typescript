import { Request, Response } from 'express'

class TwitterController {
  public async index (req: Request, res: Response): Promise<Response> {
    const data = {
      mentions: ['um', 'dois']
    }

    return res.json(data)
  }
}

export default new TwitterController()
