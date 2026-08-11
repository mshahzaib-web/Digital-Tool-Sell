import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminSession = () => {
      const storedAdmin = localStorage.getItem('vaultx_admin');
      if (storedAdmin) {
        try {
          const parsed = JSON.parse(storedAdmin);
          if (parsed.username === 'mshahzaib') {
            setIsAdmin(true);
            setAdminUser(parsed.username);
          }
        } catch (e) {
          localStorage.removeItem('vaultx_admin');
        }
      }
      setLoading(false);
    };
    checkAdminSession();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authService.login(username, password);
      if (res.data.success) {
        const adminData = { username: res.data.admin.username, password };
        localStorage.setItem('vaultx_admin', JSON.stringify(adminData));
        setIsAdmin(true);
        setAdminUser(res.data.admin.username);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (error) {
      console.error('Context login error:', error);
      const msg = error.response?.data?.message || 'Authentication failed. Please check credentials.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('vaultx_admin');
    setIsAdmin(false);
    setAdminUser(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.data.success) {
        // Update credentials in localStorage
        const storedAdmin = localStorage.getItem('vaultx_admin');
        if (storedAdmin) {
          const parsed = JSON.parse(storedAdmin);
          parsed.password = newPassword;
          localStorage.setItem('vaultx_admin', JSON.stringify(parsed));
        }
        return { success: true };
      }
      return { success: false, message: 'Password update failed' };
    } catch (error) {
      console.error('Context password change error:', error);
      const msg = error.response?.data?.message || 'Failed to update password.';
      return { success: false, message: msg };
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, loading, login, logout, updatePassword }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
