import React, { useState, useEffect } from "react"; // Import React Hooks
// ... other imports ...
import watchImage from '../../assets/watch.jpg'; 

// --- UPDATED Helper functions ---
const formatDate = (datetimeString) => {
    if (!datetimeString) return "N/A";
    const date = new Date(datetimeString);
    return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    }); 
};

const formatTime = (datetimeString) => {
    if (!datetimeString) return "N/A";
    const date = new Date(datetimeString);
    // Use 'en-GB' locale and hourCycle: 'h23' for HH:MM (24-hour) format
    return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hourCycle: 'h23' // Use 24-hour clock
    });
};


const StudentLostFoundMessages = () => {
    // ... state variables (items, loading, error) ...
    // ... API_URL ...

    useEffect(() => {
        // ... fetchLostAndFoundItems function ...
        const fetchLostAndFoundItems = async () => {
            try {
                // ... setLoading, setError ...
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const transformedData = data.map(item => ({
                    id: item.item_id,
                    name: item.reporter ? item.reporter.name : 'Anonymous', 
                    phone: item.reporter ? item.reporter.phone : 'N/A', 
                    itemName: item.item_name,
                    // These will now use the updated formatters
                    lastSeenDate: formatDate(item.last_seen_datetime),
                    lastSeenTime: formatTime(item.last_seen_datetime),
                    lastKnownLocation: item.last_known_location,
                    photo: item.image_url 
                }));

                setItems(transformedData);

            } catch (err) {
                // ... error handling ...
            } finally {
                // ... setLoading(false) ...
            }
        };

        fetchLostAndFoundItems();
    }, []); 

    // ... Render Loading State ...
    // ... Render Error State ...

    // --- Render Data State ---
    return (
        <>
        <Navbar/>
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
                                        <p>{item.phone}</p>
                                    </td>
                                    <td className="cell-item-desc">
                                        <strong>{item.itemName}</strong>
                                        {/* Display format is now DD/MM/YYYY at HH:MM */}
                                        <p><strong>Last Seen:</strong> {item.lastSeenDate} at {item.lastSeenTime}</p>
                                        <p><strong>Location:</strong> {item.lastKnownLocation}</p>
                                    </td>
                                    {/* ... rest of the table row (photo cell) ... */}
                                    <td className="cell-item-photo">
                                        {item.photo === 'watch.png' ? (
                                            <img 
                                                src={watchImage} 
                                                alt={item.itemName} 
                                                className="item-photo-img"
                                            />
                                        ) : (item.photo && item.photo !== 'nil') ? ( 
                                            <img 
                                                src={item.photo} 
                                                alt={item.itemName} 
                                                className="item-photo-img"
                                                onError={(e) => { e.target.src = `https://placehold.co/100x100/e0e0e0/777?text=Image+Broken`; }}
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
        </>
    );
};
export default StudentLostFoundMessages;

