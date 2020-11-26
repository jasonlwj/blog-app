const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog
		.find({})
		.populate('author', { username: 1, name: 1 })

	res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
	const body = req.body
	const decodedToken = jwt.verify(req.token, process.env.SECRET)

	if (!req.token || !decodedToken.id) 
		return res
			.status(401)
			.json({ error: 'missing or invalid token' })
			
	const user = await User.findById(decodedToken.id)
	
	if (!body.title || !body.url)
		return res
			.status(400)
			.json({ error: 'title/url missing' })

	const blog = new Blog({
		title: body.title,
		author: user.id,
		url: body.url,
		likes: body.likes || 0
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog.id)
	await user.save()

	res
		.status(201)
		.json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
	const body = req.body
	
	const blog = {
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
	res.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

module.exports = blogsRouter
