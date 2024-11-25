import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Book, MessageSquare, ExternalLink } from 'lucide-react';

const Help: React.FC = () => {
  const { t } = useTranslation();

  const faqItems = [
    {
      question: 'How do I complete a task?',
      answer: 'Click on any task card and follow the instructions. Once completed, click the "Mark Complete" button.',
    },
    {
      question: 'What if I have questions about a task?',
      answer: 'Use the "Ask Question" button on any task card to start a conversation with your mentor.',
    },
    {
      question: 'How are quizzes graded?',
      answer: 'Quizzes are automatically graded upon completion. You need to achieve the minimum passing score to mark the quiz as complete.',
    },
  ];

  const resources = [
    {
      title: 'Company Handbook',
      description: 'Learn about our company policies and procedures',
      icon: Book,
      href: '#',
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageSquare,
      href: '#',
    },
    {
      title: 'Knowledge Base',
      description: 'Browse our collection of helpful articles',
      icon: ExternalLink,
      href: '#',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('help.title')}</h1>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('help.faq')}
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group border-b last:border-b-0 pb-4 last:pb-0"
            >
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-900 font-medium">{item.question}</span>
                <HelpCircle className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-2 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <resource.icon className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {resource.title}
            </h3>
            <p className="text-gray-600">{resource.description}</p>
          </a>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <MessageSquare className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('help.needMoreHelp')}
            </h3>
            <p className="text-gray-600 mt-1">
              {t('help.contactSupport')}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              {t('help.contact')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;