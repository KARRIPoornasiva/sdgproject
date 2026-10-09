import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  WATER_MANAGER: 'Water Manager',
  MAINTENANCE_STAFF: 'Maintenance Staff',
  FACULTY: 'Faculty',
  STUDENT: 'Student',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr-001',
    name: 'Dr. S. Sushma',
    email: 'waterguard.admin@college.edu',
    role: ROLES.SUPER_ADMIN,
    department: 'Campus Infrastructure & Sustainability Directorate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
    }));
  };

  const login = (email, password) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        switchRole,
        login,
        logout,
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
