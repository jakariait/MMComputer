import React, { useState, useEffect } from 'react';

const AddressForm = ({ user, onAddressChange }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Send initial data on load (after the initial render and potential user prop update)
  useEffect(() => {
    onAddressChange(formData);
  }, [formData, onAddressChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Only allow digits in the phone field
    if (name === 'phone') {
      newValue = value.replace(/\D/g, ''); // Remove all non-digit characters
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: newValue };
      return newData;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
        Address
      </h2>

      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="fullName" className="font-medium">
          Full Name <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="ex Mr./Mrs/Miss"
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          required
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label htmlFor="mobileNumber" className="font-medium">
          Mobile Number <span className="text-red-600" aria-hidden="true">*</span>
        </label>

        <input
          id="mobileNumber"
          name="phone"
          type="tel"
          placeholder="ex 01234567890"
          maxLength={11}
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="font-medium">
          Address <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="ex House no. / Building / Street / Area"
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          required
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-medium">
          Email <span className="text-sm">(Optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ex example@email.com"
          className="py-2 px-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:primaryRingColor transition placeholder:text-sm"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AddressForm;
