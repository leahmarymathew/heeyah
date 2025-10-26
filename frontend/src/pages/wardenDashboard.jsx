import React from "react";
import "./wardenDashboard.css";

const WardenDashboard = () => {
  return (
    <>
      <div className="wrapper">
        <div className="leftSect">
          <div className="stdReport">
            <h2>Student Reports</h2>
            <ul>
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Consectetur adipiscing elit.</li>
              <li>Integer molestie lorem at massa.</li>
            </ul>
          </div>

          <div className="leaves">
            <h2 className="leaveHead">Leave Requests</h2>
            <ul className="lists">
              <li className="leaveItem">
                <div className="info">
                  <h3>Swalih</h3>
                  <p>mohamme23bcs193@iiitkottayam.ac.in</p>
                </div>
                <button className="appro">Approve</button>
              </li>
            </ul>
            <button className="alls">View all Requests</button>
          </div>
        </div>
        <hr className="hrline" />

        <div className="complaints">
          <h2 className="complaints">Complaints</h2>
          <ul className="clists">
            <li className="compItem">
              <div className="cinfo">
                <h3>Swalih</h3>
                <p>2023bcs0000</p>
                <p>
                  <b>Fan not working</b>
                </p>
              </div>
              <div className="right">
                <div className="status">
                  <p>resolved</p>
                </div>
                <p>Sahyadri Room 318</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default WardenDashboard;
