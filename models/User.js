const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    email: { type: String, required: true, sparse:true},
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//Compile to form the model
module.exports = mongoose.model("User", userSchema);