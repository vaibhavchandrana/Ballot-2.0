const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas");
require("dotenv").config();

// User registration endpoint
exports.registerUser = async (req, res) => {
  try {
    const { email, name, phone, age, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Generate unique 6-digit voter ID
    let voterId = "";
    let voterIdExists = true;
    while (voterIdExists) {
      // Generate random 6-digit number
      voterId = Math.floor(Math.random() * 900000) + 100000;
      // Check if voter ID already exists
      const voterIdCheck = await User.findOne({ voter_id: voterId });
      if (!voterIdCheck) {
        voterIdExists = false;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      name,
      phone,
      age,
      password: hashedPassword,
      voter_id: voterId,
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
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
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
exports.getProfile = async (req, res) => {
  try {
    const email = req.params.email;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { email: currentEmail } = req.params;
    const { email, name, phone, age } = req.body;

    // Check if email is already in use
    if (email && email !== currentEmail) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Find user by email
    const user = await User.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile
    user.email = email || user.email;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.age = age || user.age;

    // Save updated user profile
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
