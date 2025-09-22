require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve images

// routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> app.listen(PORT, ()=> console.log(`Server running ${PORT}`)))
  .catch(err => console.error('DB conn error', err));
