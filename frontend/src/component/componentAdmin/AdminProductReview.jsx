import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Star, Trash2, Search, MessageSquare, Check, X } from 'lucide-react';
import useAuthAdminStore from '../../store/AuthAdminStore.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const apiUrl = import.meta.env.VITE_API_URL;

const AdminProductReview = () => {
  const { token } = useAuthAdminStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${apiUrl}/reviews`, { headers });
      setReviews(res.data.reviews || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${apiUrl}/reviews/${id}`, { status: 'approved' }, { headers });
      toast.success('Review approved');
      fetchReviews();
    } catch {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${apiUrl}/reviews/${id}`, { status: 'rejected' }, { headers });
      toast.success('Review rejected');
      fetchReviews();
    } catch {
      toast.error('Failed to reject review');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${apiUrl}/reviews/${deleteTarget}`, { headers });
      toast.success('Review deleted');
      setDeleteTarget(null);
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const pendingCount = reviews.filter((r) => r.status !== 'approved').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;

  const filtered = reviews.filter(
    (r) =>
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.productId?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Product Reviews</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {reviews.length} total &middot; {pendingCount} pending &middot; {approvedCount} approved
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mb-3" />
          <p className="text-sm">{search ? 'No reviews match your search.' : 'No reviews yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {review.userId?.fullName || 'Anonymous'}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                      review.status === 'approved'
                        ? 'bg-green-50 text-green-700'
                        : review.status === 'rejected'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
                {review.updatedContent ? (
                  <div className="flex gap-4 bg-gray-50 rounded-lg p-3 -mx-1">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">Current</p>
                      <div className="flex mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-600 mb-1">Pending Update</p>
                      <div className="flex mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.updatedContent.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700">{review.updatedContent.comment}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Product: <span className="font-medium text-gray-500">{review.productId?.name || 'N/A'}</span>
                  <span className="mx-1.5">&middot;</span>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(review._id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setDeleteTarget(review._id)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductReview;
