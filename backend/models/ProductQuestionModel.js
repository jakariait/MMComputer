const mongoose = require('mongoose');

const productQuestionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['pending', 'answered', 'hidden'],
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('ProductQuestion', productQuestionSchema);
