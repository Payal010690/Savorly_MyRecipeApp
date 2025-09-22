const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

// create recipe (auth + image)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image required' });

    let ingr = [];
    let stp = [];
    try {
      ingr = ingredients ? JSON.parse(ingredients) : (ingredients ? ingredients.split(',') : []);
    } catch { ingr = ingredients ? ingredients.split(',') : []; }
    try {
      stp = steps ? JSON.parse(steps) : (steps ? steps.split('\n') : []);
    } catch { stp = steps ? steps.split('\n') : []; }

    const recipe = new Recipe({
      title, description, ingredients: ingr, steps: stp, image: `/uploads/${req.file.filename}`, author: req.user._id
    });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// feed with pagination
router.get('/', async (req,res) => {
  const page = parseInt(req.query.page)||1;
  const limit = parseInt(req.query.limit)||10;
  const skip = (page-1)*limit;
  const total = await Recipe.countDocuments();
  const recipes = await Recipe.find()
    .populate('author','name')
    .sort({ createdAt: -1 })
    .skip(skip).limit(limit);
  res.json({ page, totalPages: Math.ceil(total/limit), recipes });
});

// like toggle
router.patch('/:id/like', auth, async (req,res)=>{
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Not found' });
  const idx = recipe.likes.indexOf(req.user._id);
  if (idx === -1) recipe.likes.push(req.user._id);
  else recipe.likes.splice(idx,1);
  await recipe.save();
  res.json({ likesCount: recipe.likes.length, liked: idx===-1 });
});

// get single recipe (with comments)
router.get('/:id', async (req,res)=>{
  const recipe = await Recipe.findById(req.params.id).populate('author','name').populate({
    path: 'comments', populate: { path: 'author', select: 'name' }
  });
  if (!recipe) return res.status(404).json({ message: 'Not found' });
  res.json(recipe);
});

module.exports = router;
