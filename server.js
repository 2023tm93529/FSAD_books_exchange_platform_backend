const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const cors = require('cors');

require('dotenv').config();

const app = express();
connectDB();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
