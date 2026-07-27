const ProductReview = require('../models/ProductReviewModel');

// Create or update review (one review per user per product)
const createReview = async (data) => {
  const existing = await ProductReview.findOne({
    userId: data.userId,
    productId: data.productId,
  });

  if (existing) {
    if (existing.status === 'approved') {
      // Store current approved content, save update as pending
      existing.updatedContent = { rating: data.rating, comment: data.comment };
      existing.status = 'pending';
      return existing.save();
    }
    // Update existing pending/rejected review
    existing.rating = data.rating;
    existing.comment = data.comment;
    existing.status = 'pending';
    return existing.save();
  }

  const review = new ProductReview({ ...data, status: 'pending' });
  return review.save();
};

// Get all reviews for a specific product
const getReviewsByProduct = async (productId, userId) => {
  // Include previously approved reviews that are pending an update
  const allReviews = await ProductReview.find({
    productId,
    $or: [
      { status: 'approved' },
      { status: 'pending', updatedContent: { $ne: null } },
    ],
  })
    .populate('userId', ' fullName')
    .sort({ createdAt: -1 });

  // For reviews with updatedContent, return the original approved content
  const publicReviews = allReviews.map((r) => {
    if (r.updatedContent) {
      return {
        ...r.toObject(),
        rating: r.rating,
        comment: r.comment,
      };
    }
    return r;
  });

  let reviews = publicReviews;

  // Include the requesting user's own review regardless of status
  if (userId) {
    const userReview = await ProductReview.findOne({
      productId,
      userId,
    }).populate('userId', ' fullName');

    if (userReview) {
      const isPendingUpdate = userReview.status === 'pending' && userReview.updatedContent;
      const userReviewObj = isPendingUpdate
        ? { ...userReview.toObject(), rating: userReview.updatedContent.rating, comment: userReview.updatedContent.comment }
        : userReview.toObject();

      reviews = [
        userReviewObj,
        ...publicReviews.filter((r) => String(r.userId?._id) !== String(userId)),
      ];
    }
  }

  const totalReviews = await ProductReview.countDocuments({
    productId,
    status: 'approved',
  });

  const approvedRatings = await ProductReview.find({
    productId,
    status: 'approved',
  }).select('rating');

  const averageRating =
    totalReviews > 0
      ? approvedRatings.reduce((acc, item) => item.rating + acc, 0) / totalReviews
      : 0;

  return {
    reviews,
    totalReviews,
    averageRating: averageRating.toFixed(1),
  };
};

// Get single review by ID
const getReviewById = async (id) => {
  return ProductReview.findById(id).populate('userId', 'name email');
};

// Update review (e.g., edit comment, rating, or approve)
const updateReview = async (id, updateData) => {
  if (updateData.status === 'approved') {
    const review = await ProductReview.findById(id);
    if (!review) return null;
    // If approving a pending update, apply the updated content
    if (review.updatedContent) {
      review.rating = review.updatedContent.rating;
      review.comment = review.updatedContent.comment;
      review.updatedContent = null;
    }
    review.status = 'approved';
    return review.save();
  }
  return ProductReview.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete review
const deleteReview = async (id) => {
  return ProductReview.findByIdAndDelete(id);
};

// Get all reviews (for admin)
const getAllReviews = async () => {
  return ProductReview.find({})
    .populate('userId', 'fullName email')
    .populate('productId', 'name') // Assuming product model has a 'name' field
    .sort({ createdAt: -1 });
};

// Get reviews by user (for user dashboard)
const getUserReviews = async (userId) => {
  return ProductReview.find({ userId })
    .populate('productId', 'name slug thumbnailImage')
    .sort({ createdAt: -1 });
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
