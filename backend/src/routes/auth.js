import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../schema/UserSchema.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Signup API
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      dob,
      address,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      phone,
      role: "Customer",
      dob,
      address,
      password: hashedPassword,
      orderHistory: [],
      reservationHistory: [],
      status: "Active",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup/chef", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      dob,
      address,
      startDate,
      specialization,
      salary,
      experience,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      phone,
      position,
      role: "Chef",
      dob,
      address,
      startDate,
      specialization,
      salary,
      experience,
      password: hashedPassword,
      status: "Active",
    });

    await user.save();

    res.status(201).json({ message: "Chef registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup/waiter", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      dob,
      address,
      startDate,
      salary,
      languages,
      experience,
      status,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      phone,
      position,
      role: "Waiter",
      dob,
      address,
      startDate,
      salary,
      languages,
      experience,
      status: status || "Active",
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Waiter registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signin API
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    let chefs, waiters;
    if (user.role === "Manager") {
      chefs = await User.find({ role: "Chef" });
      waiters = await User.find({ role: "Waiter" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, user, chefs, waiters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
