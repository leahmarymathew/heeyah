// src/pages/WardenRoomOverlay.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './WardenRoomOverlay.css'; 
import PersonAtDeskPNG from '../assets/big_9983236 1.png'; 
import SingleBedPNG from '../assets/single-bed_857707 1.png';

// --- Bed Component (Handles Occupied and Empty states) ---
const Bed = ({ occupant, onRemove, isHorizontal = false }) => {
    const isOccupied = occupant && occupant.name; // Check if there's an occupant name

    return (
        <div className={`bed-container ${isHorizontal ? 'horizontal' : 'vertical'} ${isOccupied ? '' : 'empty'}`}>
            <img 
                src={SingleBedPNG} 
                alt="Bed" 
                className="bed-image"
            />
            {isOccupied ? (
                <>
                    <div className="student-info">
                        <strong>{occupant.name}</strong>
                        <span>{occupant.rollNo}</span>
                    </div>
                    <button className="remove-button" onClick={() => onRemove(occupant.name)}>
                        &ndash;
                        <span className="remove-text">Remove</span>
                    </button>
                </>
            ) : (
                <div className="empty-bed-text">Empty</div>
            )}
        </div>
    );
};


// --- Desk Component ---
const Desk = () => (
    <div className="desk-container">
        <img src={PersonAtDeskPNG} alt="Desk" />
    </div>
);

// --- Main Overlay Component ---
const WardenRoomOverlay = ({ roomId, onClose }) => {
    const [roomData, setRoomData] = useState(null);
    const [occupants, setOccupants] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useContext(AuthContext);

    // Fetch room details when component mounts
    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!token || !roomId) return;
            
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/api/rooms/layout/${roomId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setRoomData(response.data);
                
                // Transform beds data into occupants format
                const occupantsData = {};
                response.data.beds.forEach((bed, index) => {
                    if (bed.occupied) {
                        occupantsData[`bed${index + 1}`] = {
                            name: bed.name,
                            rollNo: bed.rollNo
                        };
                    } else {
                        occupantsData[`bed${index + 1}`] = null;
                    }
                });
                setOccupants(occupantsData);
                
            } catch (error) {
                console.error("Failed to fetch room details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoomDetails();
    }, [roomId, token]);

    const handleRemove = async (nameToRemove) => {
        if (!confirm(`Are you sure you want to remove ${nameToRemove} from this room?`)) {
            return;
        }

        try {
            // Find the student's roll number
            const studentToRemove = Object.values(occupants).find(occupant => 
                occupant && occupant.name === nameToRemove
            );
            
            if (!studentToRemove) {
                alert('Student not found');
                return;
            }

            // Call API to remove student (we'll create this endpoint)
            await axios.delete(`http://localhost:3001/api/allocate/remove`, {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { 
                    rollNo: studentToRemove.rollNo,
                    roomId: roomId 
                }
            });

            // Update local state
            setOccupants(prev => {
                const updatedOccupants = { ...prev };
                for (const bedKey in updatedOccupants) {
                    if (updatedOccupants[bedKey]?.name === nameToRemove) {
                        updatedOccupants[bedKey] = null;
                        break; 
                    }
                }
                return updatedOccupants;
            });

            alert(`${nameToRemove} has been removed from the room successfully.`);
            
        } catch (error) {
            console.error("Failed to remove student:", error);
            alert('Failed to remove student. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="warden-overlay-backdrop" onClick={onClose}>
                <div className="warden-overlay-modal" onClick={e => e.stopPropagation()}>
                    <span className="warden-overlay-close" onClick={onClose}>&times;</span>
                    <div className="loading-message">Loading room details...</div>
                </div>
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="warden-overlay-backdrop" onClick={onClose}>
                <div className="warden-overlay-modal" onClick={e => e.stopPropagation()}>
                    <span className="warden-overlay-close" onClick={onClose}>&times;</span>
                    <div className="error-message">Failed to load room details.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="warden-overlay-backdrop" onClick={onClose}>
            <div className="warden-overlay-modal" onClick={e => e.stopPropagation()}>
                <span className="warden-overlay-close" onClick={onClose}>&times;</span>
                <h3 className="room-title">Room {roomData.roomName}</h3>
                
                {/* --- Grid Layout --- */}
                <div className="warden-room-layout-grid">
                    {/* Row 1: Balcony Label */}
                    <div className="layout-label balcony-label">Balcony</div>
                    
                    {/* Row 2: Balcony Door */}
                    <div className="layout-line balcony-door">Balcony Door</div>

                    {/* Row 3: Main Content Area */}
                    <div className="main-content-area">
                        {/* Column 1: Left Bed */}
                        <div className="left-bed-area">
                            <Bed 
                                occupant={occupants['bed1']} 
                                onRemove={handleRemove} 
                                isHorizontal={false} 
                            />
                        </div>

                        {/* Column 2: Desks */}
                        <div className="desk-area">
                            <Desk />
                            <Desk />
                            <Desk />
                        </div>

                        {/* Column 3: Right Beds */}
                        <div className="right-beds-area">
                            <Bed 
                                occupant={occupants['bed2']} 
                                onRemove={handleRemove} 
                                isHorizontal={true} 
                            />
                            <Bed 
                                occupant={occupants['bed3']} 
                                onRemove={handleRemove} 
                                isHorizontal={false} 
                            />
                        </div>
                    </div>

                    {/* Row 4: Cupboards */}
                    <div className="storage-area">
                        <div className="cupboard">Cupboard 1</div>
                        <div className="cupboard">Cupboard 2</div>
                    </div>

                    {/* Row 5: Exit Door Label */}
                    <div className="layout-label exit-label">Entrance/Exit Door</div>
                    
                    {/* Row 6: Exit Door Line */}
                    <div className="layout-line exit-door">Corridor</div>
                </div>
            </div>
        </div>
    );
};

export default WardenRoomOverlay;