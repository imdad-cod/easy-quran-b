// Auth Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // ✅ یہ درست طریقہ ہے

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = newPassword; // You can hash this later with bcrypt
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
});


// Register Route
router.post('/register', authController.registerUser);

// Login Route
router.post('/login', authController.loginUser);

// Admin: Get All Users
router.get('/users', authController.getAllUsers);

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email." });
    }

    // ✅ بعد میں reset link/email یہاں سے بھیج سکتے ہیں
    return res.status(200).json({ message: "Password reset instructions have been sent to your email." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
