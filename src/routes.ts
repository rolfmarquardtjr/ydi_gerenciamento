import { RouteObject } from 'react-router-dom';

// Components
import Login from './components/Login';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import CandidateDashboard from './components/dashboards/CandidateDashboard';
import CompanyList from './components/CompanyList';
import ManagerList from './components/ManagerList';
import SettingsPage from './components/SettingsPage';
import CompanySelectionProcess from './components/CompanySelectionProcess';
import AssessmentConfiguration from './components/AssessmentConfiguration';
import UserList from './components/UserList';
import TelemetryDashboard from './components/TelemetryDashboard';
import RecruitmentManagement from './components/RecruitmentManagement';
import AssessmentFlow from './components/assessments/AssessmentFlow';
import AssessmentResult from './components/assessments/AssessmentResult';

// Route Configuration
export const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/',
    element: <Login />
  },

  // Admin Routes
  {
    path: '/admin',
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'companies',
        element: <CompanyList />
      },
      {
        path: 'managers',
        element: <ManagerList />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'companies/:companyId/selection-process',
        element: <CompanySelectionProcess />
      },
      {
        path: 'companies/:companyId/assessment',
        element: <AssessmentConfiguration />
      }
    ]
  },

  // Manager Routes
  {
    path: '/manager',
    children: [
      {
        path: 'dashboard',
        element: <ManagerDashboard />
      },
      {
        path: 'telemetry',
        element: <TelemetryDashboard />
      },
      {
        path: 'recruitment',
        element: <RecruitmentManagement />
      },
      {
        path: 'users',
        element: <UserList />
      }
    ]
  },

  // Candidate Routes
  {
    path: '/candidate',
    children: [
      {
        path: 'dashboard',
        element: <CandidateDashboard />
      }
    ]
  },

  // Assessment Routes
  {
    path: '/assessment',
    children: [
      {
        path: ':testType',
        element: <AssessmentFlow />
      },
      {
        path: 'result',
        element: <AssessmentResult />
      }
    ]
  }
];

// API Routes (for future SQLite implementation)
export const apiRoutes = {
  // Auth
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh'
  },

  // Companies
  companies: {
    base: '/api/companies',
    getAll: '/api/companies',
    getById: (id: string) => `/api/companies/${id}`,
    create: '/api/companies',
    update: (id: string) => `/api/companies/${id}`,
    delete: (id: string) => `/api/companies/${id}`,
    getAssessments: (id: string) => `/api/companies/${id}/assessments`,
    getSelectionProcess: (id: string) => `/api/companies/${id}/selection-process`
  },

  // Managers
  managers: {
    base: '/api/managers',
    getAll: '/api/managers',
    getById: (id: string) => `/api/managers/${id}`,
    create: '/api/managers',
    update: (id: string) => `/api/managers/${id}`,
    delete: (id: string) => `/api/managers/${id}`,
    getByCompany: (companyId: string) => `/api/companies/${companyId}/managers`
  },

  // Users
  users: {
    base: '/api/users',
    getAll: '/api/users',
    getById: (id: string) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
    getByCompany: (companyId: string) => `/api/companies/${companyId}/users`,
    import: '/api/users/import'
  },

  // Candidates
  candidates: {
    base: '/api/candidates',
    getAll: '/api/candidates',
    getById: (id: string) => `/api/candidates/${id}`,
    create: '/api/candidates',
    update: (id: string) => `/api/candidates/${id}`,
    delete: (id: string) => `/api/candidates/${id}`,
    getByCompany: (companyId: string) => `/api/companies/${companyId}/candidates`,
    getAssessments: (id: string) => `/api/candidates/${id}/assessments`,
    submitAssessment: (id: string, type: string) => `/api/candidates/${id}/assessments/${type}`
  },

  // Assessments
  assessments: {
    base: '/api/assessments',
    getAll: '/api/assessments',
    getById: (id: string) => `/api/assessments/${id}`,
    create: '/api/assessments',
    update: (id: string) => `/api/assessments/${id}`,
    delete: (id: string) => `/api/assessments/${id}`,
    getByCompany: (companyId: string) => `/api/companies/${companyId}/assessments`,
    importQuestions: '/api/assessments/import-questions'
  },

  // Telemetry
  telemetry: {
    base: '/api/telemetry',
    getAll: '/api/telemetry',
    getByCompany: (companyId: string) => `/api/companies/${companyId}/telemetry`,
    getByDriver: (driverId: string) => `/api/drivers/${driverId}/telemetry`,
    import: '/api/telemetry/import',
    getAnalytics: '/api/telemetry/analytics',
    getRiskAnalysis: (driverId: string) => `/api/drivers/${driverId}/risk-analysis`
  },

  // Settings
  settings: {
    base: '/api/settings',
    get: '/api/settings',
    update: '/api/settings'
  }
};

// WebSocket Routes
export const wsRoutes = {
  telemetry: '/ws/telemetry',
  notifications: '/ws/notifications'
};