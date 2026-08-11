import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { FiArrowLeft, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ChangePassword = () => {
  const { isAdmin, updatePassword } = useAdmin();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError('All fields are required.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    setLoading(false);
    
    if (result.success) {
      setFormSuccess('Admin password updated successfully! Redirecting...');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setFormError(result.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full">
          <FiLock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">Admin Credentials Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          You must be logged in as an administrator to change the owner password.
        </p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md">
          Back to Home Page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-8 pb-16 space-y-8">
      
      {/* Top Breadcrumb */}
      <Link 
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
          Change Password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update the password for admin user <span className="font-bold text-brand-500">mshahzaib</span>.
        </p>
      </div>

      {/* Alerts */}
      {formError && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-650 dark:text-red-400 text-xs">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-450 text-xs">
          <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-glass dark:shadow-glass-dark">
        
        <div>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-2 uppercase tracking-wide">
            Username (Locked)
          </label>
          <input 
            type="text" 
            value="mshahzaib"
            disabled
            className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 font-semibold text-sm cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            As per strict owner restriction rules, the admin username cannot be changed.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-2 uppercase tracking-wide">
            Current Password
          </label>
          <input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-2 uppercase tracking-wide">
            New Password
          </label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-2 uppercase tracking-wide">
            Confirm New Password
          </label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
        >
          {loading ? 'Saving Changes...' : 'Update Password'}
        </button>

      </form>

    </div>
  );
};

export default ChangePassword;
