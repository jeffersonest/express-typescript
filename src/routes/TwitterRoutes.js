import { Router } from 'express'
import TwitterController from '../controllers/TwitterController'

const TwitterRoutes = Router()

TwitterRoutes.get('/', TwitterController.index)

export default TwitterRoutes
