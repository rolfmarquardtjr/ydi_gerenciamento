import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/dashboards/AdminDashboard';
import CompanyList from './components/CompanyList';
import ManagerList from './components/ManagerList';
import SettingsPage from './components/SettingsPage';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import TelemetryDashboard from './components/TelemetryDashboard';
import RecruitmentManagement from './components/RecruitmentManagement';
import CandidateDashboard from './components/dashboards/CandidateDashboard';
import CompanySelectionProcess from './components/CompanySelectionProcess';
import AssessmentConfiguration from './components/AssessmentConfiguration';
import UserList from './components/UserList';
import DriverAreaConfig from './components/admin/DriverAreaConfig';
import NAVTAssessment from './components/assessments/NAVTAssessment';
import NAVTResults from './components/assessments/NAVTResults';
import DriverDashboard from './components/dashboards/DriverDashboard';
import KnowledgeAssessment from './components/assessments/KnowledgeAssessment';
import KnowledgeResults from './components/assessments/KnowledgeResults';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Routes>
            {user.role === 'admin' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/companies" element={<CompanyList />} />
                <Route path="/admin/managers" element={<ManagerList />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/companies/:companyId/driver-area" element={<DriverAreaConfig />} />
                <Route path="/admin/companies/:companyId/selection-process" element={<CompanySelectionProcess />} />
                <Route path="/admin/companies/:companyId/assessment" element={<AssessmentConfiguration />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            )}
            {user.role === 'manager' && (
              <>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/telemetry" element={<TelemetryDashboard />} />
                <Route path="/manager/recruitment" element={<RecruitmentManagement />} />
                <Route path="/manager/users" element={<UserList />} />
                <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
              </>
            )}
            {user.role === 'driver' && (
              <>
                <Route path="/driver/dashboard" element={<DriverDashboard />} />
                <Route path="/driver/navt-assessment" element={<NAVTAssessment />} />
                <Route path="/driver/navt-results" element={<NAVTResults />} />
                <Route path="/driver/knowledge-assessment" element={<KnowledgeAssessment />} />
                <Route path="/driver/knowledge-results" element={<KnowledgeResults />} />
                <Route path="*" element={<Navigate to="/driver/dashboard" replace />} />
              </>
            )}
            {user.role === 'candidate' && (
              <>
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                <Route path="*" element={<Navigate to="/candidate/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;