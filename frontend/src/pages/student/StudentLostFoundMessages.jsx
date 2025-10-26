import React, { useState, useEffect } from "react";
import './StudentLostFoundMessages.css';
// import watchImage from '../../assets/watch.jpg';

const API_URL = "http://localhost:3001/api/students/lost-and-found";

// --- Helper functions ---
const formatDate = (datetimeString) => {
    if (!datetimeString) return "N/A";
    const date = new Date(datetimeString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (datetimeString) => {
    if (!datetimeString) return "N/A";
    const date = new Date(datetimeString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
};

const StudentLostFoundMessages = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLostAndFoundItems = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch lost & found items.");
            } finally {
                setLoading(false);
            }
        };

        fetchLostAndFoundItems();
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading lost & found items...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

    return (
        <div className="main">
            <div className="lf-container">
                <h2 className="lf-head">Lost & Found Items</h2>
                <table className="messages-table">
                    <thead>
                        <tr>
                            <th>Posted By</th>
                            <th>Item Description</th>
                            <th>Item Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td className="cell-posted-by">
                                        <strong>{item.name}</strong>
                                        <p>{item.phone || 'N/A'}</p>
                                    </td>
                                    <td className="cell-item-desc">
                                        <strong>{item.itemName}</strong>
                                        <p>
                                            <strong>Last Seen:</strong> {formatDate(item.lastSeenDate)} at {formatTime(item.lastSeenTime)}
                                        </p>
                                        <p><strong>Location:</strong> {item.lastKnownLocation || 'N/A'}</p>
                                    </td>
                                    <td className="cell-item-photo">
                                        {item.photo && item.photo !== 'nil' ? (
                                            <img
                                                src={item.photo}
                                                alt={item.itemName}
                                                className="item-photo-img"
                                                onError={(e) => {
                                                    e.target.src = `https://placehold.co/100x100/e0e0e0/777?text=Image+Broken`;
                                                }}
                                            />
                                        ) : (
                                            <div className="no-photo-placeholder">
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No lost items have been reported yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentLostFoundMessages;
