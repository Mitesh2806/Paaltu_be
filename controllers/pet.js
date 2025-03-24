const Pet = require("../models/Pet");

const petCtrl = {
  // Add a pet with the authenticated user as owner
  addPet: async (req, res) => {
    try {
      const { name, age, sex, weight, breed, about, image } = req.body;
      
      // Get the user ID from the authenticated request
      const userId = req.user.id;
      
      const pet = await Pet.create({
        name,
        age,
        sex,
        weight,
        breed,
        about,
        image,
        owner: userId, // Set the owner to the authenticated user
      });
      
      res.status(201).json(pet);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error adding pet", error: err.message });
    }
  },
  
  // Get all pets (admin function)
  getAllPets: async (req, res) => {
    try {
      const pets = await Pet.find().populate("owner", "username email");
      res.json(pets);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching pets", error: err.message });
    }
  },
  
  // Get pets belonging to the authenticated user
  getUserPets: async (req, res) => {
    try {
      const userId = req.user.id;
      const pets = await Pet.find({ owner: userId });
      res.json(pets);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching your pets", error: err.message });
    }
  },
  
  // Get a single pet by ID (with owner validation)
  getPet: async (req, res) => {
    try {
      const { id } = req.params;
      const pet = await Pet.findById(id);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // If you want to ensure users can only access their own pets
      // Uncomment the following block
      /*
      if (pet.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to access this pet" });
      }
      */
      
      res.json(pet);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching pet", error: err.message });
    }
  },
  
  // Update a pet (owner validation)
  updatePet: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const pet = await Pet.findById(id);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Ensure users can only update their own pets
      if (pet.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this pet" });
      }
      
      const updatedPet = await Pet.findByIdAndUpdate(id, updates, { new: true });
      res.json(updatedPet);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error updating pet", error: err.message });
    }
  },
  
  // Delete a pet (owner validation)
  deletePet: async (req, res) => {
    try {
      const { id } = req.params;
      const pet = await Pet.findById(id);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Ensure users can only delete their own pets
      if (pet.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this pet" });
      }
      
      await Pet.findByIdAndDelete(id);
      res.json({ message: "Pet deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error deleting pet", error: err.message });
    }
  }
};

module.exports = petCtrl;
