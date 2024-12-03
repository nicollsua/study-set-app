import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Auth/Login';
import StudySetList from './components/StudySet/StudySetList';
import CreateSet from './components/StudySet/CreateSet';
import StudySetView from './components/StudySet/StudySetView';
import QuizMode from './components/Quiz/QuizMode';
import PrivateRoute from './components/Auth/PrivateRoute';
import EditSet from './components/StudySet/EditSet';

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: '#f8f9fa' }}>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <StudySetList />
            </PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute>
              <CreateSet />
            </PrivateRoute>
          } />
          <Route path="/set/:id" element={
            <PrivateRoute>
              <StudySetView />
            </PrivateRoute>
          } />
          <Route path="/quiz/:id" element={
            <PrivateRoute>
              <QuizMode />
            </PrivateRoute>
          } />
          <Route path="/edit/:id" element={
          <PrivateRoute>
            <EditSet />
          </PrivateRoute>
        } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
