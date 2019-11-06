import express from 'express'
import cors from 'cors'
import TwitterRoutes from '../src/routes/TwitterRoutes'
import mongoose from 'mongoose'

class App {
    public express: express.Application
    public constructor () {
      this.express = express()
      this.database()
      this.middlewares()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private database (): void {
      mongoose.connect('mongodb://localhost:27017/adcc', { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('Database connected...')
    }

    private routes (): void {
      this.express.use(TwitterRoutes)
    }
}

export default new App().express
