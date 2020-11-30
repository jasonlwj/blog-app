const Blog = require('../../models/blog')
const User = require('../../models/user')

const initialBlogs = [
	{ 
		title: 'Canonical string reduction',
		author: 'edijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
	},
	{ 
		title: 'First class tests',
		author: 'rmartin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
	},
	{ 
		title: 'TDD harms architecture',
		author: 'rmartin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
	},
	{ 
		title: 'Type wars',
		author: 'rmartin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
	}
]

const initialUsers = [
	{
		username: 'edijkstra',
		name: 'Edsger W. Dijkstra',
		password: 'sekret'
	},
	{
		username: 'rmartin',
		name: 'Robert C. Martin',
		password: 'sekret'
	}
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = {
	initialBlogs,
	initialUsers,
	blogsInDb,
	usersInDb
}