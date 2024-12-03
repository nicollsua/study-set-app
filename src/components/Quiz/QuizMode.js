import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function QuizMode() {
  const [studySet, setStudySet] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [masteryProgress, setMasteryProgress] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudySet = async () => {
      try {
        const docRef = doc(db, 'studysets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const setData = docSnap.data();
          setStudySet(setData);
          
          // Initialize mastery progress
          const initialMastery = setData.cards.reduce((acc, card) => {
            acc[card.term] = {
              mastered: false,
              attempts: 0,
              correctAttempts: 0
            };
            return acc;
          }, {});
          setMasteryProgress(initialMastery);
        }
      } catch (error) {
        console.error('Error fetching study set:', error);
      }
    };

    fetchStudySet();
  }, [id]);

  const updateMasteryProgress = (term, isCorrect) => {
    setMasteryProgress(prev => {
      return {
        ...prev,
        [term]: {
          mastered: isCorrect,
          attempts: prev[term].attempts + 1,
          correctAttempts: isCorrect 
            ? prev[term].correctAttempts + 1 
            : prev[term].correctAttempts
        }
      };
    });
  };

  const handleAnswer = (answer) => {
    const currentCard = studySet.cards[currentQuestion];
    const correct = answer === currentCard.definition;
    
    setSelectedAnswer(answer);
    updateMasteryProgress(currentCard.term, correct);

    if (correct) {
      setScore(score + 1);
    }

    // Move to next question or end quiz
    setTimeout(() => {
      if (currentQuestion < studySet.cards.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
      } else {
        setQuizComplete(true);
        saveQuizResults();
      }
    }, 1000);
  };

  const saveQuizResults = async () => {
    try {
      const quizPercentage = Math.round((score / studySet.cards.length) * 100);
      
      const docRef = doc(db, 'studysets', id);
      await updateDoc(docRef, {
        progress: {
          quizScore: quizPercentage,
          totalCards: studySet.cards.length,
          scoredCards: score
        },
        lastQuizDate: new Date(),
        totalQuizzes: (studySet.totalQuizzes || 0) + 1
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  if (!studySet) return <div>Loading...</div>;

  if (quizComplete) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#1976d2', marginBottom: '2rem' }}>Quiz Complete!</h1>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Quiz Results</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
            {((score / studySet.cards.length) * 100).toFixed(1)}%
          </p>
          <p>Score: {score} out of {studySet.cards.length}</p>
          
          <div>
            <h3>Detailed Results</h3>
            <ul>
              {studySet.cards.map((card) => {
                const progress = masteryProgress[card.term];
                return (
                  <li key={card.term} style={{ 
                    marginBottom: '0.5rem',
                    color: progress.mastered ? '#4CAF50' : '#ff4444'
                  }}>
                    {card.term} - {progress.mastered ? 'Mastered' : 'Needs More Practice'}
                  </li>
                );
              })}
            </ul>
          </div>

          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          >
            Back to Study Sets
          </button>
        </div>
      </div>
    );
  }

  const currentCard = studySet.cards[currentQuestion];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '2rem' }}>{studySet.title} - Quiz</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ marginBottom: '1rem' }}>What is the definition of:</h2>
        <p style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#1976d2',
          marginBottom: '2rem'
        }}>
          {currentCard.term}
        </p>

        {studySet.cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(card.definition)}
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: selectedAnswer === card.definition 
                ? (card.definition === currentCard.definition ? '#4CAF50' : '#ff4444')
                : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {card.definition}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizMode;