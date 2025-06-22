// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import CreateClubPage from './pages/CreateClubPage';
import SuccessPage from './pages/SuccessPage';
import ClubMainPage from './pages/ClubMainPage';
import SignupPage from './pages/SignupPage';
import SelectOperationLogTypePage from './pages/SelectOperationLogTypePage';
import CreateOperationLogPage from './pages/CreateOperationLogPage';
import OperationLogDetailPage from './pages/OperationLogDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/create-club" element={<CreateClubPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/club/:clubId" element={<ClubMainPage />} />
        <Route path="/club/:clubId/operation-logs/new" element={<SelectOperationLogTypePage />} />
        <Route path="/club/:clubId/operation-logs/create/:postType" element={<CreateOperationLogPage />} />
        <Route path="/club/:clubId/operation-logs/:logId" element={<OperationLogDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;