import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PersonAtDeskPNG from '../assets/big_9983236 1.png'; 
import SingleBedPNG from '../assets/single-bed_857707 1.png';
import './RoomOverlay.css';

// Bed Component
const Bed = ({ bedData, onSelect, isSelected }) => {
    const isOccupied = bedData.occupied;
    const isHorizontal = bedData.id === 2; // Top-right bed is horizontal

    return (
        <div 
            className={`bed-container ${isHorizontal ? 'horizontal' : 'vertical'} ${isOccupied ? 'occupied' : 'empty'} ${isSelected ? 'selected' : ''}`}
            onClick={() => !isOccupied && onSelect(bedData)}
        >
            <img 
                src={SingleBedPNG} 
                alt="Bed" 
                className="bed-image"
            />
            {isOccupied ? (
                <div className="student-info">
                    <div>{bedData.name}</div>
                    <div>{bedData.rollNo}</div>
                </div>
            ) : (
                <>
                    <div className="free-space-icon">+</div>
                    <div className="empty-bed-text">Free space</div>
                </>
            )}
        </div>
    );
};

// Desk Component
const Desk = () => (
    <div className="desk-container">
        <img src={PersonAtDeskPNG} alt="Desk" />
    </div>
);

const RoomOverlay = ({ roomId, onClose }) => {
    const [roomData, setRoomData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext); 
    const [selectedBed, setSelectedBed] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestError, setRequestError] = useState('');
    const [requestSuccess, setRequestSuccess] = useState('');
    const [existingAllocation, setExistingAllocation] = useState(null);
    const [hasExistingAllocation, setHasExistingAllocation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!roomId || !user) { setIsLoading(false); return; }
            setIsLoading(true);
            try {
                // Fetch room details - use simple endpoint
                const roomResponse = await axios.get(`http://localhost:3001/api/rooms/layout/simple/${roomId}`, {
                    params: {
                        userRole: user.role,
                        rollNo: user.roll_no || user.warden_id
                    }
                });
                setRoomData(roomResponse.data);

                // Check if student already has allocation - use simple endpoint
                const allocationResponse = await axios.get('http://localhost:3001/api/allocate/my-status/simple', {
                    params: {
                        rollNo: user.roll_no,
                        userRole: user.role
                    }
                });
                
                if (allocationResponse.data.hasAllocation) {
                    setHasExistingAllocation(true);
                    setExistingAllocation(allocationResponse.data.allocation);
                }
                
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [roomId, user]);
    
    const handleBedSelect = (bed) => {
        if (hasExistingAllocation) {
            setRequestError(`You already have a room allocation: Room ${existingAllocation.roomNumber}, Bed ${existingAllocation.bedNumber}`);
            return;
        }
        setSelectedBed(bed.id); 
        setRequestError('');
        setRequestSuccess('');
    };
    
    const handleRequestSubmit = async () => {
        if (!selectedBed) return;
        
        // Check if user is properly authenticated
        if (!user) {
            setRequestError('You are not logged in. Please log in and try again.');
            return;
        }
        
        // Check if user is a student (only students can request room allocation)
        if (user?.role !== 'student') {
            setRequestError('Only students can request room allocation.');
            return;
        }
        
        setIsSubmitting(true);
        setRequestError('');
        setRequestSuccess('');
        
        console.log('📋 Request data:', { room_id: roomId, bed_number: selectedBed, user: user.name });
        
        try {
            const response = await axios.post(
                'http://localhost:3001/api/allocate/request/simple',
                { 
                    room_id: roomId, 
                    bed_number: selectedBed,
                    rollNo: user.roll_no,
                    studentName: user.name
                }
            );
            setRequestSuccess(response.data.message || 'Room allocated successfully!');
            setSelectedBed(null); 
            setTimeout(() => {
                onClose(); 
            }, 2000);
        } catch (error) {
            console.error("Failed to allocate room:", error);
            
            if (error.response?.status === 401) {
                setRequestError('Authentication failed. Please log out and log in again with a valid student account (e.g., leah@g.com).');
            } else if (error.response?.status === 400 && error.response?.data?.existingAllocation) {
                const existing = error.response.data.existingAllocation;
                setRequestError(`You already have a room allocation: Room ${existing.roomNumber}, Bed ${existing.bedNumber}`);
                setHasExistingAllocation(true);
                setExistingAllocation(existing);
            } else {
                setRequestError(error.response?.data?.error || 'Failed to submit request.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="room-overlay-backdrop" onClick={onClose}>
                <div className="room-overlay-modal" onClick={e => e.stopPropagation()}>
                    <span className="room-overlay-close" onClick={onClose}>&times;</span>
                    <div className="loading-message">Loading room details...</div>
                </div>
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="room-overlay-backdrop" onClick={onClose}>
                <div className="room-overlay-modal" onClick={e => e.stopPropagation()}>
                    <span className="room-overlay-close" onClick={onClose}>&times;</span>
                    <div className="error-message">Failed to load room details.</div>
                </div>
            </div>
        );
    }

    const [bed1, bed2, bed3] = roomData.beds;

    return (
        <div className="room-overlay-backdrop" onClick={onClose}>
            <div className="room-overlay-modal" onClick={e => e.stopPropagation()}>
                <span className="room-overlay-close" onClick={onClose}>&times;</span>
                <h3 className="room-title">Room {roomData.roomName}</h3>
                
                {/* Existing Allocation Warning */}
                {hasExistingAllocation && (
                    <div className="existing-allocation-warning">
                        <strong>⚠️ You already have a room allocation:</strong><br/>
                        Room {existingAllocation.roomNumber}, Bed {existingAllocation.bedNumber}
                        <br/><small>You cannot request another room allocation.</small>
                    </div>
                )}
                
                {/* Room Layout */}
                <div className="room-layout-grid">
                    {/* Balcony Section */}
                    <div className="layout-label">Balcony</div>

                    {/* Main Room Content */}
                    <div className="main-content-area">
                        {/* Column 1: Left Bed */}
                        <div className="left-bed-area">
                            <Bed 
                                bedData={bed1} 
                                onSelect={handleBedSelect} 
                                isSelected={selectedBed === bed1?.id}
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
                                bedData={bed2} 
                                onSelect={handleBedSelect} 
                                isSelected={selectedBed === bed2?.id}
                            />
                            <Bed 
                                bedData={bed3} 
                                onSelect={handleBedSelect} 
                                isSelected={selectedBed === bed3?.id}
                            />
                        </div>
                    </div>

                    {/* Storage Section */}
                    <div className="storage-area">
                        <div className="cupboard">Cupboard 1</div>
                        <div className="cupboard">Cupboard 2</div>
                    </div>

                    {/* Exit Section */}
                    <div className="layout-label">Corridor</div>
                </div>
                
                {/* Request Section */}
                <div className="request-section">
                    <button 
                        className={`request-button ${(isSubmitting || !selectedBed || hasExistingAllocation) ? 'disabled' : ''}`}
                        onClick={handleRequestSubmit}
                        disabled={isSubmitting || !selectedBed || hasExistingAllocation}
                    >
                        {hasExistingAllocation ? 'Already Allocated' : 
                         isSubmitting ? 'Submitting...' : 
                         selectedBed ? `Allot Bed ${selectedBed}` : 'Select a Free Bed'}
                    </button>
                    {requestError && <p className="request-message error">{requestError}</p>}
                    {requestSuccess && <p className="request-message success">{requestSuccess}</p>}
                </div>
            </div>
        </div>
    );
};

export default RoomOverlay;

