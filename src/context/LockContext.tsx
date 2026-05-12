import React, { createContext, useContext, useState } from 'react';

interface LockState {
  activeId: string | null;      // The primary ID (e.g., ClientID)
  activeName: string | null;    // Display name (e.g., John Doe)
  masterModuleId: number | null; // Which module set the lock
}

const LockContext = createContext<any>(null);

export const LockProvider = ({ children }: { children: React.ReactNode }) => {
  const [lock, setLock] = useState<LockState>({
    activeId: null,
    activeName: null,
    masterModuleId: null,
  });

  const setGlobalLock = (id: string, name: string, moduleId: number) => {
    setLock({ activeId: id, activeName: name, masterModuleId: moduleId });
  };

  const clearLock = () => {
    setLock({ activeId: null, activeName: null, masterModuleId: null });
  };

  return (
    <LockContext.Provider value={{ lock, setGlobalLock, clearLock }}>
      {children}
    </LockContext.Provider>
  );
};

export const useLock = () => useContext(LockContext);