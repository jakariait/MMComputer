const ProductQuestion = require('../models/ProductQuestionModel');

// Create question
const createQuestion = async (data) => {
  const question = new ProductQuestion(data);
  return question.save();
};

// Get all questions for a product
const getQuestionsByProduct = async (productId) => {
  return ProductQuestion.find({ productId })
    .populate('userId', 'name email fullName')
    .sort({ createdAt: -1 });
};

// Get single question
const getQuestionById = async (id) => {
  return ProductQuestion.findById(id).populate('userId', 'name email');
};

const getAllQuestions = async () => {
  return ProductQuestion.find({})
    .populate('userId', 'name email fullName')
    .populate('productId', 'name slug')
    .sort({ createdAt: -1 });
};

// Update / Answer question
const updateQuestion = async (id, updateData) => {
  return ProductQuestion.findByIdAndUpdate(id, updateData, { new: true })
    .populate('userId', 'name email fullName')
    .populate('productId', 'name slug');
};

// Delete question
const deleteQuestion = async (id) => {
  return ProductQuestion.findByIdAndDelete(id);
};

// Get questions by user
const getQuestionsByUser = async (userId) => {
  return ProductQuestion.find({ userId })
    .populate('productId', 'name slug images')
    .sort({ createdAt: -1 });
};

// Export all service functions
module.exports = {
  createQuestion,
  getQuestionsByProduct,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionsByUser,
};
