// src/pages/RoomOverlay.jsx
import React, { useEffect, useState } from 'react';
// IMPORTANT: Ensure these files exist in src/assets/
import PersonAtDeskPNG from '../assets/big_9983236 1.png'; 
import SingleBedPNG from '../assets/single-bed_857707 1.png';

// -----------------------------------------------------------------------------
// NEW COMPONENT: Allocation Modal
// -----------------------------------------------------------------------------
const AllocationModal = ({ bedId, roomName, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Calls the onSubmit handler in the parent component
        onSubmit(bedId, name, rollNo); 
    };

    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000, // Higher z-index than RoomOverlay
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '400px',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        },
        formGroup: {
            marginBottom: '15px',
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
        },
        submitButton: {
            padding: '10px 20px',
            backgroundColor: '#3751FE',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            
            // FIX: Ensure button text is perfectly aligned vertically
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px', 
        },
        cancelButton: {
            padding: '10px 20px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            color: '#333',
            borderRadius: '6px',
            cursor: 'pointer',
            
            // FIX: Ensure button text is perfectly aligned vertically
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
        }
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
                <h2>Allocate Student to Bed {bedId} in {roomName}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="name">Student Name</label>
                        <input 
                            style={modalStyles.input} 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="rollNo">Roll Number</label>
                        <input 
                            style={modalStyles.input} 
                            type="text" 
                            id="rollNo" 
                            value={rollNo} 
                            onChange={(e) => setRollNo(e.target.value)} 
                            required 
                        />
                    </div>
                    <div style={modalStyles.buttonContainer}>
                        <button type="button" style={modalStyles.cancelButton} onClick={onClose}>Cancel</button>
                        <button type="submit" style={modalStyles.submitButton}>Allocate Bed</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// -----------------------------------------------------------------------------

// Placeholder for the Free Space Icon (styled to overlay the '+' on the bed PNG)
// UPDATED: Now accepts an onClick prop
const FreeSpaceIcon = ({ onClick }) => (
    <div 
        onClick={onClick}
        style={{
            position: 'absolute',
            top: '40%', // Moved up slightly to align with pushed-up text
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '30px',
            color: 'white',
            backgroundColor: '#388E3C',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            zIndex: 10,
            cursor: 'pointer', // Make it clear it's clickable
        }}
    >+</div>
);

// --- HARDCODING REMOVED: Your Friend needs to integrate the fetch logic here ---
// Expected Data Structure from Backend:
/*
{
    roomName: 'BAA-103',
    capacity: 3,
    beds: [
        { id: 1, occupied: true, name: 'Suraj S', rollNo: '2023BCY49' },
        { id: 2, occupied: true, name: 'Swalih', rollNo: '2023BCY49' },
        { id: 3, occupied: false, name: 'Free space', rollNo: null },
    ],
}
*/
// -----------------------------------------------------------------------------

