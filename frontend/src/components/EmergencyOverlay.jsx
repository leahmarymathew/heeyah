// src/components/EmergencyOverlay.jsx
import React from 'react';
import EmergencyIcon from '../assets/emergencyIcon.png'; // Reusing the icon

const EmergencyOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
      zIndex: 3000, // High z-index to sit on top of everything
      fontFamily: '"Roboto Slab", serif',
    },
    modal: {
      backgroundColor: '#DC3545', // Red background from the image
      borderRadius: '12px',
      width: '462px', // Approx. size requested
      height: '509px', // Approx. size requested
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      fontSize: '30px',
      color: 'white',
      cursor: 'pointer',
      fontWeight: 'lighter',
    },
    title: {
      color: 'white',
      fontSize: '32px',
      fontWeight: 'bold',
      marginTop: '20px',
      textAlign: 'center',
    },
    inputSection: {
      width: '80%',
      marginTop: '60px',
    },
    input: {
      width: '100%',
      border: 'none',
      borderBottom: '2px solid white',
      backgroundColor: 'transparent',
      color: 'white',
      fontSize: '16px',
      padding: '5px 0',
      marginBottom: '30px',
      outline: 'none',
    },
    callButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: '40px',
      padding: '10px 30px',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      marginBottom: '40px',
      width: '200px',
    },
    callIcon: {
      width: '40px',
      height: '40px',
      marginRight: '10px',
    },
    callText: {
      color: '#DC3545',
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
    }
  };

  const handleCall = () => {
      // In a real application, this would trigger an actual call or notification logic
      alert("Emergency Call Initiated (simulated).");
      onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <span style={styles.closeButton} onClick={onClose}>&times;</span>
        
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2 style={styles.title}>EMERGENCY REPORTS</h2>
            <div style={styles.inputSection}>
              <p style={{color: 'white', opacity: 0.8, margin: '0 0 10px 0'}}>Describe issue (optional)</p>
              <input 
                type="text" 
                style={styles.input} 
                placeholder="Medical, Fire, Security, etc."
              />
            </div>
        </div>
        
        <div style={styles.callButton} onClick={handleCall}>
          <img src={EmergencyIcon} alt="Call Icon" style={styles.callIcon} />
          <p style={styles.callText}>CALL</p>
        </div>

      </div>
    </div>
  );
};

export default EmergencyOverlay;