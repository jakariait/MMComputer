import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';
import useAuthUserStore from '../store/AuthUserStore.js';
import ImageComponent from '../component/componentGeneral/ImageComponent.jsx';

const apiUrl = import.meta.env.VITE_API_URL;

const UserReviewHistoryPage = () => {
  const { token } = useAuthUserStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${apiUrl}/reviews/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data.reviews || []);
      } catch {
        console.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Reviews</h2>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mb-3" />
          <p className="text-sm">You haven't reviewed any products yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex gap-4"
            >
              <Link
                to={`/product/${review.productId?.slug}`}
                className="shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
              >
                <ImageComponent
                  imageName={review.productId?.thumbnailImage}
                  className="w-full h-full object-cover"
                  skeletonHeight={80}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${review.productId?.slug}`}
                  className="font-semibold text-gray-900 hover:underline"
                >
                  {review.productId?.name || 'Product'}
                </Link>

                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 mt-1">{review.comment}</p>

                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      review.status === 'approved'
                        ? 'bg-green-50 text-green-700'
                        : review.status === 'rejected'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {review.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewHistoryPage;
