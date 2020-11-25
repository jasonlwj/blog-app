const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
	await Blog.deleteMany({})

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog)
		await blogObject.save()
	}
})

describe('when performing a GET request...', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const res = await api.get('/api/blogs')

		expect(res.body).toHaveLength(helper.initialBlogs.length)
	})

	test('blog has an id property', async () => {
		const res = await api.get('/api/blogs')

		expect(res.body[0].id).toBeDefined()
	})
})

describe('when performing a POST request...', () => {
	test('a valid blog can be added', async () => {
		const newBlog = {
			title: 'React patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/',
			likes: 7
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAfterOperation = await helper.blogsInDb()
		const blogTitles = blogsAfterOperation.map(blog => blog.title)

		expect(blogsAfterOperation).toHaveLength(helper.initialBlogs.length + 1)
		expect(blogTitles).toContain('React patterns')
	})

	test('the \'likes\' property defaults to 0 if not specified', async () => {
		const newBlog = {
			title: 'React patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/'
		}

		const res = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(res.body.likes).toBe(0)
	})

	test('blog without a title and url is not added', async () => {
		const newBlog = {
			author: 'Michael Chan',
			likes: 7
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const blogsAfterOperation = await helper.blogsInDb()
		expect(blogsAfterOperation).toHaveLength(helper.initialBlogs.length)
	})
})

describe('when performing a DELETE request...', () => {
	test('a blog can be deleted', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
		
		const blogsAfterOperation = await helper.blogsInDb()
		const blogTitles = blogsAfterOperation.map(blog => blog.title)

		expect(blogTitles).not.toContain(blogToDelete.title)
	})
})

describe('when performing a PUT request...', () => {
	test('a blog can be updated', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]

		const updatedBlog = {
			likes: 99
		}

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedBlog)
			.expect(200)
		
		const blogAfterOperation = await Blog.findById(blogToUpdate.id)
		expect(blogAfterOperation.likes).toBe(99)
	})

})

afterAll(() => {
	mongoose.connection.close()
})
