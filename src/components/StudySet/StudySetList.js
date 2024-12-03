import React, { useEffect, useState } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function StudySetList() {
  const [studySets, setStudySets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudySets = async () => {
      try {
        const q = query(
          collection(db, 'studysets'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const sets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudySets(sets);
      } catch (error) {
        console.error('Error fetching study sets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudySets();
  }, []);

  const calculateProgress = (set) => {
    // If no quiz progress exists, return 0
    if (!set.progress || !set.progress.quizScore) return 0;
    
    return set.progress.quizScore;
  };

  const getQuizFrequency = (set) => {
    // Calculate quiz frequency based on last quiz date
    if (!set.lastQuizDate) return 'Never';

    const lastQuizDate = set.lastQuizDate.toDate(); // Assuming it's a Firestore timestamp
    const now = new Date();
    const daysSinceLastQuiz = Math.floor((now - lastQuizDate) / (1000 * 60 * 60 * 24));

    if (daysSinceLastQuiz === 0) return 'Today';
    if (daysSinceLastQuiz === 1) return 'Yesterday';
    return `${daysSinceLastQuiz} days ago`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '2rem' }}>My Study Sets</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {studySets.map(set => (
          <div key={set.id} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1976d2', marginBottom: '1rem' }}>{set.title}</h2>
            
            {/* Quiz Progress Bar */}
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '5px', 
              marginBottom: '1rem' 
            }}>
              <div style={{
                width: `${calculateProgress(set)}%`,
                height: '20px',
                backgroundColor: '#4CAF50', // Green color for quiz progress
                borderRadius: '5px',
                transition: 'width 0.5s ease-in-out'
              }}></div>
              <p style={{ textAlign: 'center', color: '#666' }}>
                Quiz Progress: {calculateProgress(set)}%
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '1rem',
              color: '#666'
            }}>
              <p>{set.cards.length} cards</p>
              <p>Last Quiz: {getQuizFrequency(set)}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link to={`/set/${set.id}`} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}>
                Study
              </Link>
              <Link to={`/quiz/${set.id}`} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2196f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}>
                Quiz
              </Link>
              <Link to={`/edit/${set.id}`} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}>
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudySetList;
