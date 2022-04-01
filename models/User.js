const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: {type: String},
    passwordHash: {type: String},
    email: {
      type: String, 
      required: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      lowercase: true,
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema)