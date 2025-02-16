import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ToDo from './components/ToDo';
import './App.css';

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route
                  path="/todo"
                  element={
                      <PrivateRoute>
                          <ToDo />
                      </PrivateRoute>
                  }
              />
          </Routes>
      </Router>
  );
}

export default App;
