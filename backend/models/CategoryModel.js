const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, unique: true },
    image: { type: String, default: '' },
    showInHomepage: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CategoryModel = mongoose.model('Category', dataSchema);

module.exports = CategoryModel;
