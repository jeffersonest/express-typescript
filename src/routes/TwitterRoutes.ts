import { Router } from 'express'
import TwitterController from '../app/controllers/TwitterController'
import JsonWebToken from '../app/middlewares/JwtMiddleware'

const TwitterRoutes = Router()
const Jwt = JsonWebToken

TwitterRoutes.get('/', Jwt.verifyToken, TwitterController.index)

export default TwitterRoutes
