import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  GitBranch,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import LanguageSelector from '../LanguageSelector';
import NotificationBell from '../NotificationBell';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const [isExpanded, setIsExpanded] = useState(false);

  const navigation = [
    { name: 'admin.dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'admin.workflows', href: '/admin/workflows', icon: GitBranch },
    { name: 'admin.users', href: '/admin/users', icon: Users },
    { name: 'admin.analytics', href: '/admin/analytics', icon: BarChart2 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {isExpanded ? (
            <>
              <h1 className="text-xl font-bold text-gray-900">{t('admin.title')}</h1>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-full flex justify-center text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="mt-6 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
                {isExpanded && t(item.name)}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <div className={`flex ${isExpanded ? 'justify-between' : 'justify-center'} items-center`}>
            {isExpanded ? (
              <>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <Settings className="mr-2 h-5 w-5" />
                  {t('admin.settings')}
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-sm text-red-500 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  {t('admin.logout')}
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'pl-64' : 'pl-16'}`}>
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-end px-8 space-x-4">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;