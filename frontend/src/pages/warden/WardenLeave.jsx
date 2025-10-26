import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import './WardenLeave.css';

function WardenLeave() {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  const fetchLeaveRecords = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('leave_record')
        .select(`
          *,
          student ( name, roll_no )
        `)
        .order('leave_start_time', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to fetch leave records');
      } else {
        console.log('Leave records data:', data);
        setLeaveRequests(data || []);
      }
    } catch (err) {
      console.error('Error fetching leave records:', err);
      setError('Failed to fetch leave records');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const getStatusDisplay = (record) => {
    if (record.approved_by) {
      return 'approved';
    } else if (record.approved_by === false) {
      return 'rejected';
    }

    const now = new Date();
    const endDate = new Date(record.leave_end_time);

    if (now > endDate) {
      return 'late';
    }

    const startDate = new Date(record.leave_start_time);
    if (now >= startDate && now <= endDate) {
      return 'ontime';
    }

    return 'pending';
  };

  if (loading) {
    return (
      <div className="leave-page">
        <div className="leave-header">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <h1 className="page-title">Leave Requests</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading leave records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leave-page">
        <div className="leave-header">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <h1 className="page-title">Leave Requests</h1>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchLeaveRecords}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leave-page">
      <div className="leave-header">
        <button className="back-button" onClick={handleGoBack}>
          ← Back
        </button>
        <h1 className="page-title">Leave Requests</h1>
      </div>

      <div className="leave-content">
        {leaveRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Leave Records Found</h3>
            <p>There are currently no leave requests to display.</p>
          </div>
        ) : (
          <div className="leave-table-container">
            <div className="table-wrapper">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%', minWidth: '200px' }}>Applicant</th>
                    <th style={{ width: '50%', minWidth: '300px' }}>Details</th>
                    <th style={{ width: '25%', minWidth: '150px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((record, index) => {
                    const status = getStatusDisplay(record);
                    const studentName = record.student?.name || record.name || 'Unknown Student';
                    const rollNo = record.student?.roll_no || record.roll_no || 'No Roll No';

                    console.log(`Record ${index}:`, {
                      studentName,
                      rollNo,
                      fullRecord: record
                    });

                    return (
                      <tr key={record.leave_id || index}>
                        <td style={{ width: '25%', minWidth: '200px', padding: '16px', verticalAlign: 'top', borderRight: '1px solid #ddd' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                              {studentName}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>
                              {rollNo}
                            </div>
                          </div>
                        </td>
                        <td style={{ width: '50%', minWidth: '300px', padding: '16px', verticalAlign: 'top', borderRight: '1px solid #ddd' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span style={{ fontWeight: 'bold', minWidth: '60px' }}>From:</span>
                              <span>{formatDate(record.leave_start_time)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span style={{ fontWeight: 'bold', minWidth: '60px' }}>To:</span>
                              <span>{formatDate(record.leave_end_time)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span style={{ fontWeight: 'bold', minWidth: '60px' }}>Reason:</span>
                              <span>{record.reason || 'No reason provided'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ width: '25%', minWidth: '150px', padding: '16px', textAlign: 'center', verticalAlign: 'top' }}>
                          <span className={`status-badge status-${status}`}>
                            {status === 'approved' && 'Approved'}
                            {status === 'rejected' && 'Rejected'}
                            {status === 'late' && 'Late Return'}
                            {status === 'ontime' && 'On Time'}
                            {status === 'pending' && 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WardenLeave;