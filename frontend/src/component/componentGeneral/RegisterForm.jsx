import {
  FaUser,
  FaLock,
  FaEyeSlash,
  FaEye,
  FaEnvelope,
  FaHome,
  FaPhone,
} from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthUserStore from '../../store/AuthUserStore.js';
import useCartStore from '../../store/useCartStore.js';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useAuthUserStore();
  const { syncCartToDB, loadCartFromBackend } = useCartStore();
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setRegistrationError('Passwords do not match!');
      return;
    }

    setRegistrationLoading(true);
    setRegistrationError(null);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
    };

    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        await login(formData.email || formData.phone, formData.password);
        const token = localStorage.getItem('user_token');

        if (token) {
          try {
            await syncCartToDB(token);
            await loadCartFromBackend(token);
            navigate('/user/home');
          } catch (cartError) {
            toast.error(
              'Registration successful, but there was a problem loading your cart. Please try again.',
            );
            navigate('/user/home');
          }
        } else {
          alert(
            'Registration successful, but automatic login failed. Please log in manually.',
          );
          navigate('/login');
        }
      } else {
        setRegistrationError(data.message || 'Registration failed!');
      }
    } catch (error) {
      setRegistrationError('Something went wrong. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4 mt-20 mb-20 md:m-20">
      <div className="bg-[#EEF5F6] rounded-2xl shadow-md p-8 w-full max-w-md text-center relative">
        {/* Lock Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-indigo-200 to-blue-200 p-4 rounded-full">
            <FaRegEdit className="primaryTextColor text-5xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold m-7">Register Account</h2>

        {/* Registration Error Message */}
        {registrationError && (
          <div
            className="bg-red-100 text-red-600 px-4 py-2 mb-4 rounded"
            role="alert"
          >
            {registrationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaUser className="primaryTextColor mr-5 text-2xl" aria-hidden="true" />
            <label htmlFor="reg-fullName" className="sr-only">Full Name</label>
            <input
              id="reg-fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name*"
              className="w-full outline-none text-sm bg-transparent"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaEnvelope className="primaryTextColor mr-5 text-2xl" aria-hidden="true" />
            <label htmlFor="reg-email" className="sr-only">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
              className="w-full outline-none text-sm bg-transparent"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaPhone className="primaryTextColor mr-5 text-2xl" aria-hidden="true" />
            <label htmlFor="reg-phone" className="sr-only">Phone Number</label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number*"
              className="w-full outline-none text-sm bg-transparent"
              required
            />
          </div>

          {/* Address */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaHome className="primaryTextColor mr-5 text-2xl" aria-hidden="true" />
            <label htmlFor="reg-address" className="sr-only">Address</label>
            <input
              id="reg-address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address*"
              className="w-full outline-none text-sm bg-transparent"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4 relative">
            <FaLock className="primaryTextColor mr-5 text-2xl" aria-hidden="true" />
            <label htmlFor="reg-password" className="sr-only">Password</label>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set Password*"
              className={`w-full outline-none bg-transparent pr-10 text-lg ${
                showPassword ? 'font-bold' : ''
              } placeholder:text-sm`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaLock className="primaryTextColor mr-5 text-2xl" aria-hidden="true" />
            <label htmlFor="reg-confirmPassword" className="sr-only">Confirm Password</label>
            <input
              id="reg-confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password*"
              className={`w-full outline-none bg-transparent text-lg ${
                showPassword ? 'font-bold' : ''
              } placeholder:text-sm`}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md mt-2 primaryBgColor accentTextColor"
            disabled={registrationLoading || authLoading}
          >
            {registrationLoading || authLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Sign In Redirect */}
        <p className="text-sm mt-6 text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="primaryTextColor font-medium hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>

    </div>
  );
};

export default RegisterForm;
