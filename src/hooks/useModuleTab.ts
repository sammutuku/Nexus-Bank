// src/hooks/useModuleTab.ts
// Drop this hook into any module component to let it close its own tab.
//
// Usage:
//   const { closeMe } = useModuleTab(1000); // pass the module's ID
//   <button onClick={closeMe}>✕</button>

import { useTabs } from '@context/TabContext';

export const useModuleTab = (moduleId: number) => {
  const { closeTab } = useTabs();
  return {
    closeMe: () => closeTab(moduleId),
  };
};
