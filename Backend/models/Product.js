const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    barcode: {
      type: String,
      required: [true, 'Barcode is required'],
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'Uncategorized',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique barcode per user
productSchema.index({ user: 1, barcode: 1 }, { unique: true });

// Method to get product data
productSchema.methods.toJSON = function () {
  const product = this.toObject();
  product.id = product._id;
  delete product._id;
  delete product.__v;
  return product;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

