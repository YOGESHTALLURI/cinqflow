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
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  wave?: string;
  highlight?: boolean;
}

export const SidebarNavigation: React.FC<SidebarProps> = ({ children }) => {
  const { userRole, setUserRole, phiMasked, setPhiMasked, activeTab, setActiveTab } = useApp();

  const navigationGroups: { groupTitle: string; items: NavItem[] }[] = [
    {
      groupTitle: 'Ingestion & Onboarding',
      items: [
        { id: 'onboarding', label: 'BA Onboarding Wizard', icon: Sparkles, badge: '5-Step', wave: 'Wave 1' },
        { id: 'registry', label: 'Feed Registry Inventory', icon: Database, wave: 'Wave 0' },
      ]
    },
    {
      groupTitle: 'Pipeline & Data Quality',
      items: [
        { id: 'pipeline', label: 'Medallion Pipeline Engine', icon: Workflow, wave: 'Wave 1' },
        { id: 'quarantine', label: 'Quarantine & Exceptions', icon: ShieldAlert, wave: 'Wave 1' },
      ]
    },
    {
      groupTitle: 'Operations & Reliability',
      items: [
        { id: 'file-arrivals', label: 'File Arrival Board & SLA', icon: Clock, badge: 'Wave 2', highlight: true },
        { id: 'ops-control', label: 'Ops Control & Recovery', icon: RotateCcw, badge: 'Wave 2', highlight: true },
        { id: 'schema-drift', label: 'Schema Drift Guard', icon: GitCommit, badge: 'Wave 2', highlight: true },
      ]
    },
    {
      groupTitle: 'Governance & Reconciliation',
      items: [
        { id: 'variance-waivers', label: 'Variance & Certification', icon: Award, badge: 'Wave 2', highlight: true },
        { id: 'observability', label: 'Operational Control Telemetry', icon: Activity, wave: 'Wave 1' },
        { id: 'reconciliation', label: 'Reconciliation & Audit', icon: Scale, wave: 'Wave 1' },
        { id: 'catalog', label: 'Data Catalog & Glossary', icon: BookOpen, wave: 'Wave 0' },
      ]
    },
    {
      groupTitle: 'Wave 3: Identity & Canonical',
      items: [
        { id: 'verato-identity', label: 'Verato Identity Stage', icon: UserCheck, badge: 'Wave 3', highlight: true },
        { id: 'identity-exceptions', label: 'Identity Exception Queue', icon: ShieldAlert, badge: 'Wave 3', highlight: true },
        { id: 'merge-split-cards', label: 'AI Merge & Split Evidence', icon: Sparkles, badge: 'Wave 3', highlight: true },
        { id: 'identity-telemetry', label: 'Identity Cutover Telemetry', icon: Activity, badge: 'Wave 3', highlight: true },
        { id: 'canonical-model', label: 'Canonical ODS Model & Contracts', icon: Database, badge: 'Wave 3', highlight: true },
        { id: 'complex-formats', label: 'Complex Formats (FHIR/HL7)', icon: Layers, badge: 'Wave 3', highlight: true },
        { id: 'financial-packs', label: 'Financial Reconciliation Packs', icon: Scale, badge: 'Wave 3', highlight: true },
      ]
    }
  ];


  const roles: { value: UserRole; label: string }[] = [
    { value: 'ba', label: 'Business Analyst (BA)' },
    { value: 'steward', label: 'Data Steward' },
    { value: 'engineer', label: 'Data Engineer' },
    { value: 'ops', label: 'Operations Team (Ops)' },
    { value: 'approver', label: 'Config Approver' },
    { value: 'admin', label: 'Platform Admin' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans w-full">
      {/* Vertical Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto z-40">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-wide">CINQ<span className="gradient-text">Flow</span></h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">Healthcare Data Engine</p>
          </div>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav className="flex-1 p-3 space-y-6">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                {group.groupTitle}
              </span>

              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded font-mono shrink-0 ${
                        item.highlight 
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/80' 
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                      }`}>
                        {item.badge}
                      </span>
                    ) : item.wave ? (
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">{item.wave}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Medallion Lineage:</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Validated</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Landing → Bronze → Silver ODS</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Top Control Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Controls Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>CINQFlow Platform</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold capitalize">{activeTab.replace('-', ' ')}</span>
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
              <span className="text-xs text-slate-300 font-medium">Persona:</span>
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
        </header>

        {/* Dynamic Main Body Content */}
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500 px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span>CINQFlow Platform &copy; 2026 CINQCARE Inc. All Rights Reserved.</span>
            <span>Landing Zone → Bronze → Silver Raw → Identity Resolution → Silver ODS</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
