const reviewService = require('../services/productReviewService');

// Create review
const createReview = async (req, res) => {
  try {
    const { productId } = req.body;
    const data = {
      productId,
      userId: req.user?._id || req.body.userId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const review = await reviewService.createReview(data);
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message, error: error.message });
  }
};

// Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
  try {
    const { reviews, totalReviews, averageRating } = await reviewService.getReviewsByProduct(
      req.params.productId,
      req.query.userId
    );
    res
      .status(200)
      .json({ message: 'Reviews retrieved successfully', reviews, totalReviews, averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Get single review
const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch review', error: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const updated = await reviewService.updateReview(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review updated successfully', review: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const deleted = await reviewService.deleteReview(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

// Get all reviews --- ADMIN
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ message: 'All reviews retrieved successfully', reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all reviews', error: error.message });
  }
};

// Get reviews by current user
const getUserReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getUserReviews(req.user._id);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your reviews', error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews,
  getUserReviews,
};
