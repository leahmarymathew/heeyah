// src/pages/roomAllocation.jsx (Updated)

import React, { useState } from "react";
import "./roomAllocation.css";
// 👇 Import the new dedicated modal component
import RoomModal from "../components/RoomModal"; 

const roomAlloation = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedRoomID, setSelectedRoomID] = useState(null);

  const handleCellClick = (floorID, number) => {
    setSelectedRoomID(floorID + number);
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setSelectedRoomID(null);
  };

  const getCellHandler = (floorID, number) => () => handleCellClick(floorID, number);
  
  return (
    <div className="rooms">
      <div className="wing-wrapper">
        <div className="wing-label">Left Wing</div>

        <div className="wing1">
          <div className="row1">
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
          </div>
          <div className="row2">
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
          </div>
        </div>
      </div>

      <span className="corridor">Floor-1 corridor</span>

      <div className="wing-wrapper">
        <div className="wing2">
          <div className="row1">
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
          </div>
          <div className="row2">
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
            <div className="cells" style={{ backgroundColor: "#DADADA" }} onClick={getCellHandler("BAA", "101")}>
              <p className="floorID">BAA</p>
              <h2 className="number">101</h2>
            </div>
          </div>
        </div>
        <div className="wing-label">Right Wing </div>
      </div>
      
      {/* Conditional Rendering of the Overlay */}
      {showOverlay && (
        <RoomModal 
          roomID={selectedRoomID} 
          onClose={handleCloseOverlay} 
        >
          {/* Your custom design content will go here */}
          <p>This is where you can add all the complex room details like student names, capacity, status, etc.</p>
        </RoomModal>
      )}
    </div>
  );
};

export default roomAlloation;