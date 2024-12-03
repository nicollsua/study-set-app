// src/components/StudySet/EditSet.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditSet() {
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudySet = async () => {
      try {
        const docRef = doc(db, 'studysets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCards(data.cards);
        }
      } catch (error) {
        console.error('Error fetching study set:', error);
      }
    };

    fetchStudySet();
  }, [id]);

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleAddCard = () => {
    setCards([...cards, { term: '', definition: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'studysets', id);
      await updateDoc(docRef, {
        title,
        cards
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating study set:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '2rem' }}>Edit Study Set</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Set Title"
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        {cards.map((card, index) => (
          <div key={index} style={{
            display: 'flex',
            marginBottom: '1rem',
            gap: '1rem'
          }}>
            <input
              type="text"
              value={card.term}
              onChange={(e) => handleCardChange(index, 'term', e.target.value)}
              placeholder="Term"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              value={card.definition}
              onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
              placeholder="Definition"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={handleAddCard}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Add Card
          </button>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSet;