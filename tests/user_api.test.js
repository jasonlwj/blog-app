const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./helpers/test_helper')

describe('when creating a new user', () => {
	beforeEach(async() => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({
			username: 'root',
			passwordHash
		})

		await user.save()
	})

	test('creation succeeds with valid username, name and password', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen'
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernamesAtEnd = usersAtEnd.map(user => user.username)
		expect(usernamesAtEnd).toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username missing', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			name: 'Matti Luukkainen',
			password: 'salainen'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('`username` is required')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

		const usernamesAtEnd = usersAtEnd.map(user => user.username)
		expect(usernamesAtEnd).not.toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username less than 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'ml',
			name: 'Matti Luukkainen',
			password: 'salainen'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain(`\`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3)`)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

		const usernamesAtEnd = usersAtEnd.map(user => user.username)
		expect(usernamesAtEnd).not.toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			password: 'sekret'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('`username` to be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test('creation fails with proper statuscode and message if password missing', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('missing password')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

		const usernamesAtEnd = usersAtEnd.map(user => user.username)
		expect(usernamesAtEnd).not.toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if password less than 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'sa'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('password must be at least 3 characters long')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

		const usernamesAtEnd = usersAtEnd.map(user => user.username)
		expect(usernamesAtEnd).not.toContain(newUser.username)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
