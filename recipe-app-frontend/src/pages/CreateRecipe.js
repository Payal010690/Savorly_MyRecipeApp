import React, { useState } from 'react';
import api from '../api/axios';

export default function CreateRecipe() {
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [image,setImage]=useState(null);
  const [ingredients,setIngredients]=useState('');

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', desc);
    fd.append('ingredients', JSON.stringify(ingredients.split(',')));
    if (image) fd.append('image', image);
    try {
      const { data } = await api.post('/recipes', fd); // axios auto sets multipart
      alert('Saved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" />
      <input value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="comma separated ingredients" />
      <input type="file" onChange={e=>setImage(e.target.files[0])} accept="image/*" required />
      <button type="submit">Create</button>
    </form>
  );
}
