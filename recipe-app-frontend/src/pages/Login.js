// src/pages/Login.js
import React, {useState} from 'react';
import api from '../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from '../styles/Form.module.css';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <h2>Login</h2>

      <div className={styles.field}>
        <input className={styles.input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
      </div>

      <div className={styles.field}>
        <input className={styles.input} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
      </div>

      <div className={styles.row}>
        <button className="btn btn-primary">Login</button>
        <Link to="/register" style={{alignSelf:'center'}}>Register</Link>
      </div>
    </form>
  );
}

