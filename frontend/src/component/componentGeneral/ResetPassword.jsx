import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const emailFromQuery = query.get('email');

  const [email] = useState(emailFromQuery || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/reset-password`, {
        email,
        otp,
        newPassword,
      });

      toast.success(res.data.message || 'Password reset successful');

      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly
          className="w-full p-2 bg-gray-100 focus:outline-none rounded"
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 bg-gray-100 focus:outline-none rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 bg-gray-100 focus:outline-none rounded"
          required
        />
        <button
          type="submit"
          className="w-full primaryBgColor accentTextColor py-2 rounded cursor-pointer"
        >
          Reset Password
        </button>
      </form>

    </div>
  );
}
