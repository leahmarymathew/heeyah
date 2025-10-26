// src/pages/WardenRoomOverlay.jsx
import React, { useState } from 'react';
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
    // Mock data based on your image
    const initialOccupants = {
        'bed1': { name: 'Suraj S', rollNo: '2023BCY49'}, // Left bed
        'bed2': { name: 'Swalih', rollNo: '2023BCY49'}, // Top-right bed
        'bed3': { name: 'Abhi S', rollNo: '2023BCY49'},  // Bottom-right bed
    };
    const [occupants, setOccupants] = useState(initialOccupants);

    const handleRemove = (nameToRemove) => {
        alert(`Simulating removal of ${nameToRemove}...`);
        setOccupants(prev => {
            const updatedOccupants = { ...prev };
            // Find the bed key associated with the name and set it to null
            for (const bedKey in updatedOccupants) {
                if (updatedOccupants[bedKey]?.name === nameToRemove) {
                    updatedOccupants[bedKey] = null; // Mark as empty, don't delete key
                    break; 
                }
            }
            return updatedOccupants;
        });
    };

    return (
        <div className="warden-overlay-backdrop" onClick={onClose}>
            <div className="warden-overlay-modal" onClick={e => e.stopPropagation()}>
                <span className="warden-overlay-close" onClick={onClose}>&times;</span>
                
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