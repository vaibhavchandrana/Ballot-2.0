const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  voter_id: {
    type: String,
    required: true,
    unique: true,
  },
  flag: {
    type: Number,
    default: 0,
  },
});

const candidateSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// Add auto-increment functionality
candidateSchema.pre("save", async function (next) {
  if (this.isNew) {
    const docCount = await mongoose.model("Candidate").countDocuments();
    this.id = docCount + 1;
  }
  next();
});
const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  // Add any other fields specific to the admin schema
  // ...
});
const electionSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  Candidate: mongoose.model("Candidate", candidateSchema),
  Admin: mongoose.model("Admin", adminSchema),
  Election: mongoose.model("Election", electionSchema),
};
