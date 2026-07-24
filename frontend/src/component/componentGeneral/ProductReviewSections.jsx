import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from '@/components/ui/alert';
import { Snackbar } from '@/components/ui/snackbar';
import { Send, Star } from 'lucide-react';
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch reviews for this product
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/reviews/product/${productId}`);
      setReviews(res.data.reviews || []);
      setTotalReviews(res.data.totalReviews || 0);
      setAverageRating(res.data.averageRating || 0);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !newComment.trim() || !user) {
      setSnackbar({
        open: true,
        message: 'Please provide a rating and a comment.',
        severity: 'warning',
      });
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
      setSnackbar({
        open: true,
        message:
          'Review submitted successfully! It will be visible after approval.',
        severity: 'success',
      });
      setNewComment('');
      setRating(0);
      fetchReviews(); // refresh list
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to submit review',
        severity: 'error',
      });
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t pt-4"
        >
          <h3 className="font-semibold">Write a review</h3>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
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
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto"
          >
            <Send size={16} />
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
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
                <Rating value={review.rating} readOnly size="small" />
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductReviewSections;
