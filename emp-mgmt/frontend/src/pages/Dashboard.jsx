import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { __employeeapiurl } from "../API/API_URL";

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, fontSize: '22px', fontWeight: '600', color: '#222' },
  welcome: { fontSize: '14px', color: '#666', margin: '0 0 24px' },
  cards: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', flex: '1', minWidth: '140px' },
  cardLabel: { fontSize: '13px', color: '#888', margin: '0 0 4px' },
  cardValue: { fontSize: '28px', fontWeight: '600', color: '#222', margin: 0 },
  btn: { padding: '9px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnOutline: { padding: '9px 18px', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnDanger: { padding: '8px 16px', background: '#fff', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  actions: { display: 'flex', gap: '10px' },
};

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(__employeeapiurl + "fetch", {
        headers: { Authorization: localStorage.getItem("token") }
      });

      if (res.data.status) {
        setEmployees(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const activeCount = employees.filter(e => e.status === "Active").length;
  const inactiveCount = employees.filter(e => e.status === "Inactive").length;

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Dashboard</h1>
        <button style={s.btnDanger} onClick={logout}>Logout</button>
      </div>

      <p style={s.welcome}>Welcome, {localStorage.getItem("name")}</p>

      <div style={s.cards}>
        <div style={s.card}>
          <p style={s.cardLabel}>Total Employees</p>
          <p style={s.cardValue}>{total}</p>
        </div>
        <div style={s.card}>
          <p style={s.cardLabel}>Active</p>
          <p style={{ ...s.cardValue, color: '#16a34a' }}>{activeCount}</p>
        </div>
        <div style={s.card}>
          <p style={s.cardLabel}>Inactive</p>
          <p style={{ ...s.cardValue, color: '#b91c1c' }}>{inactiveCount}</p>
        </div>
      </div>

      <div style={s.actions}>
        <button style={s.btn} onClick={() => navigate('/add')}>Add Employee</button>
        <button style={s.btnOutline} onClick={() => navigate('/employees')}>View Employees</button>
      </div>
    </div>
  );
}

export default Dashboard;
