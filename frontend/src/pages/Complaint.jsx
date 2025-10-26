import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// --- Helper Components for Icons ---
const PhoneIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const EmailIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const LocationIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

function Complaint() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    complaint: "",
    isAnonymous: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log("Token being sent:", token);
      if (!token) {
        setError("You must be logged in to file a complaint.");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        'http://localhost:3001/api/requests',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setSuccess('Complaint Filed Successfully!');
        // Reset form
        setFormData({
          firstName: "", lastName: "", email: "", phone: "",
          subject: "General Inquiry", complaint: "", isAnonymous: true,
        });
        setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to file complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <aside className="lg:col-span-1 bg-primary-blue text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Complaint Box</h2>
            <p className="text-blue-200 mb-8">Contact wardens anytime between <strong>8pm to 10pm</strong></p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <span className="bg-white/20 p-2 rounded-full"><PhoneIcon /></span>
                <span>+91 123454545</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-white/20 p-2 rounded-full"><EmailIcon /></span>
                <span>adwaith@iiitkottayam.ac.in</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-white/20 p-2 rounded-full"><LocationIcon /></span>
                <span>Room Number BB213 and AA 100</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-8">
              <h3 className="text-xl font-semibold mb-2">Lost anything?</h3>
              <Link to="/lost-and-found">
                <button className="bg-white text-primary-blue font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition">
                  Lost and Found
                </button>
              </Link>
            </div>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-24 -left-4 w-56 h-56 bg-white/10 rounded-full" />
        </aside>

        {/* Right Column - Form */}
        <section className="lg:col-span-2 p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Select Subject?</label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {["General Inquiry", "Network Issue", "Electrical Issue", "Water Issue"].map(subj => (
                  <label key={subj} className="flex items-center space-x-2">
                    <input type="radio" name="subject" value={subj} checked={formData.subject === subj} onChange={handleChange} className="text-primary-blue focus:ring-primary-blue" />
                    <span className="text-sm text-gray-600">{subj}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Complaint</label>
              <textarea name="complaint" value={formData.complaint} onChange={handleChange} placeholder="Write your complaint..." rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue" />
            </div>

            <div className="flex items-center justify-between pt-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="rounded text-primary-blue focus:ring-primary-blue" />
                <span className="text-sm text-gray-600">Keep your name anonymous</span>
              </label>
              <button type="submit" disabled={loading} className="text-sm bg-primary-blue text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                {loading ? 'Submitting...' : 'File Complaint'}
              </button>
            </div>

            {/* Success Toast */}
            {success && (
              <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
                {success}
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}

export default Complaint;

