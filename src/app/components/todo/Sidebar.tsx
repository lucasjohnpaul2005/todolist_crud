import React from 'react';

interface SidebarProps {
  activeTab: 'work' | 'personal' | 'completed' | 'settings';
  onTabChange: (tab: 'work' | 'personal' | 'completed' | 'settings') => void;
  counts?: {
    work: number;
    personal: number;
    completed: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: 'work' as const, label: 'Work Tasks', count: counts?.work || 0 },
    { id: 'personal' as const, label: 'Personal Tasks', count: counts?.personal || 0 },
    { id: 'completed' as const, label: 'Completed', count: counts?.completed || 0 },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h2> TodoList</h2>
      </div>
      <nav className="nav-menu">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="nav-text">{tab.label}</span>
            {tab.count !== undefined && <span className="nav-count">{tab.count}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};