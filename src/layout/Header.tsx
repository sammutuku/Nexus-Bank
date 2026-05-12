import React from 'react';
import { Search, Bell, Eye, EyeOff, User } from 'lucide-react';
import { C } from '@theme/colors';
import { useApp } from '@context/AppContext';

export const Header = () => {
  const { balanceVisible, setBalanceVisible, section } = useApp();

  // Convert "sme-financing" to "SME Financing"
  const title = section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <header style={{ 
      height: 70, 
      borderBottom: `1px solid ${C.border}`, 
      background: C.bg, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 24px' 
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600 }}>{title}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px 8px 40px',
              color: C.text,
              fontSize: 14,
              width: 240
            }}
          />
        </div>

        <button 
          onClick={() => setBalanceVisible(!balanceVisible)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}
        >
          {balanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color={C.muted} />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: C.danger, borderRadius: '50%', border: `2px solid ${C.bg}` }}></div>
        </div>

        <div style={{ width: 1, height: 24, background: C.border }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accentLo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color={C.accent} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Admin User</span>
        </div>
      </div>
    </header>
  );
};