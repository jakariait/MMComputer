import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Send, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const FeedbackComplain = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    subject: '',
    details: '',
  });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      const res = await axios.post(`${apiUrl}/complain-feedback`, formData);
      if (res.status >= 200 && res.status < 300) {
        setStatus('success');
        setFormData({
          fullName: '',
          phoneNumber: '',
          emailAddress: '',
          subject: '',
          details: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primaryColor)]/20 focus:border-[var(--primaryColor)] transition-all duration-200';

  return (
    <div>
      <div className="primaryBgColor relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white rounded-full" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-10 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Feedback & Complain
          </motion.h1>
          <motion.nav
            className="flex items-center justify-center gap-2 text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/90">Feedback & Complain</span>
          </motion.nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-6 text-center">
              <span className="inline-block px-3 py-1 text-xs font-medium primaryBgColor text-white rounded-full mb-3">
                We Value Your Opinion
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Share Your Feedback or Complain
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Your input helps us improve our service.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+880 1234 567890"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief subject of your feedback or complain"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="5"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your feedback or complain in detail..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="primaryBgColor text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60 inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {status && (
        <div className="fixed top-6 right-6 z-50">
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {status === 'success'
              ? 'Your feedback has been submitted successfully!'
              : 'Submission failed. Please try again.'}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FeedbackComplain;
