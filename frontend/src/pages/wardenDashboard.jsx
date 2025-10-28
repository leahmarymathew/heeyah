import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import WardenLayout from "../components/WardenLayout";
import "./wardenDashboard.css";

const WardenDashboard = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [studentStats, setStudentStats] = useState({
    notSignedIn: 0,
    onLeave: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch student statistics
      const today = new Date().toISOString().slice(0, 10);
      
      // Get total students
      const { data: allStudents, error: studentError } = await supabase
        .from('student')
        .select('roll_no');

      const totalStudents = allStudents?.length || 0;

      // Get students who haven't signed in today (no attendance record for today)
      const { data: attendanceToday, error: attendanceError } = await supabase
        .from('attendance')
        .select('roll_no')
        .eq('date', today);

      const signedInToday = attendanceToday?.length || 0;
      const notSignedIn = totalStudents - signedInToday;

      // Get students currently on leave
      const now = new Date();
      const { data: currentLeaves, error: currentLeaveError } = await supabase
        .from('leave_record')
        .select('roll_no')
        .lte('leave_start_time', now.toISOString())
        .gte('leave_end_time', now.toISOString())
        .eq('approved_by', true);

      const onLeave = currentLeaves?.length || 0;

      setStudentStats({
        notSignedIn: Math.max(0, notSignedIn),
        onLeave,
        totalStudents
      });

      // Fetch last 3 leave records
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_record')
        .select(`
          *,
          student ( name, roll_no )
        `)
        .order('leave_start_time', { ascending: false })
        .limit(3);

      if (leaveError) {
        console.error('Error fetching leave records:', leaveError);
      } else {
        setLeaveRequests(leaveData || []);
      }

      // Fetch last 3 request records (complaints)
      const { data: requestData, error: requestError } = await supabase
        .from('request')
        .select(`
          *,
          student ( name, roll_no )
        `)
        .order('request_date', { ascending: false })
        .limit(3);

      if (requestError) {
        console.error('Error fetching request records:', requestError);
      } else {
        setComplaints(requestData || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllRequests = () => {
    navigate('/warden-leave');
  };

  const handleViewAllComplaints = () => {
    navigate('/warden-complaint');
  };



  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-resolved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  return (
    <WardenLayout>
      <div className="wrapper">
        <div className="leftSect">
          <div className="stdReport">
            <h2>Student Reports</h2>
            {loading ? (
              <p style={{color: 'white'}}>Loading student data...</p>
            ) : (
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-info">
                    <div className="stat-number">{studentStats.notSignedIn}</div>
                    <div className="stat-label">Not signed in today</div>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-info">
                    <div className="stat-number">{studentStats.onLeave}</div>
                    <div className="stat-label">Currently on leave</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="leaves">
            <h2 className="leaveHead">Leave Requests</h2>
            {loading ? (
              <p>Loading leave requests...</p>
            ) : (
              <>
                <ul className="lists">
                  {leaveRequests.length === 0 ? (
                    <li className="leaveItem">
                      <div className="info">
                        <p>No leave requests found</p>
                      </div>
                    </li>
                  ) : (
                    leaveRequests.map((leave) => (
                      <li key={leave.leave_id} className="leaveItem">
                        <div className="info">
                          <h3>{leave.student?.name || 'Unknown Student'}</h3>
                          <p>{leave.reason || 'Leave request'}</p>
                          <small>From: {formatDate(leave.leave_start_time)} to {formatDate(leave.leave_end_time)}</small>
                        </div>
                        {leave.approved_by ? (
                          <span className="status-approved">
                            Approved
                          </span>
                        ) : leave.approved_by === false ? (
                          <span className="status-rejected">
                            Rejected
                          </span>
                        ) : (
                          <span className="status-pending">
                            Pending
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
                <button className="alls" onClick={handleViewAllRequests}>View all Requests</button>
              </>
            )}
          </div>
        </div>
        <hr className="hrline" />

        <div className="complaints">
          <h2 className="complaints">Complaints</h2>
          {loading ? (
            <p>Loading complaints...</p>
          ) : (
            <>
              <ul className="clists">
                {complaints.length === 0 ? (
                  <li className="compItem">
                    <div className="cinfo">
                      <p>No complaints found</p>
                    </div>
                  </li>
                ) : (
                  complaints.map((complaint) => (
                    <li key={complaint.request_id} className="compItem">
                      <div className="cinfo">
                        <h3>{complaint.student?.name || 'Unknown Student'}</h3>
                        <p>{complaint.student?.roll_no || complaint.roll_no}</p>
                        <p>
                          <b>{complaint.request_type || 'General Request'}</b>
                        </p>
                        <small>{complaint.description}</small>
                      </div>
                      <div className="right">
                        <div className={`status ${getStatusClass(complaint.status)}`}>
                          <p>{complaint.status || 'pending'}</p>
                        </div>
                        <p>Request Date: {formatDate(complaint.request_date)}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <button className="alls" onClick={handleViewAllComplaints}>View all Complaints</button>
            </>
          )}
        </div>
      </div>
    </WardenLayout>
  );
};

export default WardenDashboard;
