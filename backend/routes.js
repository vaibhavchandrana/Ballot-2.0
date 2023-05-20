const express = require("express");
const userController = require("./controllers/userControllers");
const adminController = require("./controllers/adminController");
const router = express.Router();

router
  .post("/registration", userController.registerUser)
  .post("/login", userController.loginUser)
  .get("/user/:email", userController.getProfile)
  .put("/user/:email", userController.editProfile)
  .post("/add_election", adminController.addNewElection)
  .post("/candidates/:candidateId/vote", adminController.addVoteToCandidate)
  .get("/candidates/votes", adminController.getAllVotes)
  .post("/admin/registration", adminController.registerAdmin)
  .post("/admin/login", adminController.loginAdmin);

exports.router = router;
