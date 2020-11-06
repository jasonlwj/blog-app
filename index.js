// const http = require('http')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

logger.info('Connecting to MongoDB...')

mongoose
	.connect(
		process.env.MONGODB_URI, { 
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

app.get('/api/blogs', (request, response) => {
	Blog
		.find({})
		.then(blogs => {
			response.json(blogs)
		})
})

app.post('/api/blogs', (request, response) => {
	const blog = new Blog(request.body)

	blog
		.save()
		.then(result => {
			response.status(201).json(result)
		})
})

app.listen(process.env.PORT, () => {
	logger.info(`Server running on port ${process.env.PORT}`)
})
