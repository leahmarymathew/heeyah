// src/pages/RoomAllocation.jsx
import React, { useState, useEffect } from 'react';
import RoomOverlay from './RoomOverlay'; // IMPORT THE NEW OVERLAY COMPONENT
import './RoomAllocation.css';

// The placeholder RoomOverlay component has been removed from here.

const RoomAllocationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    // --- useEffect to Fetch Data from the Backend ---
    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                // ... (API call simulation remains the same)
                
                // --- Mock Data for demonstration without a running backend ---
                const mockRooms = [
                    { id: 'BAA101', wing: 'Left', status: 'Reserved' },
                    { id: 'BAA102', wing: 'Left', status: 'Available' },
                    { id: 'BAA103', wing: 'Left', status: 'Partial' },
                    { id: 'BAB101', wing: 'Right', status: 'Available' },
                    { id: 'BAB102', wing: 'Right', status: 'Reserved' },
                    { id: 'BAB103', wing: 'Right', status: 'Available' },
                ];
                
                const filteredRooms = mockRooms
                    .filter(room => room.id.includes(selectedFloor)) 
                    .filter(room => room.id.toLowerCase().includes(searchQuery.toLowerCase()));

                await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
                
                setRooms(filteredRooms);
                // -----------------------------------------------------------

            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const handler = setTimeout(() => {
            fetchRooms();
        }, 300); 

        return () => {
            clearTimeout(handler);
        };
    }, [selectedFloor, searchQuery]); 

    const leftWingRooms = rooms.filter(room => room.wing === 'Left');
    const rightWingRooms = rooms.filter(room => room.wing === 'Right');
    
    // Helper function to map status to the specific color class for the room-card
    const getColorClass = (status) => {
        if (status === 'Reserved') return 'reserved-red';
        if (status === 'Available') return 'available-grey';
        if (status === 'Partial') return 'partial-blue';
        return '';
    };

    const handleRoomClick = (roomId) => {
        // Force the ID to 'BAA103' to display the mock data in the overlay
        setSelectedRoomId('BAA103'); 
    };
    
    return (
        <>
            {/* The rest of your existing Room Allocation Page content */}
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
                            placeholder="Example: 'BAA101'"  
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
                        <button className='allot'>Allot</button>
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
            {/* RENDER THE CORRECT OVERLAY COMPONENT */}
            {selectedRoomId && <RoomOverlay roomId={selectedRoomId} onClose={() => setSelectedRoomId(null)} />}
        </>
    );
};

export default RoomAllocationPage;