// src/pages/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RecipeDetail.module.css';

export default function RecipeDetail(){
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data);
        const likes = res.data.likes || [];
        setLiked(user ? likes.some(u => String(u) === String(user.id) ) : false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading recipe…</p>;
  if (error) return <p style={{color:'red'}}>Error: {error}</p>;
  if (!recipe) return <p>No recipe found.</p>;

  const img = recipe.image ? (recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`) : '';

  const handleLike = async () => {
    try {
      const res = await api.patch(`/recipes/${id}/like`);
      setLiked(res.data.liked);
      setRecipe(prev => ({...prev, likes: res.data.likesCount ?? prev.likes}));
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Please login to like recipes.');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Error liking recipe');
      }
    }
  };

  const isAuthor = user && recipe.author && String(recipe.author._id || recipe.author) === String(user.id);

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={()=>navigate(-1)}>← Back</button>
      <div className={styles.header}>
        <h2 className={styles.title}>{recipe.title}</h2>
      </div>
      {img && <img className={styles.image} src={img} alt={recipe.title} />}
      <p className={styles.meta}>{recipe.description}</p>

      <div className={styles.section}>
        <h4>Ingredients</h4>
        <ul>{(recipe.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}</ul>
      </div>

      <div className={styles.section}>
        <h4>Steps</h4>
        <ol>{(recipe.steps || []).map((s, i) => <li key={i}>{s}</li>)}</ol>
      </div>

      <div className={styles.section}>
        <div className={styles.actions}>
          <div className={styles.likes}>Likes: {Array.isArray(recipe.likes) ? recipe.likes.length : recipe.likes || 0}</div>
          <button onClick={handleLike} className="btn btn-primary">{liked ? 'Unlike' : 'Like'}</button>
          {isAuthor && <button className="btn btn-outline" onClick={()=>alert('Edit flow: implement edit page')}>Edit recipe</button>}
        </div>
      </div>
    </div>
  );
}
