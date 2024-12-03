import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

function StudySetView() {
  const [studySet, setStudySet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchStudySet = async () => {
      try {
        const docRef = doc(db, 'studysets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudySet(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching study set:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudySet();
  }, [id]);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => 
      prev > 0 ? prev - 1 : studySet.cards.length - 1
    );
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => 
      (prev + 1) % studySet.cards.length
    );
    setIsFlipped(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!studySet) return <div>Study set not found</div>;

  const currentCard = studySet.cards[currentCardIndex];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '1rem' }}>{studySet.title}</h1>
      
      {/* Flashcard */}
      <div 
        onClick={handleCardFlip}
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          perspective: '1000px',
          transition: 'transform 0.6s'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          textAlign: 'center',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s'
        }}>
          {/* Front of Card */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
          }}>
            {currentCard.term}
          </div>

          {/* Back of Card */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            padding: '1rem',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px'
          }}>
            {currentCard.definition}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '1rem' 
      }}>
        <button 
          onClick={handlePreviousCard}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            flex: 1,
            marginRight: '0.5rem'
          }}
        >
          Previous
        </button>
        <button 
          onClick={handleNextCard}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            flex: 1,
            marginLeft: '0.5rem'
          }}
        >
          Next
        </button>
      </div>
      
      {/* Card Counter */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem', 
        color: '#666' 
      }}>
        Card {currentCardIndex + 1} of {studySet.cards.length}
      </div>
    </div>
  );
}

export default StudySetView;