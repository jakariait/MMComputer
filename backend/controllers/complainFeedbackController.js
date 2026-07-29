const complainFeedbackService = require('../services/complainFeedbackService');

const createComplainFeedback = async (req, res) => {
  try {
    const data = await complainFeedbackService.createComplainFeedback(req.body);
    res.status(201).json({ message: 'Complain/Feedback submitted successfully', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplainFeedbacks = async (req, res) => {
  try {
    const data = await complainFeedbackService.getAllComplainFeedbacks();
    if (data.length === 0) {
      return res.status(200).json({ message: 'No complain/feedback found', data });
    }
    res.status(200).json({ message: 'Complain/Feedback retrieved successfully', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplainFeedbackById = async (req, res) => {
  try {
    const data = await complainFeedbackService.getComplainFeedbackById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Complain/Feedback not found' });
    }
    res.status(200).json({ message: 'Complain/Feedback retrieved successfully', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplainFeedback = async (req, res) => {
  try {
    const data = await complainFeedbackService.updateComplainFeedback(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ message: 'Complain/Feedback not found' });
    }
    res.status(200).json({ message: 'Complain/Feedback updated successfully', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplainFeedback = async (req, res) => {
  try {
    const data = await complainFeedbackService.deleteComplainFeedback(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Complain/Feedback not found' });
    }
    res.status(200).json({ message: 'Complain/Feedback deleted successfully', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplainFeedback,
  getAllComplainFeedbacks,
  getComplainFeedbackById,
  updateComplainFeedback,
  deleteComplainFeedback,
};
