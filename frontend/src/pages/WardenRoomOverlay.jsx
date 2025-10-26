// src/pages/WardenRoomOverlay.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
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

    // Fetch room details when component mounts
    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!roomId) return;
            
            setIsLoading(true);
            try {
                // Get room info
                const { data: room, error: roomError } = await supabase
                    .from('room')
                    .select('room_id, room_number, type, capacity')
                    .eq('room_number', roomId)
                    .single();

                if (roomError) {
                    console.error(`Room not found for room_number: ${roomId}`, roomError.message);
                    return;
                }

                // Get room allocations with student info
                const { data: allocations, error: allocError } = await supabase
                    .from('room_alloc')
                    .select('student ( name, roll_no )')
                    .eq('room_id', room.room_id)
                    .eq('status', 'approved');

                if (allocError) {
                    console.error('Error fetching allocations:', allocError);
                }

                // Create beds array
                const beds = [];
                const capacity = room.capacity || 3;
                
                for (let i = 0; i < (allocations || []).length; i++) {
                    beds.push({
                        id: i + 1,
                        occupied: true,
                        name: allocations[i].student.name,
                        rollNo: allocations[i].student.roll_no
                    });
                }
                
                while (beds.length < capacity) {
                    beds.push({
                        id: beds.length + 1,
                        occupied: false,
                        name: 'Free space',
                        rollNo: null
                    });
                }

                const roomDetails = {
                    roomName: room.room_number,
                    capacity: capacity,
                    beds: beds
                };

                setRoomData(roomDetails);
                
                // Transform beds data into occupants format
                const occupantsData = {};
                roomDetails.beds.forEach((bed, index) => {
                    if (bed.occupied && bed.name !== 'Free space') {
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
    }, [roomId]);

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

            // Remove student from room_alloc table
            const { error } = await supabase
                .from('room_alloc')
                .delete()
                .eq('roll_no', studentToRemove.rollNo);

            if (error) {
                console.error('Error removing student:', error);
                alert('Failed to remove student. Please try again.');
                return;
            }

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

                    {/* Row 2: Main Content Area */}
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

                    {/* Row 3: Cupboards */}
                    <div className="storage-area">
                        <div className="cupboard">Cupboard 1</div>
                        <div className="cupboard">Cupboard 2</div>
                    </div>

                    {/* Row 4: Exit Door Label */}
                    <div className="layout-label exit-label">Corridor</div>
                </div>
            </div>
        </div>
    );
};

export default WardenRoomOverlay;