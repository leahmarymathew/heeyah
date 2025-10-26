// This file is updated to make a real API call to your backend.
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RoomOverlay from './RoomOverlay'; // Import the overlay component
import './roomAllocation.css'; // Import the custom CSS

const RoomAllocationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const { user } = useContext(AuthContext); // Get user info

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            if (!user) {
                console.error("User not logged in");
                setIsLoading(false);
                return;
            }
            
            try {
                // --- SIMPLE API CALL ---
                // We pass the filters as query parameters to the backend
                const response = await axios.get(`http://localhost:3001/api/rooms/layout/simple`, {
                    params: {
                        floor: selectedFloor,
                        search: searchQuery,
                        userRole: user.role,
                        rollNo: user.roll_no || user.warden_id
                    }
                });
                
                // The backend now returns data in the format we need
                setRooms(response.data);
                // ---------------------

            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            } finally {
                setIsLoading(false);
            }
        };

      // Debounce the fetch call to avoid spamming the API on every key press
        const handler = setTimeout(() => {
            fetchRooms();
        }, 300); 

        return () => {
            clearTimeout(handler);
        };
    }, [selectedFloor, searchQuery, user]); // Re-run effect when filters or user change

    const leftWingRooms = rooms.filter(room => room.wing === 'Left');
    const rightWingRooms = rooms.filter(room => room.wing === 'Right');
    
    // Helper function to map status to the specific color class
    const getColorClass = (status) => {
        if (status === 'Reserved') return 'reserved-red';
        if (status === 'Available') return 'available-grey';
        if (status === 'Partial') return 'partial-blue';
        return '';
    };

    const handleRoomClick = (roomId) => {
        setSelectedRoomId(roomId); 
    };
    
    return (
        <>
            <div className="help">
               <div className="help-info">
                    <div className="circle reserved"></div>
                    <span>Reserved</span>
                </div>
                <div className="help-info">
                    <div className="circle available"></div>
                    <span>Available</span>
                </div>
                <div className="help-info">
                    <div className="circle partial"></div>
                    <span>Partial</span>
                </div>
            </div>  
            <div className="container">
                <div className="search-help">            
                    <h2 className="search">Search Room</h2>
                    <div className="filter">
                        <input 
                            type="text" 
                            placeholder="Example: 'THL101'"  
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select 
                            value={selectedFloor} 
                            onChange={(e) => setSelectedFloor(e.target.value)}
                        >
                            <option value="1">Floor 1</option>
                            <option value="2">Floor 2</option>
                            <option value="3">Floor 3</option>
                            <option value="4">Floor 4</option>
                            <option value="5">Floor 5</option>
                        </select>

                    </div>
                </div>
                
                {/* --- Display Loading Message or Rooms --- */}
                {isLoading ? (
                    <div className="loading-message">Loading rooms...</div>
                ) : (
                    <div className="rooms-container">
                        <div className="wing">
                            <h5 className="wing-title">Left wing</h5>
                            <div className="room-grid">
                                {leftWingRooms.map((room) => (
                                    <div 
                                        key={room.id} 
                                        className={`room-card ${getColorClass(room.status)}`} 
                                        onClick={() => handleRoomClick(room.id)}
                                    >
                                        <div className="room-prefix">{room.id.substring(0, 3)}</div>
                                        <div className="room-number">{room.id.substring(3)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <h3 className="floor-seperator">Floor {selectedFloor}</h3>
                        
                        <div className="wing">
                            <h5 className="wing-title">Right wing</h5>
                            <div className="room-grid">
                                {rightWingRooms.map((room) => (
                                    <div 
                                        key={room.id} 
                                        className={`room-card ${getColorClass(room.status)}`} 
                                        onClick={() => handleRoomClick(room.id)}
                                    >
                                        <div className="room-prefix">{room.id.substring(0, 3)}</div>
                                        <div className="room-number">{room.id.substring(3)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}    
            </div>
            {/* RENDER THE OVERLAY COMPONENT, passing the selected room ID */}
            {selectedRoomId && <RoomOverlay roomId={selectedRoomId} onClose={() => setSelectedRoomId(null)} />}
        </>
    );
};

export default RoomAllocationPage;

