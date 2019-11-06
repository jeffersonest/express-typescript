import express from 'express'
import cors from 'cors'
import TwitterRoutes from '../src/routes/TwitterRoutes'

// import mongoose from 'mongoose'

class App {
    public express: express.Application
    public constructor () {
      this.express = express()
      this.middlewares()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    // private database (): void {
    //   mongoose.connect('mongodb://', { useNewUrlParser: true })
    // }

    private routes (): void {
      this.express.use(TwitterRoutes)
    }
}

export default new App().express
