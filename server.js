require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db.config.js')

connectDB()
const server = express()
server.use(express.json())
server.use(cors())

server.use('/auth', require('./routes/auth.routes'))

server.use(require('./middlewares/auth.middleware'))
server.use('/rooms', require('./routes/rooms.routes.js'))
server.use('/reviews', require('./routes/reviews.routes'))

server.listen(process.env.PORT, () => {console.log(`Server running on ${process.env.PORT}`)})