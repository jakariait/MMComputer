const ComplainFeedbackModel = require('../models/ComplainFeedbackModel');

const createComplainFeedback = async (data) => {
  return await ComplainFeedbackModel.create(data);
};

const getAllComplainFeedbacks = async () => {
  return await ComplainFeedbackModel.find().sort({ createdAt: -1 });
};

const getComplainFeedbackById = async (id) => {
  return await ComplainFeedbackModel.findById(id);
};

const updateComplainFeedback = async (id, data) => {
  return await ComplainFeedbackModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteComplainFeedback = async (id) => {
  return await ComplainFeedbackModel.findByIdAndDelete(id);
};

module.exports = {
  createComplainFeedback,
  getAllComplainFeedbacks,
  getComplainFeedbackById,
  updateComplainFeedback,
  deleteComplainFeedback,
};
