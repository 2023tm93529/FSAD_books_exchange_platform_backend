const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password, name });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token,userId: user.id,  email: user.email });

  } catch (err) {
    res.status(500).send('Server error');
  }
};
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  console.log('Received email:', email); // Debugging step

  try {
    // Check if the email exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email does not exist' });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords don't match" });
    }

    // Set the new password directly (Mongoose will handle hashing)
    user.password = newPassword; // Just assign the new password

    await user.save();  // Mongoose will hash the password before saving

    res.json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
