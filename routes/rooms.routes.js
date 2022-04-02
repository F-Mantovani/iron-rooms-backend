const { Router } = require('express')
const Room = require('../models/Room');
const User = require('../models/User');

const router = Router();

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const { userId } = req.user;
  try {
    const newRoom = await Room.create({ name, description, user: userId})
    const user = await User.findByIdAndUpdate(userId, {$push: { rooms: newRoom._id }})
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({error: error.message})  
  };
});

router.get('/', async (req, res) => {
  try {
    const allRooms = await Room.find()
    res.status(200).json(allRooms)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  const { userId } = req.user
  try {
    const updatedRoom = await Room.findOneAndUpdate({_id: id, user: userId}, req.body, {new: true})
    if(!updatedRoom){
      const error = new Error
      error.status = 401
      error.message = "You can only edit the rooms you've created"
      throw error
    }
    res.status(200).json(updatedRoom)
  } catch (error) {
    res.status(error.status || 500).json({ Error: error.message })
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = req.user
  try {
    const deleted = await Room.findOneAndDelete({_id: id, user: userId})
    if(!deleted) {
      const error = new Error
      error.status = 401
      error.message = "You can only delete the rooms you've created"
      throw error
    }
    res.status(204).json()
  } catch (error) {
    res.status(error.status || 500).json({error: error.message})
  }
});

router.post('/:id', async (req, res) => {
  
})

module.exports = router