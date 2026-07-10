import React from 'react';

export const Sidebar = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: 'work', label: 'Work Tasks', count: counts?.work || 0 },
    { id: 'personal', label: 'Personal Tasks', count: counts?.personal || 0 },
    { id: 'completed', label: 'Completed', count: counts?.completed || 0 },
    { id: 'settings', label: 'Settings' },
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