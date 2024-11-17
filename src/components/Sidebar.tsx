import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  Settings,
  LogOut,
  FileSpreadsheet,
  ClipboardCheck,
  Brain,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, text: 'Dashboard', path: '/admin/dashboard' },
          { icon: Building2, text: 'Empresas', path: '/admin/companies' },
          { icon: Users, text: 'Gestores', path: '/admin/managers' },
          { icon: Settings, text: 'Configurações', path: '/admin/settings' },
        ];
      case 'manager':
        return [
          { icon: LayoutDashboard, text: 'Dashboard', path: '/manager/dashboard' },
          { icon: FileSpreadsheet, text: 'Telemetria', path: '/manager/telemetry' },
          { icon: ClipboardCheck, text: 'Recrutamento', path: '/manager/recruitment' },
          { icon: Users, text: 'Usuários', path: '/manager/users' },
        ];
      case 'candidate':
        return [
          { icon: LayoutDashboard, text: 'Dashboard', path: '/candidate/dashboard' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mobile menu toggle
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-primary-600 text-white transition-transform lg:translate-x-0 lg:relative`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-center py-6">
            <Brain className="w-8 h-8 mr-2" />
            <span className="text-xl font-bold">Younder</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-primary-700 text-white'
                        : 'text-gray-100 hover:bg-primary-700'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="pt-6 mt-6 border-t border-primary-700">
            <div className="px-4 mb-4">
              <p className="text-sm text-gray-300">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-100 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;