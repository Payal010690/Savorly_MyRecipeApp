// src/pages/Feed.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import styles from './Feed.module.css';

export default function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await api.get('/recipes');
        if (!mounted) return;
        setRecipes(res.data.recipes || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p>Loading recipes…</p>;
  if (error) return <p style={{color:'red'}}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>All Recipes</h2>
      {recipes.length === 0 && <p className={styles.empty}>No recipes yet. Be the first to add one!</p>}
      <div className={styles.grid}>
        {recipes.map(r => {
          const img = r.image ? (r.image.startsWith('http') ? r.image : `http://localhost:5000${r.image}`) : '';
          return (
            <article key={r._id} className={styles.card}>
              {img && <img className={styles.thumb} src={img} alt={r.title} />}
              <div className={styles.meta}>
                <h3 className={styles.title}>{r.title}</h3>
                <p className={styles.desc}>{r.description?.slice(0,120)}</p>
                <p className={styles.author}>By: {r.author?.name || 'Unknown'}</p>
                <Link className={styles.link} to={`/recipe/${r._id}`}>View recipe →</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
