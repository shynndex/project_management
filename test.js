const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://username:password@cluster0.mongodb.net/test')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Connection Error:', err));