const RoomOverlay = ({ roomId, onClose }) => {
    const [roomData, setRoomData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // NEW STATE: State for the allocation modal
    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
    const [selectedBedId, setSelectedBedId] = useState(null);

    // Function to open the allocation modal, storing the bed ID
    const handleFreeSpaceClick = (bedId) => {
        setSelectedBedId(bedId);
        setIsAllocationModalOpen(true);
    };

    // Function to handle allocation submission (mock implementation)
    const handleAllocationSubmit = (bedId, name, rollNo) => {
        console.log(`Allocating student to Bed ${bedId} in ${roomData.roomName}: Name=${name}, RollNo=${rollNo}`);
        // In a real application, you would make an API call here to update the room data.
        
        // --- Temporary client-side update for demonstration ---
        setRoomData(prevData => {
            const updatedBeds = prevData.beds.map(bed => 
                bed.id === bedId ? { ...bed, occupied: true, name: name, rollNo: rollNo } : bed
            );
            return { ...prevData, beds: updatedBeds };
        });
        
        // Close the modal after submission
        setIsAllocationModalOpen(false);
    };


    // Fetch data based on roomId
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            // --- Backend Integration Placeholder ---
            // REPLACE THIS MOCK FETCH WITH YOUR ACTUAL API CALL:
            // const response = await fetch(`http://localhost:3001/api/room/${roomId}`);
            // const data = await response.json();
            
            // Re-creating the mock data internally for testing layout only.
            const mockData = {
                'BAA103': {
                    roomName: 'BAA-103',
                    capacity: 3,
                    beds: [
                        { id: 1, occupied: true, name: 'Suraj S', rollNo: '2023BCY49' },
                        { id: 2, occupied: true, name: 'Swalih', rollNo: '2023BCY49' },
                        { id: 3, occupied: false, name: 'Free space', rollNo: null },
                    ],
                }
            };
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            setRoomData(mockData[roomId] || null);
            setIsLoading(false);
            // ---------------------------------------
        };

        if (roomId) {
            fetchData();
        }
    }, [roomId]);
    
    if (isLoading) return null; // Or return a loading spinner overlay
    if (!roomData) return null;

    // --- Embedded Styles for the Overlay (Structural/Modal styles kept here) ---
    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
        },
        modal: {
            backgroundColor: '#C5D0F5', // Light blue background matching the image
            borderRadius: '12px',
            padding: '20px',
            width: '90%',
            maxWidth: '700px',
            position: 'relative',
        },
        closeButton: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#333',
        },
        layoutContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: 'auto auto 1fr 1fr 1fr auto', 
            gap: '15px 20px',
            alignItems: 'center',
            justifyItems: 'center',
            padding: '20px 10px',
        },
        // Shared Styles for Doors/Cupboards
        doorText: {
            gridColumn: '1 / span 3',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            margin: '0',
            color: '#333'
        },
        doorLine: {
            gridColumn: '1 / span 3',
            width: '120px', 
            height: '4px',
            borderTop: '3px solid #333',
            textAlign: 'center',
            lineHeight: '0',
            fontSize: '10px',
            color: '#333',
            fontWeight: '500',
            margin: '5px 0 15px 0',
        },
        cupboard: {
            width: '100%',
            maxWidth: '120px',
            height: '50px',
            backgroundColor: 'white',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #333',
            fontWeight: '600',
            fontSize: '12px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
        // Grid Positioning (matching the visual layout)
        positionLeftTop: { gridArea: '3 / 1 / 4 / 2' },
        positionCenterTop: { gridArea: '3 / 2 / 4 / 3' },
        positionRightTop: { gridArea: '3 / 3 / 4 / 4' },
        positionLeftMiddle: { gridArea: '4 / 1 / 5 / 2' },
        positionCenterMiddle: { gridArea: '4 / 2 / 5 / 3' },
        positionRightMiddle: { gridArea: '4 / 3 / 5 / 4' },
        cupboardLeft: { gridArea: '5 / 1 / 6 / 2' },
        cupboardRight: { gridArea: '5 / 3 / 6 / 4' },
        corridorDoor: { gridArea: '6 / 1 / 7 / 4' },
        
        // Image dimensions
        deskImage: {
            width: '100px',
            height: '80px',
        },
        bedVerticalContainer: {
            width: '120px', 
            height: '180px', 
            position: 'relative',
        },
        bedHorizontalContainer: {
            width: '180px', 
            height: '120px', 
            position: 'relative',
        },
        bedImage: {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },
        // CORRECTED: Moved text up by changing bottom from '20px' to '50px'
        bedText: {
            position: 'absolute',
            bottom: '50px', 
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '12px',
            zIndex: 5,
        },
        // Custom style for the horizontal bed's text
        bedHorizontalText: {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '12px',
            zIndex: 5,
            width: '150px' 
        }
    };
    // -----------------------------------------------------------------------------------

    // Map beds to position based on array index (fixed room layout)
    const [bed1, bed2, bed3] = roomData.beds; 

    // Helper for rendering beds based on data
    const renderBed = (data, style, isHorizontal = false) => {
        const containerStyle = isHorizontal ? styles.bedHorizontalContainer : styles.bedVerticalContainer;
        const textStyle = isHorizontal ? styles.bedHorizontalText : styles.bedText;

        return (
            <div style={{ ...style, ...containerStyle }}>
                <img 
                    src={SingleBedPNG} 
                    alt="Single Bed" 
                    style={{ ...styles.bedImage, transform: isHorizontal ? 'rotate(90deg)' : 'none' }}
                />
                
                {data.occupied ? (
                    <div style={textStyle}>
                        <div>{data.name}</div>
                        <div>{data.rollNo}</div>
                    </div>
                ) : (
                    <>
                        {/* UPDATED: Pass the handler to FreeSpaceIcon, using the bed ID */}
                        <FreeSpaceIcon onClick={() => handleFreeSpaceClick(data.id)} />
                        {/* CORRECTED: Moved text up by changing bottom property */}
                        <div style={{ ...textStyle, color: '#388E3C', bottom: '35px' }}>
                            {data.name}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <span style={styles.closeButton} onClick={onClose}>&times;</span>
                <div style={styles.layoutContainer}>

                    {/* 1. Balcony Header */}
                    <p style={{ ...styles.doorText, gridRow: 1 }}>Balcony</p>

                    {/* 2. Balcony Door */}
                    <div style={{ ...styles.doorLine, gridRow: 2, margin: '5px 0' }}>Balcony Door</div>
                    
                    {/* 3. Top Row */}
                    <div style={styles.positionLeftTop}>
                        <img src={PersonAtDeskPNG} alt="Person at Desk" style={styles.deskImage} />
                    </div>
                    
                    <div style={styles.positionCenterTop}>
                         <img src={PersonAtDeskPNG} alt="Person at Desk" style={styles.deskImage} />
                    </div>
                    
                    {/* Horizontal Bed: Swalih (bed2) */}
                    {renderBed(bed2, styles.positionRightTop, true)} 
                    
                    {/* 4. Middle Row */}
                    {/* Vertical Bed: Suraj S (bed1) */}
                    {renderBed(bed1, styles.positionLeftMiddle, false)}
                    
                    <div style={styles.positionCenterMiddle}>
                         <img src={PersonAtDeskPNG} alt="Person at Desk" style={styles.deskImage} />
                    </div>
                    
                    {/* Vertical Bed: Free Space (bed3) */}
                    {renderBed(bed3, styles.positionRightMiddle, false)}
                    
                    {/* 5. Cupboards (Below the main furniture area) */}
                    <div style={{ ...styles.cupboard, ...styles.cupboardLeft }}>Cupboard 1</div>
                    <div style={{ ...styles.cupboard, ...styles.cupboardRight }}>Cupboard 2</div>
                    
                    {/* 6. Entrance/Exit Door */}
                    <p style={{ ...styles.doorText, ...styles.corridorDoor, marginTop: '20px' }}>Entrance/Exit Door</p>
                    <div style={{ ...styles.doorLine, gridRow: 7, gridColumn: '1 / span 3', margin: '5px 0' }}>Corridor</div>

                </div>
            </div>

            {/* NEW: Conditional rendering of the Allocation Modal */}
            {isAllocationModalOpen && selectedBedId && (
                <AllocationModal 
                    bedId={selectedBedId}
                    roomName={roomData.roomName}
                    onClose={() => setIsAllocationModalOpen(false)}
                    onSubmit={handleAllocationSubmit}
                />
            )}
        </div>
    );
};

export default RoomOverlay;