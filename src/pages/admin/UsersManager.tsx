import React from 'react';
import UserManager from '../../components/admin/UserManager';
import type { User } from '../../types';

const UsersManager: React.FC = () => {
  const handleUserCreate = (user: Omit<User, 'id'>) => {
    // Will be implemented with real user creation
  };

  const handleUserUpdate = (id: string, user: Partial<User>) => {
    // Will be implemented with real user updates
  };

  const handleUserDelete = (id: string) => {
    // Will be implemented with real user deletion
  };

  return (
    <UserManager
      users={[]}
      onUserCreate={handleUserCreate}
      onUserUpdate={handleUserUpdate}
      onUserDelete={handleUserDelete}
    />
  );
};

export default UsersManager;