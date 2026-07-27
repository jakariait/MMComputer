import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MessageSquare, ExternalLink } from 'lucide-react';
import useAuthUserStore from '../../store/AuthUserStore.js';

const apiUrl = import.meta.env.VITE_API_URL;

const UserQuestions = () => {
  const { token } = useAuthUserStore();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${apiUrl}/users/me/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
      </div>
    );

  if (questions.length === 0) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'hidden':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        My Product Questions
      </h2>
      <div className="divide-y divide-gray-100">
        {questions.map((q) => (
          <div key={q._id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 line-clamp-2">{q.question}</p>
                {q.answer && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    <span className="font-medium text-gray-600">Ans: </span>
                    {q.answer}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(q.status)}`}
                  >
                    {q.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(q.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {q.productId?.slug && (
                  <Link
                    to={`/product/${q.productId.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1.5"
                  >
                    {q.productId.name || 'View Product'} <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserQuestions;
