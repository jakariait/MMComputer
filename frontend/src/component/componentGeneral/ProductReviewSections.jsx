import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Send, Star, Pencil, Check } from 'lucide-react';
import useAuthUserStore from '../../store/AuthUserStore.js';

const StarRating = ({ value, readOnly, onChange, disabled, size = 'md' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled || readOnly}
          onClick={() => onChange?.(null, star)}
          className={readOnly ? '' : 'cursor-pointer'}
        >
          <Star
            className={`${sizeClass} ${star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductReviewSections = ({ productId }) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { user, token } = useAuthUserStore();
  const userId = user?._id;

  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [userReviewStatus, setUserReviewStatus] = useState(null);

  // Fetch reviews for this product
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/reviews/product/${productId}`, {
        params: userId ? { userId } : {},
      });
      const fetched = res.data.reviews || [];
      setReviews(fetched);
      setTotalReviews(res.data.totalReviews || 0);
      setAverageRating(res.data.averageRating || 0);

      // Check user's existing review
      if (userId) {
        const existing = fetched.find((r) => r.userId?._id === userId);
        if (existing) {
          setUserReviewStatus(existing.status);
          if (existing.status === 'rejected') {
            setRating(existing.rating);
            setNewComment(existing.comment || '');
            setEditingReview(true);
          } else {
            setEditingReview(true);
          }
        } else {
          setUserReviewStatus(null);
          setEditingReview(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const startEditing = () => {
    const existing = reviews.find((r) => r.userId?._id === userId);
    if (existing) {
      setRating(existing.rating);
      setNewComment(existing.comment || '');
      setUserReviewStatus(null);
      setEditingReview(true);
      setSubmitted(false);
    }
  };

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !newComment.trim() || !user) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${apiBaseUrl}/reviews`,
        {
          productId,
          rating,
          comment: newComment,
          userId, // optional if using token
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSubmitted(true);
      fetchReviews(); // refresh list
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  return (
    <div className="w-full rounded-2xl shadow-sm p-3 space-y-4">
      <h2 className="text-xl font-semibold flex items-center secondaryTextColor gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Product Reviews & Ratings
      </h2>

      {/* Overall Rating */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{averageRating}</span>
          <StarRating value={parseFloat(averageRating)} readOnly />
          <span className="text-sm text-gray-500">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Write a Review Form */}
      {user ? (
        userReviewStatus === 'approved' ? (
          <div className="border-t pt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-3 flex-1">
              You have already reviewed this product. Thank you for your feedback!
            </p>
            <button
              onClick={startEditing}
              className="shrink-0 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4 inline mr-1" /> Edit
            </button>
          </div>
        ) : userReviewStatus === 'pending' ? (
          <div className="border-t pt-4">
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-3">
              Your review is pending approval. You'll be able to submit a new one once it's reviewed.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 border-t pt-4"
          >
            <h3 className="font-semibold flex items-center gap-2">
              {userReviewStatus === 'rejected' ? (
                <><Pencil className="w-4 h-4" /> Your review was rejected — submit an updated one</>
              ) : editingReview ? (
                <><Pencil className="w-4 h-4" /> Update your review</>
              ) : (
                'Write a review'
              )}
            </h3>
            <StarRating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              disabled={loading}
            />
            <textarea
              placeholder="Share your thoughts about this product..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || submitted}
              className={`px-5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
                submitted
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {submitted ? (
                <><Check className="w-4 h-4" /> Submitted for approval</>
              ) : loading ? (
                'Submitting...'
              ) : userReviewStatus === 'rejected' ? (
                'Resubmit Review'
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        )
      ) : (
        <div className="bg-gray-100 rounded-lg py-2 text-center text-gray-500">
          Please{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            sign in
          </a>{' '}
          to write a review.
        </div>
      )}

      {/* Display Reviews */}
      <div className="space-y-4  pt-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">
            There are no reviews yet. Be the first one to write a review!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <StarRating value={review.rating} readOnly size="small" />
                <span className="font-semibold">
                  {review.userId?.fullName || 'Anonymous'}
                </span>
              </div>
              <p className="text-gray-800 mb-1">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviewSections;
