import axios from "axios";
import { useState } from "react";
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

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(__employeeapiurl + "register", { name, email, password });

      if (res.data.status) {
        alert("Registration successful!");
        setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
        navigate('/login');
      } else {
        setError(res.data.message || "Registration failed");
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
        <h1 style={s.title}>Register</h1>
        <p style={s.subtitle}>Create a new account</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Full Name</label>
            <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} style={s.input} />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={s.input} />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <div style={s.passWrap}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={s.passInput} />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Confirm Password</label>
            <div style={s.passWrap}>
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={s.passInput} />
              <button type="button" style={s.eyeBtn} onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                {showConfirmPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account? <span style={s.link} onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
