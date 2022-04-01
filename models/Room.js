const { Schema, model } = require('mongoose')

const roomSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
  },
  {
    timestamps: true
  }
)

module.exports = model('Room', roomSchema)