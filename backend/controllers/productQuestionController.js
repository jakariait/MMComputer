const productQuestionService = require('../services/productQuestionService');

// Create new question
const createQuestion = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = {
      productId,
      userId: req.user?._id || req.body.userId,
      question: req.body.question,
    };
    const question = await productQuestionService.createQuestion(data);
    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question', error: error.message });
  }
};

// Get all questions for a product
const getQuestionsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const questions = await productQuestionService.getQuestionsByProduct(productId);
    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get questions', error: error.message });
  }
};

// Get single question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await productQuestionService.getQuestionById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get question', error: error.message });
  }
};

// Update or answer a question
const updateQuestion = async (req, res) => {
  try {
    const updated = await productQuestionService.updateQuestion(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question updated successfully', updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const deleted = await productQuestionService.deleteQuestion(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await productQuestionService.getAllQuestions();
    res.status(200).json({ message: 'All questions retrieved successfully', questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get all questions', error: error.message });
  }
};

// Get questions for the logged-in user
const getUserQuestions = async (req, res) => {
  try {
    const questions = await productQuestionService.getQuestionsByUser(req.user._id);
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get your questions', error: error.message });
  }
};

// Export controller functions
module.exports = {
  createQuestion,
  getQuestionsByProduct,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getUserQuestions,
};
