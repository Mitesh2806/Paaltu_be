const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, sparse:true},
    age: { type: String, required: true },
    sex: { type: String, required: true },
    weight: { type: String, required: true },
    breed: { type: String, required: true },
    about: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//Compile to form the model
module.exports = mongoose.model("Pet", petSchema);