const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
	const body = req.body

	const user = await User.findOne({ username: body.username })

	const passwordCorect = (!user)
		? false
		: await bcrypt.compare(body.password, user.passwordHash)

	if (!passwordCorect)
		return res
			.status(401)
			.json({ error: 'invalid username or password' })

	const userPayloadForToken = {
		username: user.username,
		id: user.id
	}

	const token = jwt.sign(userPayloadForToken, process.env.SECRET)

	res
		.status(200)
		.send({ token: token, username: user.username, name: user.name })
})

module.exports = loginRouter
