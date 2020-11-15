const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
	{ 
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
	},
	{ 
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
	},
	{ 
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
	},
	{ 
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
	},
	{ 
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
	}
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

beforeEach(async () => {
	await Blog.deleteMany({})

	for (let blog of initialBlogs) {
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

		expect(res.body).toHaveLength(initialBlogs.length)
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

		const blogsAfterOperation = await blogsInDb()
		const blogTitles = blogsAfterOperation.map(blog => blog.title)

		expect(blogsAfterOperation).toHaveLength(initialBlogs.length + 1)
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

		const blogsAfterOperation = await blogsInDb()
		expect(blogsAfterOperation).toHaveLength(initialBlogs.length)
	})
})

describe('when performing a DELETE request...', () => {
	test('a blog can be deleted', async () => {
		const blogsAtStart = await blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
		
		const blogsAfterOperation = await blogsInDb()
		const blogTitles = blogsAfterOperation.map(blog => blog.title)

		expect(blogTitles).not.toContain(blogToDelete.title)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
