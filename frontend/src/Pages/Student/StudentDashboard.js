import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

// --- UI Components for the new design ---

// Reusable card for the main statistics
const MetricCard = ({ icon, title, value, subValue, valueColor = '#000' }) => (
  <div style={styles.metricCard}>
    <div style={styles.metricIcon}>{icon}</div>
    <div>
      <div style={styles.metricTitle}>{title}</div>
      <div style={{...styles.metricValue, color: valueColor}}>{value}</div>
      <div style={styles.metricSubValue}>{subValue}</div>
    </div>
  </div>
);

// Component for "Today's Schedule" card
const TodaysSchedule = ({ schedule }) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>📅 Today's Schedule</h3>
    <p style={styles.cardSubtitle}>Your classes for today</p>
    {schedule.length > 0 ? schedule.map(item => (
      <div key={item.id} style={styles.scheduleItem}>
        <div>
          <div style={styles.scheduleCourse}>{item.course}</div>
          <div style={styles.scheduleDetails}>Room {item.room}, {item.prof}</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={styles.scheduleTime}>{item.time}</div>
          <div style={styles.scheduleDuration}>{item.duration} hours</div>
        </div>
      </div>
    )) : <p>No classes scheduled for today.</p>}
    <button style={styles.fullTimetableButton}>View Full Timetable</button>
  </div>
);

// Component for "Recent Notices" card
const RecentNotices = ({ notices }) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>🔔 Recent Notices</h3>
    <p style={styles.cardSubtitle}>Latest announcements from campus</p>
    {notices.map(notice => (
       <div key={notice.id} style={{...styles.noticeItem, borderLeft: `4px solid ${notice.color}`}}>
          <div style={styles.noticeTitle}>{notice.title}</div>
          <div style={styles.noticeTimestamp}>{notice.timestamp}</div>
      </div>
    ))}
  </div>
);

