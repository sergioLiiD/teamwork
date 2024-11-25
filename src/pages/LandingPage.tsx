import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Users,
  Workflow,
  CheckCircle,
  BarChart2,
  MessageSquare,
  Clock,
  ChevronRight,
  Star,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showLanguages, setShowLanguages] = React.useState(false);
  const languageRef = React.useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguages(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const features = [
    {
      icon: <Workflow className="w-8 h-8 text-blue-500" />,
      title: t('landing.features.customWorkflows.title'),
      description: t('landing.features.customWorkflows.description')
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: t('landing.features.teamManagement.title'),
      description: t('landing.features.teamManagement.description')
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-blue-500" />,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description')
    }
  ];

  const steps = [
    {
      number: "01",
      title: t('landing.howItWorks.steps.create.title'),
      description: t('landing.howItWorks.steps.create.description')
    },
    {
      number: "02",
      title: t('landing.howItWorks.steps.assign.title'),
      description: t('landing.howItWorks.steps.assign.description')
    },
    {
      number: "03",
      title: t('landing.howItWorks.steps.monitor.title'),
      description: t('landing.howItWorks.steps.monitor.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-900">
              OnboardFlow
            </div>
            <div className="flex items-center space-x-6">
              <div ref={languageRef} className="relative">
                <button
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Globe className="w-5 h-5" />
                  <span>{languages.find(lang => lang.code === i18n.language)?.name || 'English'}</span>
                </button>
                
                {showLanguages && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            i18n.language === language.code
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            i18n.changeLanguage(language.code);
                            setShowLanguages(false);
                          }}
                        >
                          {language.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/auth/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {t('auth.login.title')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('landing.hero.cta.start')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                {t('landing.hero.cta.demo')}
                <Play className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-8">
                    <ChevronRight className="w-6 h-6 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t('landing.cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;