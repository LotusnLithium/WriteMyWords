import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import RequestWizard from './pages/RequestWizard.jsx';
import RequestsDirectory from './pages/RequestsDirectory.jsx';
import ExpertDashboard from './pages/ExpertDashboard.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import { HowItWorks, ForStudents, ForExperts } from './pages/StaticPages.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/for-experts" element={<ForExperts />} />
        <Route path="/requests" element={<RequestsDirectory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard/requests/new" element={<RequestWizard />} />
        <Route path="/expert-dashboard" element={<ExpertDashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/confirm" element={<AuthCallback />} />
      </Routes>
      <Footer />
    </>
  );
}
