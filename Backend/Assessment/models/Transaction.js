const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);
