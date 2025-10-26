// This is the redesigned Lost and Found page, styled to exactly
// match your Figma screenshot.

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabase';
import axios from 'axios';

function LostAndFound() {
    const [itemName, setItemName] = useState('');
    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const { token, user } = useContext(AuthContext);
    
    // Debug logging
    console.log('LostAndFound - token:', token);
    console.log('LostAndFound - user:', user);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        let imageUrl = null;
        try {
            if (imageFile) {
                const filePath = `public/${Date.now()}_${imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage.from('lost-items').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: urlData } = supabase.storage.from('lost-items').getPublicUrl(uploadData.path);
                imageUrl = urlData.publicUrl;
            }
            const response = await axios.post('http://localhost:3001/api/lost-and-found/report', { itemName, location, dateTime, imageUrl, isAnonymous }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 201) {
                setSuccess('Report filed successfully!');
                setItemName(''); setLocation(''); setDateTime(''); setImageFile(null); setImagePreview(''); setIsAnonymous(false);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to file report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
             {/* Decorative Gradient Circle */}
            <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full blur-3xl opacity-50"></div>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Lost and Found</h1>
                    <div className="flex items-center">
                        <span className="mr-4 text-sm font-medium text-gray-600">Keep your name anonymous</span>
                        <button
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
                                isAnonymous ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                                    isAnonymous ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
                
                {/* Error and Success Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {/* Image Upload Area */}
                    <div className="lg:col-span-1">
                        <label htmlFor="image-upload" className="cursor-pointer group">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-80 flex flex-col items-center justify-center text-center p-4 transition-colors group-hover:border-indigo-600 group-hover:bg-blue-50">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <p className="mt-2 text-xl text-gray-600 font-semibold">Upload Image</p>
                                        <p className="text-sm text-gray-500">optional</p>
                                    </>
                                )}
                            </div>
                        </label>
                        <input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>

                    {/* Form Fields Area */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                        <div className="space-y-10">
                            <div>
                                <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    id="item-name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="block w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-indigo-600 transition p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="last-location" className="block text-sm font-medium text-gray-700 mb-1">Last known Location</label>
                                <input
                                    type="text"
                                    id="last-location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="block w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-indigo-600 transition p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="last-date-time" className="block text-sm font-medium text-gray-700 mb-1">Last Date and Time seen</label>
                                <input
                                    type="datetime-local"
                                    id="last-date-time"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className="block w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-indigo-600 transition p-2"
                                />
                            </div>
                        </div>
                        <div className="mt-12">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 text-white font-bold  rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
                            >
                                {loading ? 'Submitting...' : 'Report'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default LostAndFound;
