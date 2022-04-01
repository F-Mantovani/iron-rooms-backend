const { Router } = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')

const router = Router()

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userFromDB = await User.findOne({ email });
    if(userFromDB) {
      const error = new Error
      error.status = 400
      error.message = "User already exists"
      throw error
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name, 
      email,
      passwordHash
    })
    const userCreated = {
      name: newUser.name,
      email: newUser.email,
    }
    res.status(201).json(userCreated)
  } catch (error) {
    res.status(error.status || 500).json({error: error.message})
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const userFromDB = await User.findOne({ email })
    if(!userFromDB){
      const error = new Error
      error.status = 401
      error.message = "Email and/or password invalid"
      throw error
    }
    const verifyPassword = await bcrypt.compare(password, userFromDB.passwordHash)
    if(!verifyPassword){
      const error = new Error
      error.status = 401
      error.message = "Email and/or password invalid"
      throw error
    }
    const payload = { email, name: userFromDB.name, userId: userFromDB._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1day"})
    res.status(200).json({ token, payload })
  } catch (error) {
    res.status(error.status || 500).json({error: error.message})
  }
})

module.exports = router