// src/pages/WardenRoomManagement.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import WardenLayout from '../components/WardenLayout';
import WardenRoomOverlay from './WardenRoomOverlay'; // IMPORT THE NEW WARDEN OVERLAY
import './RoomAllocation.css'; // Reusing the same CSS as the allocation page

const WardenRoomManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('1');
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);

            try {
                // Fetch rooms from the database
                let roomQuery = supabase
                    .from('room')
                    .select('room_id, room_number, floor, hostel_wing, capacity')
                    .eq('floor', selectedFloor);

                // Apply search filter if there's a search query
                if (searchQuery && searchQuery.trim()) {
                    const searchTerm = searchQuery.trim().toUpperCase();
                    roomQuery = roomQuery.ilike('room_number', `%${searchTerm}%`);
                }

                const { data: roomsData, error: roomError } = await roomQuery;
                if (roomError) {
                    console.error('Room query error:', roomError);
                    throw roomError;
                }

                console.log('Search query:', searchQuery, 'Floor:', selectedFloor, 'Rooms found:', roomsData?.length);

                // Fetch room allocations
                const { data: allocations, error: allocError } = await supabase
                    .from('room_alloc')
                    .select('room_id, roll_no, status')
                    .in('status', ['approved', 'pending']);

                if (allocError) throw allocError;

                // Transform rooms data to match the expected format
                const transformedRooms = (roomsData || []).map(room => {
                    const wing = room.hostel_wing || 'Left';
                    const roomAllocations = (allocations || []).filter(a => a.room_id === room.room_id);
                    const allocationCount = roomAllocations.length;
                    const capacity = room.capacity || 3;

                    let status;
                    if (allocationCount === 0) {
                        status = 'Available';
                    } else if (allocationCount >= capacity) {
                        status = 'Reserved';
                    } else {
                        status = 'Partial';
                    }

                    return {
                        id: room.room_number,
                        status: status,
                        wing: wing
                    };
                });

                setRooms(transformedRooms);

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
    }, [selectedFloor, searchQuery]); // Re-run effect when filters change 

    const leftWingRooms = rooms.filter(room => room.wing === 'Left');
    const rightWingRooms = rooms.filter(room => room.wing === 'Right');

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
        <WardenLayout>
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

            {/* RENDER THE NEW WARDEN OVERLAY */}
            {selectedRoomId && <WardenRoomOverlay roomId={selectedRoomId} onClose={() => setSelectedRoomId(null)} />}
        </WardenLayout>
    );
};

export default WardenRoomManagement;