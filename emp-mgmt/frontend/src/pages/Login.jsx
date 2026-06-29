import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { __employeeapiurl } from "../API/API_URL";

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'sans-serif', padding: '20px' },
  card: { background: '#fff', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '400px', border: '1px solid #e0e0e0' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: '600', color: '#222' },
  subtitle: { margin: '0 0 24px', fontSize: '13px', color: '#888' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500', color: '#333' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  passWrap: { position: 'relative' },
  passInput: { width: '100%', padding: '9px 38px 9px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#888', padding: 0 },
  btn: { width: '100%', padding: '10px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '4px' },
  footer: { textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#666' },
  link: { color: '#2563eb', fontWeight: '500', cursor: 'pointer' },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(__employeeapiurl + "check-admin").then(res => {
      setAdminExists(res.data.adminExists);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(__employeeapiurl + "login", { email, password });

      if (res.data.status) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("_id", res.data.user._id);
        localStorage.setItem("name", res.data.user.name);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("role", res.data.user.role);
        navigate('/dashboard');
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Admin Login</h1>
        <p style={s.subtitle}>Sign in to manage employees</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={s.input} />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <div style={s.passWrap}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={s.passInput} />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {!adminExists && (
          <p style={s.footer}>
            No admin account? <span style={s.link} onClick={() => navigate('/register')}>Setup Admin</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
