// This file is updated to fix the ReferenceError.
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PersonAtDeskPNG from '../assets/big_9983236 1.png'; 
import SingleBedPNG from '../assets/single-bed_857707 1.png';

// Placeholder for the Free Space Icon
const FreeSpaceIcon = () => (
    <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)', fontSize: '30px', color: 'white',
        backgroundColor: '#388E3C', borderRadius: '50%', width: '40px',
        height: '40px', display: 'flex', justifyContent: 'center',
        alignItems: 'center', fontWeight: 'bold', zIndex: 10,
    }}>+</div>
);

const RoomOverlay = ({ roomId, onClose }) => {
    const [roomData, setRoomData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useContext(AuthContext); 
    const [selectedBed, setSelectedBed] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestError, setRequestError] = useState('');
    const [requestSuccess, setRequestSuccess] = useState('');

    // --- STYLES OBJECT MOVED TO THE TOP ---
    // This fixes the "Cannot access 'styles' before initialization" error.
    const styles = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px',
        },
        modal: {
            backgroundColor: '#C5D0F5', borderRadius: '12px', padding: '20px',
            width: '90%', maxWidth: '700px', position: 'relative',
        },
        closeButton: {
            position: 'absolute', top: '10px', left: '10px',
            fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', color: '#333',
        },
        layoutContainer: {
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: 'auto auto 1fr 1fr 1fr auto', gap: '15px 20px',
            alignItems: 'center', justifyItems: 'center', padding: '20px 10px',
        },
        doorText: {
            gridColumn: '1 / span 3', textAlign: 'center', fontWeight: 'bold',
            fontSize: '14px', margin: '0', color: '#333'
        },
        doorLine: {
            gridColumn: '1 / span 3', width: '120px', height: '4px',
            borderTop: '3px solid #333', textAlign: 'center', lineHeight: '0',
            fontSize: '10px', color: '#333', fontWeight: '500', margin: '5px 0 15px 0',
        },
        cupboard: {
            width: '100%', maxWidth: '120px', height: '50px', backgroundColor: 'white',
            borderRadius: '4px', display: 'flex', justifyContent: 'center',
            alignItems: 'center', border: '1px solid #333', fontWeight: '600',
            fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
        positionLeftTop: { gridArea: '3 / 1 / 4 / 2' },
        positionCenterTop: { gridArea: '3 / 2 / 4 / 3' },
        positionRightTop: { gridArea: '3 / 3 / 4 / 4' },
        positionLeftMiddle: { gridArea: '4 / 1 / 5 / 2' },
        positionCenterMiddle: { gridArea: '4 / 2 / 5 / 3' },
        positionRightMiddle: { gridArea: '4 / 3 / 5 / 4' },
        cupboardLeft: { gridArea: '5 / 1 / 6 / 2' },
        cupboardRight: { gridArea: '5 / 3 / 6 / 4' },
        corridorDoor: { gridArea: '6 / 1 / 7 / 4' },
        deskImage: { width: '100px', height: '80px', },
        bedVerticalContainer: { width: '120px', height: '180px', position: 'relative', },
        bedHorizontalContainer: { width: '180px', height: '120px', position: 'relative', },
        bedImage: { width: '100%', height: '100%', objectFit: 'contain', },
        bedText: {
            position: 'absolute', bottom: '50px', left: '50%',
            transform: 'translateX(-50%)', textAlign: 'center', color: 'black',
            fontWeight: 'bold', fontSize: '12px', zIndex: 5,
        },
        bedHorizontalText: {
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)', textAlign: 'center',
            color: 'black', fontWeight: 'bold', fontSize: '12px', zIndex: 5, width: '150px' 
        },
        selectedBed: {
            outline: '4px solid #3751FE',
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(55, 81, 254, 0.7)'
        },
        requestButton: {
            width: '100%', padding: '14px', fontSize: '16px', fontWeight: '700',
            color: '#fff', backgroundColor: '#3751FE', border: 'none',
            borderRadius: '8px', cursor: 'pointer', marginTop: '20px',
            transition: 'background-color 0.3s',
        },
        requestButtonDisabled: {
            backgroundColor: '#aeb8fe',
            cursor: 'not-allowed',
        }
    };
    // --- END OF STYLES OBJECT ---

    useEffect(() => {
        const fetchData = async () => {
            if (!roomId || !token) { setIsLoading(false); return; }
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/api/rooms/layout/${roomId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRoomData(response.data);
            } catch (error) {
                console.error("Failed to fetch room details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [roomId, token]);
    
    const handleBedSelect = (bed) => {
        if (!bed.occupied) {
            setSelectedBed(bed.id); 
            setRequestError('');
            setRequestSuccess('');
        }
    };
    
    const handleRequestSubmit = async () => {
        if (!selectedBed) return;
        setIsSubmitting(true);
        setRequestError('');
        setRequestSuccess('');
        try {
            const response = await axios.post(
                'http://localhost:3001/api/allocate/request',
                { room_id: roomId, bed_number: selectedBed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequestSuccess(response.data.message || 'Room allocated successfully!');
            setSelectedBed(null); 
            setTimeout(() => {
                onClose(); 
            }, 2000);
        } catch (error) {
            console.error("Failed to allocate room:", error);
            setRequestError(error.response?.data?.error || 'Failed to submit request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // The 'styles' object is now defined before this 'if' block
    if (isLoading) {
        return (
            <div style={styles.overlay}>
                <div style={{ ...styles.modal, textAlign: 'center', padding: '40px' }}>Loading Room Details...</div>
            </div>
        );
    }
    if (!roomData) return null;

    const [bed1, bed2, bed3] = roomData.beds; 

    // Helper for rendering beds based on data
    const renderBed = (data, style, isHorizontal = false) => {
        const containerStyle = isHorizontal ? styles.bedHorizontalContainer : styles.bedVerticalContainer;
        const textStyle = isHorizontal ? styles.bedHorizontalText : styles.bedText;
        const isSelected = selectedBed === data.id;
        const finalContainerStyle = {
            ...style, 
            ...containerStyle,
            cursor: data.occupied ? 'default' : 'pointer',
            ...(isSelected ? styles.selectedBed : {})
        };

        return (
            <div style={finalContainerStyle} onClick={() => handleBedSelect(data)}>
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
                        <FreeSpaceIcon />
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
                    <p style={{ ...styles.doorText, gridRow: 1 }}>Balcony</p>
                    <div style={{ ...styles.doorLine, gridRow: 2, margin: '5px 0' }}>Balcony Door</div>
                    <div style={styles.positionLeftTop}><img src={PersonAtDeskPNG} alt="Desk" style={styles.deskImage} /></div>
                    <div style={styles.positionCenterTop}><img src={PersonAtDeskPNG} alt="Desk" style={styles.deskImage} /></div>
                    {renderBed(bed2, styles.positionRightTop, true)} 
                    {renderBed(bed1, styles.positionLeftMiddle, false)}
                    <div style={styles.positionCenterMiddle}><img src={PersonAtDeskPNG} alt="Desk" style={styles.deskImage} /></div>
                    {renderBed(bed3, styles.positionRightMiddle, false)}
                    <div style={{ ...styles.cupboard, ...styles.cupboardLeft }}>Cupboard 1</div>
                    <div style={{ ...styles.cupboard, ...styles.cupboardRight }}>Cupboard 2</div>
                    <p style={{ ...styles.doorText, ...styles.corridorDoor, marginTop: '20px' }}>Entrance/Exit Door</p>
                    <div style={{ ...styles.doorLine, gridRow: 7, gridColumn: '1 / span 3', margin: '5px 0' }}>Corridor</div>
                </div>
                
                <div style={{ padding: '0 20px 20px 20px' }}>
                    <button 
                        style={{...styles.requestButton, ...(isSubmitting || !selectedBed ? styles.requestButtonDisabled : {})}}
                        onClick={handleRequestSubmit}
                        disabled={isSubmitting || !selectedBed}
                    >
                        {isSubmitting ? 'Submitting...' : (selectedBed ? `Allot Bed ${selectedBed}` : 'Select a Free Bed')}
                    </button>
                    {requestError && <p style={{color: 'red', textAlign: 'center', marginTop: '10px'}}>{requestError}</p>}
                    {requestSuccess && <p style={{color: 'green', textAlign: 'center', marginTop: '10px'}}>{requestSuccess}</p>}
                </div>
            </div>
        </div>
    );
};

export default RoomOverlay;

