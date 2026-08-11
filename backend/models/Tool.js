const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  toolName: {
    type: String,
    required: [true, 'Tool name is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Tool image URL is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
  pricingType: {
    type: String,
    required: [true, 'Pricing type is required'],
    enum: ['Subscription', 'Fixed Price', 'Monthly Subscription'],
    default: 'Subscription'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  features: {
    type: [String],
    default: [],
  },
  stockStatus: {
    type: String,
    required: [true, 'Stock status is required'],
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock',
  },
  deliveryTime: {
    type: String,
    default: 'Instant',
  },
  sellerNotes: {
    type: String,
    default: '',
  },
  websiteUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5,
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tool', ToolSchema);
