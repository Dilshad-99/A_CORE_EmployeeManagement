import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { __employeeapiurl } from "../API/API_URL";

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif', padding: '24px' },
  card: { background: '#fff', borderRadius: '8px', padding: '28px', maxWidth: '500px', border: '1px solid #e0e0e0' },
  title: { margin: '0 0 20px', fontSize: '20px', fontWeight: '600', color: '#222' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' },
  row: { display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' },
  fieldGroup: { marginBottom: '14px', flex: '1', minWidth: '200px' },
  label: { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500', color: '#333' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff' },
  actions: { display: 'flex', gap: '10px', marginTop: '8px' },
  btn: { padding: '9px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnOutline: { padding: '9px 18px', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
};

function UpdateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { _id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(__employeeapiurl + "fetch/" + _id, {
        headers: { Authorization: localStorage.getItem("token") }
      });

      if (res.data.status) {
        const emp = res.data.data;
        setName(emp.name); setEmail(emp.email); setMobile(emp.mobile);
        setDepartment(emp.department); setDesignation(emp.designation);
        setSalary(emp.salary); setJoiningDate(emp.joiningDate); setStatus(emp.status);
      } else {
        alert("Employee not found");
        navigate('/employees');
      }
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); return; }
      alert("Failed to fetch employee");
      navigate('/employees');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !mobile || !department || !designation || !salary || !joiningDate) {
      setError("Please fill all the fields");
      return;
    }

    if (mobile.length !== 10) {
      setError("Mobile must be 10 digits");
      return;
    }

    try {
      const res = await axios.patch(__employeeapiurl + "update", {
        _id, name, email, mobile, department, designation, salary: Number(salary), joiningDate, status,
      }, {
        headers: { Authorization: localStorage.getItem("token") }
      });

      if (res.data.status) {
        alert("Employee updated");
        navigate('/employees');
      } else {
        setError(res.data.message || "Failed to update");
      }
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); return; }
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Update Employee</h1>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleUpdate}>
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={s.input} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={s.input} />
            </div>
          </div>

          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Mobile</label>
              <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength="10" style={s.input} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} style={s.select}>
                <option value="">Select</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Design">Design</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Designation</label>
              <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} style={s.input} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Salary</label>
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} style={s.input} />
            </div>
          </div>

          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Joining Date</label>
              <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} style={s.input} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={s.select}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={s.actions}>
            <button type="submit" style={s.btn}>Update</button>
            <button type="button" style={s.btnOutline} onClick={() => navigate('/employees')}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmployee;
