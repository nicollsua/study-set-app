import React, { useState } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CreateSet() {
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState([{ term: '', definition: '' }]);
  const navigate = useNavigate();

  const handleAddCard = () => {
    setCards([...cards, { term: '', definition: '' }]);
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredCards = cards.filter(card => card.term && card.definition);
      if (!title || filteredCards.length === 0) return;

      await addDoc(collection(db, 'studysets'), {
        title,
        cards: filteredCards,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        progress: {
          studiedCards: [],  // Track which cards have been studied
          lastStudied: null
        }
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating study set:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '2rem' }}>Create New Study Set</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '2rem',
            fontSize: '1.1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        
        {cards.map((card, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <input
              type="text"
              placeholder="Term"
              value={card.term}
              onChange={(e) => handleCardChange(index, 'term', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              placeholder="Definition"
              value={card.definition}
              onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddCard}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '1rem',
            cursor: 'pointer'
          }}
        >
          Add Card
        </button>
        
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Set
        </button>
      </form>
    </div>
  );
}

export default CreateSet;