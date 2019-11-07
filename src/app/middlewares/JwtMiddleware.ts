import jsonwebtoken from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

class JWT {
    public JsonWebToken = jsonwebtoken

    public async verifyToken (req: Request, _res: Response, next: NextFunction): Promise<void> {
      req.body.userId = 'TOKEN ASOKASPSAOK'
      console.log('TOKEN OK', req.body)
      next()
    }
}

export default new JWT()
