import { useNavigate } from 'react-router-dom';
import WardenLayout from "../components/WardenLayout";
import "./wardenDashboard.css";

const WardenDashboard = () => {
  const navigate = useNavigate();

  const handleViewAllRequests = () => {
    navigate('/warden-leave');
  };

  const handleViewAllComplaints = () => {
    navigate('/warden-complaint');
  };

  return (
    <WardenLayout>
      <div className="wrapper">
        <div className="leftSect">
          <div className="stdReport">
            <h2>Student Reports</h2>
            <ul>
              <li>16 residents not signed in today</li>
              <li>185 residents on leave</li>
              <li>250 residents registered outpass</li>
            </ul>
            <button className="btnInsights">View Detailed Insights</button>
          </div>

          <div className="leaves">
            <h2 className="leaveHead">Leave Requests</h2>
            <ul className="lists">
              <li className="leaveItem">
                <div className="info">
                  <h3>Swalih Williams</h3>
                  <p>Home leave request</p>
                </div>
                <button className="appro">Approve</button>
              </li>
              <li className="leaveItem">
                <div className="info">
                  <h3>Arjun Menon</h3>
                  <p>Medical leave request</p>
                </div>
                <button className="appro">Approve</button>
              </li>
              <li className="leaveItem">
                <div className="info">
                  <h3>Priya Nair</h3>
                  <p>Family function leave</p>
                </div>
                <button className="appro">Approve</button>
              </li>
            </ul>
            <button className="alls" onClick={handleViewAllRequests}>View all Requests</button>
          </div>
        </div>
        <hr className="hrline" />

        <div className="complaints">
          <h2 className="complaints">Complaints</h2>
          <ul className="clists">
            <li className="compItem">
              <div className="cinfo">
                <h3>Alberto</h3>
                <p>2023bcs0001</p>
                <p>
                  <b>Fan not working</b>
                </p>
              </div>
              <div className="right">
                <div className="status status-resolved">
                  <p>resolved</p>
                </div>
                <p>Sahyadri Room 318</p>
              </div>
            </li>
            <li className="compItem">
              <div className="cinfo">
                <h3>Maria</h3>
                <p>2023bcs0002</p>
                <p>
                  <b>WiFi connectivity issue</b>
                </p>
              </div>
              <div className="right">
                <div className="status status-pending">
                  <p>pending</p>
                </div>
                <p>Nilgiri Room 205</p>
              </div>
            </li>
            <li className="compItem">
              <div className="cinfo">
                <h3>John</h3>
                <p>2023bcs0003</p>
                <p>
                  <b>Water leakage</b>
                </p>
              </div>
              <div className="right">
                <div className="status status-progress">
                  <p>in progress</p>
                </div>
                <p>Vindhya Room 112</p>
              </div>
            </li>
          </ul>
          <button className="alls" onClick={handleViewAllComplaints}>View all Complaints</button>
        </div>
      </div>
    </WardenLayout>
  );
};

export default WardenDashboard;
