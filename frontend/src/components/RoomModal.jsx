import '../styles/Overlay.css'; 

const RoomModal = ({ roomID, onClose, children }) => {

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-content" onClick={handleContentClick}>
        
        <button className="close-button" onClick={onClose}>X</button>
        
        <h3 className="modal-header">Room Details: {roomID}</h3>
        
        {/* The user's specific content will be rendered here */}
        {children} 
      </div>
    </div>
  );
};

export default RoomModal;