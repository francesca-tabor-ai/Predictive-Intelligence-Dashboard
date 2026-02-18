
import React from 'react';
import { Download } from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onDownloadZip: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onDownloadZip }) => {
  const navItems = [
    { id: NavigationTab.ABOUT, label: 'About' },
    { id: NavigationTab.INVESTMENT_THESIS, label: 'Investment Thesis' },
    { id: NavigationTab.COMPANY_VALUATION, label: 'Company Valuation' },
    { id: NavigationTab.PREDICTION_STRATEGY, label: 'Prediction Strategy' },
    { id: NavigationTab.DATA_FLYWHEEL, label: 'Data Flywheel' },
    { id: NavigationTab.ARCHITECTURE, label: 'Architecture' },
    { id: NavigationTab.ROI_CALCULATOR, label: 'ROI Calculator' },
    { id: NavigationTab.PROPOSAL, label: 'Proposal' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#020617] text-white p-8 z-50 border-r border-slate-800 flex flex-col">
      <div className="mb-16 shrink-0">
        <h1 className="text-lg font-bold tracking-tight uppercase">PI Flywheel</h1>
        <div className="h-0.5 w-8 accent-gradient mt-2"></div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === item.id
                ? 'bg-white text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-800 shrink-0">
        <button
          onClick={onDownloadZip}
          className="w-full flex items-center justify-between px-4 py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all group"
        >
          <div className="text-left">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Export Project</div>
            <div className="text-xs font-bold text-white">Download ZIP</div>
          </div>
          <Download className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
};
