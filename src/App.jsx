import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/AuthComponents';
import GoogleCallback from './components/GoogleCallback';

import AppLayout from './components/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import CampaignsList from './pages/CampaignsPage';
import LeadsMaster from './pages/LeadsMaster';
import Leads from "./pages/Leads"
import InboxPage from './pages/InboxPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import CampaignPage from './pages/CampaignPage';
import CreateCampaign from './pages/CreateCampaign';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="campaigns" element={
                <ProtectedRoute><CampaignsList /></ProtectedRoute>
              } />
              <Route path="campaigns" element={
                <ProtectedRoute><CampaignsList /></ProtectedRoute>
              } />
              <Route path="campaigns/:id" element={
                <ProtectedRoute><CampaignPage /></ProtectedRoute>
              } />
              <Route path="campaigns/new" element={
                <ProtectedRoute><CreateCampaign /></ProtectedRoute>
              } />
              <Route path="leads" element={
                <ProtectedRoute><Leads /></ProtectedRoute>
              } />
              <Route path="inbox" element={
                <ProtectedRoute><InboxPage /></ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute><SettingsPage /></ProtectedRoute>
              } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;