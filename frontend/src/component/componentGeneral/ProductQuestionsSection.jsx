import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Send, MessageCircle, MessageSquareReply } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Snackbar } from '@/components/ui/snackbar';
import useAuthUserStore from '../../store/AuthUserStore.js';

const ProductQuestionsSection = ({ productId }) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { user, token } = useAuthUserStore();
  const userId = user?._id;

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch questions for this product
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/products/${productId}/questions`,
      );
      setQuestions(res.data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  // Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${apiBaseUrl}/products/${productId}/questions`,
        {
          question: newQuestion,
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
        message: 'Question submitted successfully!',
        severity: 'success',
      });
      setNewQuestion('');
      fetchQuestions(); // refresh list
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to submit question',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchQuestions();
  }, [productId]);

  return (
    <div className="w-full  rounded-2xl shadow-sm p-3 space-y-4">
      <h2 className="text-xl font-semibold flex items-center secondaryTextColor gap-2">
        <MessageCircle className="w-5 h-5 text-blue-500" />
        Product Q&A
      </h2>

      <p className={'-mt-3 text-gray-500'}>
        Have question about this product? Get specific details about this
        product from expert.
      </p>

      {/* Ask Question Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Ask a question about this product..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newQuestion.trim()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center cursor-pointer justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {loading ? 'Sending...' : 'Ask'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-100 rounded-lg py-2 text-center text-gray-500">
          Please{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            sign in
          </a>{' '}
          to ask a question.
        </div>
      )}

      {/* Display Questions */}
      <div className="space-y-4">
        {questions.filter((q) => q.status === 'answered').length === 0 ? (
          <p className="text-gray-500 italic">
            There are no questions asked yet. Be the first one to ask a
            question..
          </p>
        ) : (
          questions
            .filter((q) => q.status === 'answered')
            .map((q) => (
              <div
                key={q._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <p className="font-medium text-gray-800 mb-1">
                  Q: {q.question}
                </p>
                <p className="text-green-700 flex items-start gap-2">
                  <MessageSquareReply className="w-4 h-4 mt-1 text-green-600" />
                  <span>
                    <span className="font-semibold">A:</span> {q.answer}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Asked by: {q?.userId?.fullName || 'Anonymous'} —{' '}
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
            ))
        )}
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default ProductQuestionsSection;
