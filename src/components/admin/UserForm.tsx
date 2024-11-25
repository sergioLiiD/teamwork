import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../types';

interface UserFormProps {
  user?: User | null;
  onSubmit: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: user?.name || '',
    role: user?.role || 'new-hire',
    avatar: user?.avatar || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">
              {user ? t('users.edit') : t('users.create')}
            </h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('users.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder={t('users.namePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('users.role')}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="new-hire">{t('users.roles.new-hire')}</option>
                <option value="manager">{t('users.roles.manager')}</option>
                <option value="admin">{t('users.roles.admin')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('users.avatar')}
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {formData.avatar && (
                  <img
                    src={formData.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Upload className="w-5 h-5" />
                  <span>{t('users.uploadAvatar')}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {user ? t('common.update') : t('common.create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;