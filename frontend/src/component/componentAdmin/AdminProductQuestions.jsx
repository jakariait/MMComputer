import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Search, MessageSquare, Check, X, Trash2, Send, Pencil } from 'lucide-react';
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

const AdminProductQuestions = () => {
  const { token } = useAuthAdminStore();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${apiUrl}/questions`, { headers });
      setQuestions(res.data.questions || []);
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (id, isEdit = false) => {
    if (!answerText.trim()) {
      toast.error('Please enter an answer');
      return;
    }
    try {
      await axios.put(
        `${apiUrl}/questions/${id}`,
        { answer: answerText, status: 'answered' },
        { headers },
      );
      toast.success(isEdit ? 'Answer updated' : 'Question answered');
      setAnsweringId(null);
      setAnswerText('');
      fetchQuestions();
    } catch {
      toast.error('Failed to save answer');
    }
  };

  const handleHide = async (id) => {
    try {
      await axios.put(`${apiUrl}/questions/${id}`, { status: 'hidden' }, { headers });
      toast.success('Question hidden');
      fetchQuestions();
    } catch {
      toast.error('Failed to hide question');
    }
  };

  const handleUnhide = async (id) => {
    try {
      await axios.put(`${apiUrl}/questions/${id}`, { status: 'pending' }, { headers });
      toast.success('Question visible');
      fetchQuestions();
    } catch {
      toast.error('Failed to update question');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${apiUrl}/questions/${deleteTarget}`, { headers });
      toast.success('Question deleted');
      setDeleteTarget(null);
      fetchQuestions();
    } catch {
      toast.error('Failed to delete question');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const pendingCount = questions.filter((q) => q.status === 'pending').length;
  const answeredCount = questions.filter((q) => q.status === 'answered').length;

  const filtered = questions.filter(
    (q) =>
      q.question?.toLowerCase().includes(search.toLowerCase()) ||
      q.answer?.toLowerCase().includes(search.toLowerCase()) ||
      q.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      q.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.productId?.name?.toLowerCase().includes(search.toLowerCase()),
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
          <h2 className="text-xl font-semibold text-gray-900">Product Questions</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {questions.length} total &middot; {pendingCount} pending &middot; {answeredCount} answered
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mb-3" />
          <p className="text-sm">{search ? 'No questions match your search.' : 'No questions yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-medium text-sm text-gray-900 truncate">
                      {q.userId?.fullName || q.userId?.name || 'Anonymous'}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        q.status === 'answered'
                          ? 'bg-green-50 text-green-700'
                          : q.status === 'hidden'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-1">
                    <span className="font-medium text-gray-500">Q: </span>
                    {q.question}
                  </p>
                  {q.answer && (
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 mt-2">
                      <span className="font-medium text-gray-500">A: </span>
                      {q.answer}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Product: <span className="font-medium text-gray-500">{q.productId?.name || 'N/A'}</span>
                    <span className="mx-1.5">&middot;</span>
                    {new Date(q.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>

                  {answeringId === q._id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your answer..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAnswer(q._id, !!q.answer);
                          if (e.key === 'Escape') {
                            setAnsweringId(null);
                            setAnswerText('');
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAnswer(q._id, !!q.answer)}
                        className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        title={q.answer ? 'Update answer' : 'Submit answer'}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {q.status === 'pending' && (
                    <button
                      onClick={() => setAnsweringId(answeringId === q._id ? null : q._id)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                      title="Answer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}
                  {q.status === 'answered' && (
                    <>
                      <button
                        onClick={() => {
                          setAnswerText(q.answer || '');
                          setAnsweringId(answeringId === q._id ? null : q._id);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Edit answer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleHide(q._id)}
                        className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
                        title="Hide"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {q.status === 'hidden' && (
                    <button
                      onClick={() => handleUnhide(q._id)}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
                      title="Show"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(q._id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
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

export default AdminProductQuestions;
