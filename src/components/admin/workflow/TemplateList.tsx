import React from 'react';
import { useTemplateStore } from '../../../store/templateStore';
import { Users, Clock, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TemplateListProps {
  selectedId: string | null;
  onSelect: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ selectedId, onSelect }) => {
  const { t } = useTranslation();
  const { templates } = useTemplateStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`border rounded-lg p-6 cursor-pointer transition-colors ${
            selectedId === template.id
              ? 'border-blue-500 bg-blue-50'
              : 'hover:border-gray-400'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{template.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                <span>{template.steps.length} {t('workflow.templates.steps')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {template.steps.reduce((total, step) => total + step.dueInDays, 0)} {t('workflow.templates.days')}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{t(`workflow.types.${template.type}`)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;