// --- Main StudentDashboard Component ---

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.token) return;

      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      try {
        // Fetch all data concurrently
        const [dashRes, scheduleRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/students/dashboard`, config),
          axios.get(`http://localhost:5000/api/students/schedule`, config)
          // You can add a fetch for notices here as well
        ]);

        setDashboardData(dashRes.data);
        setSchedule(scheduleRes.data);
        
        // Mock notices data since there's no endpoint
        setNotices([
            {id: 1, title: 'Mid-term Examination Schedule', timestamp: '2 hours ago', color: '#d9534f'},
            {id: 2, title: 'Library Extension Hours', timestamp: '1 day ago', color: '#5bc0de'},
            {id: 3, title: 'Sports Day Registration', timestamp: '3 days ago', color: '#5cb85c'},
        ]);

      } catch (error) {
        console.error("Failed to fetch student data", error);
        // Set mock data on error for UI development
        setDashboardData({ enrolledCourses: 6, attendance: 92, gpa: 3.7, feeStatus: 'Paid', feeTerm: 'Fall 2024' });
        setSchedule([
            {id: 1, course: 'CS101 - Programming', room: '201', prof: 'Dr. Smith', time: '9:00 AM', duration: 2},
            {id: 2, course: 'MATH201 - Calculus', room: '105', prof: 'Prof. Johnson', time: '1:00 PM', duration: 1.5},
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div style={styles.loadingScreen}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
            <span style={{fontSize: '24px', marginRight: '10px'}}>🎓</span>
            <div>
                <div style={styles.campusManagement}>Campus Management</div>
                <div style={styles.studentPortal}>Student Portal</div>
            </div>
        </div>
        <nav style={styles.nav}>
          <a href="#dashboard" style={{...styles.navLink, ...styles.activeLink}}>Dashboard</a>
          <a href="#grades" style={styles.navLink}>Grades</a>
          <a href="#feepayment" style={styles.navLink}>Fee Payment</a>
          <a href="#coursematerials" style={styles.navLink}>Course Materials</a>
          <a href="#academiccalendar" style={styles.navLink}>Academic Calendar</a>
        </nav>
        <div style={styles.userMenu}>
            <span>{user?.name || "Student User"}</span>
            <button onClick={logout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcomeBanner}>
          <h2>Welcome back, {user?.name || "Student User"}!</h2>
          <p>Student Dashboard - Campus Management System</p>
        </div>

        {/* Dashboard Metrics */}
        <div style={styles.metricsGrid}>
            <MetricCard icon="📖" title="Enrolled Courses" value={dashboardData?.enrolledCourses} subValue="This semester" />
            <MetricCard icon="⏰" title="Attendance" value={`${dashboardData?.attendance}%`} subValue="Average attendance" />
            <MetricCard icon="📊" title="Current GPA" value={dashboardData?.gpa} subValue="Out of 4.0" />
            <MetricCard icon="💲" title="Fee Status" value={dashboardData?.feeStatus} subValue={dashboardData?.feeTerm} valueColor="#28a745" />
        </div>
        
        {/* Main Grid */}
        <div style={styles.mainContentGrid}>
            <div style={styles.leftColumn}>
                <RecentNotices notices={notices} />
                <TodaysSchedule schedule={schedule} />
            </div>
            <div style={styles.rightColumn}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>My QR Code</h3>
                    <p style={styles.cardSubtitle}>Use this for campus entry and attendance</p>
                    <div style={styles.qrCodeContainer}>
                        <img src="https://i.imgur.com/gGk4tV3.png" alt="QR Code" style={{width: '150px'}} />
                        <p style={{marginTop: '10px', fontWeight: '500'}}>ID: {user?.id || 'STU001'}</p>
                    </div>
                </div>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Quick Actions</h3>
                    <div style={styles.quickActions}>
                        <a href="#grades" style={styles.quickActionItem}>📄 View Grades</a>
                        <a href="#payment" style={styles.quickActionItem}>💲 Fee Payment</a>
                        <a href="#materials" style={styles.quickActionItem}>📚 Course Materials</a>
                        <a href="#calendar" style={styles.quickActionItem}>📅 Academic Calendar</a>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

// --- New Styles for the modern UI ---
const styles = {
    loadingScreen: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontFamily: "'Segoe UI', sans-serif"},
    container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f6', color: '#333', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd' },
    logo: { display: 'flex', alignItems: 'center' },
    campusManagement: { fontWeight: 'bold' },
    studentPortal: { fontSize: '12px', color: '#666' },
    nav: { display: 'flex', gap: '15px' },
    navLink: { textDecoration: 'none', color: '#333', padding: '8px 12px', borderRadius: '5px', transition: 'background-color 0.2s' },
    activeLink: { backgroundColor: '#e9ecef', fontWeight: 'bold' },
    userMenu: { display: 'flex', alignItems: 'center', gap: '15px' },
    logoutButton: { padding: '8px 15px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#f8f9fa', fontWeight: '500' },
    main: { padding: '25px' },
    welcomeBanner: { background: 'linear-gradient(90deg, #17a2b8, #20c997)', color: 'white', padding: '25px', borderRadius: '10px', marginBottom: '25px' },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '25px' },
    metricCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    metricIcon: { fontSize: '36px' },
    metricTitle: { fontSize: '14px', color: '#6c757d' },
    metricValue: { fontSize: '28px', fontWeight: 'bold' },
    metricSubValue: { fontSize: '12px', color: '#adb5bd' },
    mainContentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' },
    leftColumn: { display: 'flex', flexDirection: 'column', gap: '25px' },
    rightColumn: { display: 'flex', flexDirection: 'column', gap: '25px' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    cardTitle: { marginTop: 0, marginBottom: '5px', fontSize: '18px' },
    cardSubtitle: { marginTop: 0, marginBottom: '20px', fontSize: '14px', color: '#6c757d' },
    scheduleItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' },
    scheduleCourse: { fontWeight: 'bold' },
    scheduleDetails: { fontSize: '14px', color: '#6c757d' },
    scheduleTime: { fontWeight: 'bold' },
    scheduleDuration: { fontSize: '14px', color: '#6c757d' },
    fullTimetableButton: { width: '100%', padding: '12px', marginTop: '20px', border: '1px solid #dee2e6', borderRadius: '5px', backgroundColor: '#f8f9fa', cursor: 'pointer', fontWeight: '500' },
    noticeItem: { marginBottom: '10px', padding: '12px', borderRadius: '5px', backgroundColor: '#f8f9fa' },
    noticeTitle: { fontWeight: 'bold' },
    noticeTimestamp: { fontSize: '12px', color: '#6c757d', marginTop: '4px' },
    qrCodeContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' },
    quickActions: { display: 'flex', flexDirection: 'column', gap: '10px' },
    quickActionItem: { display: 'block', padding: '12px', border: '1px solid #dee2e6', borderRadius: '5px', textDecoration: 'none', color: '#343a40', fontWeight: '500', transition: 'background-color 0.2s' },
};

export default StudentDashboard;