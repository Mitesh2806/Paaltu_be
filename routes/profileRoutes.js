const express = require("express");
const petCtrl = require("../controllers/pet");
const isAuthenticated = require("../middlewares/isAuth");
const router = express.Router();

// All routes require authentication
router.post("/api/pets/add", isAuthenticated, petCtrl.addPet);
router.get("/api/pets/userPets", isAuthenticated, petCtrl.getUserPets); // New endpoint for user's pets
router.get("/api/pets/allPets", isAuthenticated, petCtrl.getAllPets); // Admin route
router.get("/api/pets/:id", isAuthenticated, petCtrl.getPet);
router.put("/api/pets/:id", isAuthenticated, petCtrl.updatePet); // New route for updating
router.delete("/api/pets/:id", isAuthenticated, petCtrl.deletePet); // New route for deleting

module.exports = router;