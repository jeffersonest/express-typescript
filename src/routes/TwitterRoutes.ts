import { Router } from 'express'
import TwitterController from '../controllers/TwitterController'
import JsonWebToken from '../middlewares/JwtMiddleware'

const TwitterRoutes = Router()
const Jwt = JsonWebToken

TwitterRoutes.get('/', Jwt.verifyToken, TwitterController.index)

export default TwitterRoutes
