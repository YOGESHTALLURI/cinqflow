import React from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import { 
  Sparkles, 
  Database, 
  Workflow, 
  ShieldAlert, 
  Activity, 
  Scale, 
  BookOpen, 
  Shield, 
  UserCheck, 
  Eye, 
  EyeOff,
  Clock,
  GitCommit,
  RotateCcw,
  Award
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { userRole, setUserRole, phiMasked, setPhiMasked, activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'ops-control', label: 'Ops Control & Recovery', icon: RotateCcw, badge: 'Wave 2' },
    { id: 'file-arrivals', label: 'File Arrival Board', icon: Clock, badge: 'Wave 2' },
    { id: 'schema-drift', label: 'Schema Drift Guard', icon: GitCommit, badge: 'Wave 2' },
    { id: 'variance-waivers', label: 'Variance & Certification', icon: Award, badge: 'Wave 2' },
    { id: 'onboarding', label: 'BA Onboarding Wizard', icon: Sparkles, badge: '5-Step' },
    { id: 'registry', label: 'Feed Registry', icon: Database },
    { id: 'pipeline', label: 'Medallion Pipeline Engine', icon: Workflow },
    { id: 'quarantine', label: 'Quarantine & Exceptions', icon: ShieldAlert },
    { id: 'observability', label: 'Operational Control', icon: Activity },
    { id: 'reconciliation', label: 'Reconciliation & Audit', icon: Scale },
    { id: 'catalog', label: 'Data Catalog & Glossary', icon: BookOpen },
  ];

  const roles: { value: UserRole; label: string }[] = [
    { value: 'ops', label: 'Operations Team (Ops)' },
    { value: 'steward', label: 'Data Steward' },
    { value: 'engineer', label: 'Data Engineer' },
    { value: 'ba', label: 'Business Analyst (BA)' },
    { value: 'approver', label: 'Config Approver' },
    { value: 'admin', label: 'Platform Admin' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Wave Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">CINQ<span className="gradient-text">Flow</span></h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                Wave 2 (Ops & Governance)
              </span>
            </div>
            <p className="text-xs text-slate-400">CINQCARE Self-Service Healthcare Data Platform</p>
          </div>
        </div>

        {/* Controls: Role Switcher & PHI Masking Toggle */}
        <div className="flex items-center gap-4">
          {/* PHI Masking Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-medium">PHI Masking:</span>
            <button
              onClick={() => setPhiMasked(!phiMasked)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                phiMasked 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {phiMasked ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Masked (Active)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Unmasked</span>
                </>
              )}
            </button>
          </div>

          {/* User Role Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-300 font-medium">Role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-700 rounded px-2 py-1 outline-none focus:border-cyan-500"
            >
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <nav className="flex gap-1 py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono border ${
                    item.badge === 'Wave 2' 
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-800/80 font-bold' 
                      : 'bg-cyan-950 text-cyan-300 border-cyan-800/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
