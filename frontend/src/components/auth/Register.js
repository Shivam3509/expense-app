import React, { useState } from 'react';
import '../css/Register.css';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('register/', form);
      alert(res.data.message);
    } catch (err) {
      const errorData = err.response?.data;
      alert(Object.values(errorData).join('\n'));
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">Register</button>
        <p className="auth-link">Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}
