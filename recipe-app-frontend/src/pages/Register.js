// src/pages/Register.js
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Form.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('email', email);
      fd.append('password', password);
      if (image) fd.append('image', image);

      const { data } = await api.post('/auth/register', fd);
      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration error');
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <h2>Register</h2>

      <div className={styles.field}>
        <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      </div>

      <div className={styles.field}>
        <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      </div>

      <div className={styles.field}>
        <input className={styles.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      </div>

      <div className={styles.field}>
        <input className={styles.file} type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <div className={styles.helper}>Profile image (optional)</div>
      </div>

      <div className={styles.row}>
        <button type="submit" className="btn btn-primary">Register</button>
        <Link to="/login" style={{alignSelf:'center'}}>Already have an account?</Link>
      </div>
    </form>
  );
}
