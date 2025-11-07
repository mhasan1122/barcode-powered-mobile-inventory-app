const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique category name per user
categorySchema.index({ user: 1, name: 1 }, { unique: true });

// Method to get category data
categorySchema.methods.toJSON = function () {
  const category = this.toObject();
  category.id = category._id;
  delete category._id;
  delete category.__v;
  return category;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

