const { Router } = require('express')
const Room = require('../models/Room');
const User = require('../models/User');

const router = Router();

router.post('/create', async (req, res) => {
  const { name, description } = req.body
  const { userId } = req.user
  try {
    const newRoom = await Room.create({ name, description, user: userId})
    const user = await User.findByIdAndUpdate(userId, {$push: { rooms: newRoom._id }})
    res.status(201).json(newRoom)
  } catch (error) {
    res.status(500).json({error: error.message})  
  }
});

router.get('/', async (req, res) => {
  try {
    const allRooms = await Room.find()
    console.log(req.user)
    res.status(200).json(allRooms)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

router.put('/:id/update', async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, { name, description }, {new: true})
    res.status(200).json(updatedRoom)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await Room.findByIdAndDelete(id)
    res.status(204)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

module.exports = router