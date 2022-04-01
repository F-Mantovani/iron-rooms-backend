import {config} from 'dotenv'
import express from 'express'
import cors from 'cors'
import connect from './config/db.config.js'

config()
connect()
const server = express()
server.use(express.json())
server.use(cors())



server.listen(process.env.PORT, () => {console.log(`Server running on ${process.env.PORT}`)})