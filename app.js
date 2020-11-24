const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to MongoDB...')

mongoose
	.connect(
		config.MONGODB_URI, { 
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		}
	)
	.then(() =>
		logger.info('Successfully connected to MongoDB')
	)
	.catch(error =>
		logger.error('Error connecting to MongoDB:', error)	
	)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
