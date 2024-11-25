import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  GraduationCap,
  LayoutDashboard,
  CheckSquare,
  ClipboardList,
  MessageCircle,
  User,
  HelpCircle
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';

const Layout: React.FC = () => {
  const { t } = useTranslation();

  const navigation = [
    { name: 'dashboard.title', href: '/', icon: LayoutDashboard },
    { name: 'tasks.title', href: '/tasks', icon: CheckSquare },
    { name: 'quizzes.title', href: '/quizzes', icon: ClipboardList },
    { name: 'messages.title', href: '/messages', icon: MessageCircle },
    { name: 'profile.title', href: '/profile', icon: User },
    { name: 'help.title', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-xl font-bold text-gray-900">
              {t('header.title')}
            </h1>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.name)}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center justify-between">
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
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

export default Layout;