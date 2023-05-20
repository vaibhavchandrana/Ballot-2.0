const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas");
const { Candidate } = require("../schemas");
const { Election } = require("../schemas");
const { Admin } = require("../schemas");
require("dotenv").config();

// User registration endpoint
exports.registerAdmin = async (req, res) => {
  try {
    const { email, name, phone, age, password } = req.body;

    // Check if user already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new Admin({
      email,
      name,
      phone,
      age,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User login endpoint
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user details endpoint
exports.addNewElection = async (req, res) => {
  try {
    // Extract the data from the request body
    const { url, adminEmail } = req.body;

    // Check if the URL already exists in the database
    const existingElection = await Election.findOne({ url });

    if (existingElection) {
      return res.status(400).json({ message: "URL already exists" });
    }

    // Find the admin using the admin email
    const admin = await Admin.findOne({ email: adminEmail });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Create a new election object with empty candidates array
    const newElection = new Election({
      url,
      candidates: [],
      admin: admin._id, // Assign the admin's ID to the election
    });

    // Save the new election to the database
    const savedElection = await newElection.save();

    res.status(201).json(savedElection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add new election" });
  }
};

// POST /api/candidates
exports.addcandidate = async (req, res) => {
  try {
    // Extract the data from the request body
    const { name, party, imageUrl, electionUrl } = req.body;

    // Create a new candidate object
    const newCandidate = new Candidate({
      name,
      party,
      imageUrl,
    });

    // Save the new candidate to the database
    const savedCandidate = await newCandidate.save();

    // Find the corresponding election based on the URL
    const election = await Election.findOne({ url: electionUrl });

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Add the new candidate reference to the candidates array in the election schema
    election.candidates.push(savedCandidate._id);

    // Save the updated election
    await election.save();

    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add new candidate" });
  }
};

exports.getCandidate = async (req, res) => {
  try {
    const { url } = req.body;

    // Find the election based on the URL
    const election = await Election.findOne({ url }).populate("candidates");

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.json(election.candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get candidates for election" });
  }
};

exports.editCandidate = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const { name, party, votes, imageUrl } = req.body;

    // Find the candidate by ID
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Update the candidate details
    candidate.name = name;
    candidate.party = party;
    candidate.votes = votes;
    candidate.imageUrl = imageUrl;

    // Save the updated candidate
    const updatedCandidate = await candidate.save();

    res.json(updatedCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update candidate details" });
  }
};

exports.addVoteToCandidate = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const voterId = req.body.voterId;

    // Find the candidate by ID
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Find the user by voterId
    const user = await User.findOne({ voterId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already voted (flag is 1)
    if (user.flag === 1) {
      return res.status(400).json({ message: "User has already voted" });
    }

    // Increment the vote count by 1
    candidate.votes += 1;

    // Save the updated candidate
    const updatedCandidate = await candidate.save();

    // Set the flag field to 1 indicating the user has voted
    user.flag = 1;

    // Save the updated user
    const updatedUser = await user.save();

    res.json(updatedCandidate);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to increment vote count or update user flag" });
  }
};
exports.getAllVotes = async (req, res) => {
  try {
    // Find all candidates
    const candidates = await Candidate.find();

    // Create an array to store the vote counts of each candidate
    const votes = candidates.map((candidate) => ({
      name: candidate.name,
      votes: candidate.votes,
    }));

    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get votes of candidates" });
  }
};
