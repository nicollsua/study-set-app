// src/components/Quiz/QuizSettings.js
import React, { useState } from 'react';

function QuizSettings({ studySet, onStartQuiz }) {
  const [quizType, setQuizType] = useState('multiple-choice');
  const [numberOfQuestions, setNumberOfQuestions] = useState(studySet.cards.length);
  const [selectedTopics, setSelectedTopics] = useState(
    studySet.cards.map(card => card.term)
  );

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const startQuiz = () => {
    const filteredCards = studySet.cards.filter(card => 
      selectedTopics.includes(card.term)
    ).slice(0, numberOfQuestions);

    onStartQuiz({
      quizType,
      cards: filteredCards
    });
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>Quiz Settings</h2>
      
      {/* Quiz Type Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Quiz Type:</label>
        <select 
          value={quizType}
          onChange={(e) => setQuizType(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginTop: '0.5rem'
          }}
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
          <option value="fill-blank">Fill-in-the-Blank</option>
        </select>
      </div>

      {/* Number of Questions */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Number of Questions:</label>
        <input 
          type="number"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(
            Math.min(studySet.cards.length, Math.max(1, Number(e.target.value)))
          )}
          min="1"
          max={studySet.cards.length}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginTop: '0.5rem'
          }}
        />
      </div>

      {/* Topic Selection */}
      <div>
        <label>Select Topics:</label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.5rem',
          marginTop: '0.5rem'
        }}>
          {studySet.cards.map(card => (
            <label key={card.term} style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox"
                checked={selectedTopics.includes(card.term)}
                onChange={() => handleTopicToggle(card.term)}
              />
              <span style={{ marginLeft: '0.5rem' }}>{card.term}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={startQuiz}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginTop: '1rem'
        }}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default QuizSettings;