const { Router } = require('express');

const User = require('../models/User');
const Reviews = require('../models/Reviews');
const Room = require('../models/Room');

const router = Router();

router.post('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = req.user
  try {
    const reviewRoom = await Room.find({_id: id, user: {$ne: userId}})
    if(!reviewRoom.length) {
      const error = new Error
      error.status = 401
      error.message = "You cannot review your own room"
      throw error
    }
    const newReview = await Reviews.create({...req.body, user: userId })
    const updatedRoom = await Room.findByIdAndUpdate(id, {$push: {reviews: newReview._id}}, {new: true}).populate('reviews')
    res.status(200).json(updatedRoom)
  } catch (error) {
    res.status(error.status || 500).json({ Error: error.message })
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = req.user
  try {
    const review = await Reviews.findOne({_id:  id, user: userId})
    if(!review) {
      const error = new Error
      error.status = 401
      error.message = "You cannot delete other's reviews"
      throw error
    }
    const roomUpdate = await Room.findOneAndUpdate({ reviews: id }, {$pull: { reviews: id }})
    await review.delete()
    res.status(200).json(roomUpdate)
  } catch (error) {
    res.status(error.status || 500).json({ Error: error.message })
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const{ userId } = req.user
  try {
    const review = await Reviews.findOneAndUpdate({_id: id, user: userId}, req.body, { new: true})
    if(!review) {
      const error = new Error
      error.status = 401
      error.message = "You cannot update other's review"
      throw error
    }
    res.status(200).json(review)
  } catch (error) {
    res.status(error.status || 500).json({Error: error.message})
  }
});

module.exports = router;