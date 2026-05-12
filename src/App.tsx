import React, { useState } from 'react';
import MainLayout from '@layout/MainLayout';
import { Login } from '@layout/Auth/Login';
import { LockProvider } from '@context/LockContext';
import { TabProvider } from '@context/TabContext';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(err => {
        console.warn('Fullscreen blocked or not supported:', err);
      });
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
    setIsAuthenticated(false);
  };

  return (
    <LockProvider>
      <TabProvider>
        {isAuthenticated ? (
          <MainLayout onLogout={handleLogout} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </TabProvider>
    </LockProvider>
  );
}
