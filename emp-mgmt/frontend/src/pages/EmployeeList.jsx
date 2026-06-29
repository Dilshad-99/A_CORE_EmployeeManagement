import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { __employeeapiurl } from "../API/API_URL";

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  title: { margin: 0, fontSize: '22px', fontWeight: '600', color: '#222' },
  actions: { display: 'flex', gap: '10px' },
  btn: { padding: '9px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnOutline: { padding: '9px 18px', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnSmall: { padding: '6px 12px', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' },
  btnDanger: { padding: '6px 12px', background: '#fff', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' },
  filters: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', outline: 'none', minWidth: '180px' },
  select: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' },
  total: { fontSize: '13px', color: '#666', marginBottom: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', background: '#fafafa', borderBottom: '1px solid #e0e0e0', textTransform: 'uppercase' },
  td: { padding: '10px 14px', fontSize: '13px', color: '#333', borderBottom: '1px solid #f0f0f0' },
  pagination: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', fontSize: '13px', color: '#666' },
  pageBtn: { padding: '6px 14px', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' },
};

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, [search, department, status, page]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(__employeeapiurl + "fetch", {
        params: { search, department, status, page, limit: 10 },
        headers: { Authorization: localStorage.getItem("token") }
      });

      if (res.data.status) {
        setEmployees(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); }
    }
  };

  const deleteEmployee = async (_id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete(__employeeapiurl + "delete", {
        data: { _id },
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("Employee deleted");
      fetchEmployees();
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); return; }
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Employees</h1>
        <div style={s.actions}>
          <button style={s.btn} onClick={() => navigate('/add')}>Add Employee</button>
          <button style={s.btnOutline} onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </div>

      <div style={s.filters}>
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email..." style={s.input} />
        <select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }} style={s.select}>
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Operations">Operations</option>
          <option value="Design">Design</option>
          <option value="Legal">Legal</option>
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={s.select}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <p style={s.total}>Total: {total}</p>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Name</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Mobile</th>
            <th style={s.th}>Department</th>
            <th style={s.th}>Designation</th>
            <th style={s.th}>Salary</th>
            <th style={s.th}>Joining Date</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td style={s.td}>{emp.name}</td>
              <td style={s.td}>{emp.email}</td>
              <td style={s.td}>{emp.mobile}</td>
              <td style={s.td}>{emp.department}</td>
              <td style={s.td}>{emp.designation}</td>
              <td style={s.td}>{emp.salary}</td>
              <td style={s.td}>{emp.joiningDate}</td>
              <td style={s.td}>
                <span style={{ color: emp.status === 'Active' ? '#16a34a' : '#b91c1c', fontWeight: '500' }}>{emp.status}</span>
              </td>
              <td style={{ ...s.td, display: 'flex', gap: '6px' }}>
                <button style={s.btnSmall} onClick={() => navigate('/update/' + emp._id)}>Edit</button>
                <button style={s.btnDanger} onClick={() => deleteEmployee(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr><td colSpan="9" style={{ ...s.td, textAlign: 'center', color: '#999' }}>No employees found</td></tr>
          )}
        </tbody>
      </table>

      <div style={s.pagination}>
        <button style={s.pageBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button style={s.pageBtn} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default EmployeeList;
