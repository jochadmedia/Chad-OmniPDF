import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Users,
  Key,
  Lock,
  Layers,
  Sparkles,
  Server,
  CheckCircle2,
  Sliders,
  Check
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onUpdateSensitivityLabel: (label: string) => void;
  initialTab?: 'licensing' | 'ims' | 'ai_policies' | 'purview' | 'audit';
  auditLog?: Array<{ id: string; action: string; user: string; timestamp: string; details: string; status: 'success' | 'warning' | 'error' }>;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onUpdateSensitivityLabel,
  initialTab = 'licensing',
  auditLog = [],
}) => {
  const [activeTab, setActiveTab] = useState<'licensing' | 'ims' | 'ai_policies' | 'purview' | 'audit'>(initialTab);

  React.useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const [aiPolicyState, setAiPolicyState] = useState({
    aiAssistantEnabled: true,
    cloudChatHistory: false, // Zero retention by default
    expressApis: true,
    audioPodcastGen: true,
  });

  const sensitivityLabels = [
    { name: 'Public', desc: 'No restrictions. Content can be distributed outside the enterprise.' },
    { name: 'General', desc: 'Internal business use. Default corporate data handling.' },
    { name: 'Confidential', desc: 'Sensitive operational, financial, or client engagement data.' },
    { name: 'Highly Confidential (MIP)', desc: 'Strict encryption. Watermarking & restricted offline export enforced.' },
  ];

  const [users, setUsers] = useState([
    {
      email: 'info@topchartmedia.com',
      profile: 'Chad-OmniPDF Enterprise Studio',
      status: 'AppContainer Protected View',
      lastSignIn: 'Active Now',
      isCurrentUser: true,
    },
    {
      email: 'audit.compliance@apexglobal-tech.com',
      profile: 'Chad-OmniPDF Pro + Compliance Suite',
      status: 'Protected View Enabled',
      lastSignIn: '2026-10-01 07:44',
      isCurrentUser: false,
    },
    {
      email: 'm.vance@apexglobal-ops.net',
      profile: 'Chad-OmniPDF Pro Desktop',
      status: 'Protected View Enabled',
      lastSignIn: '2026-09-30 18:12',
      isCurrentUser: false,
    },
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [newProfile, setNewProfile] = useState('Chad-OmniPDF Enterprise Studio');
  const [samlEnabled, setSamlEnabled] = useState(true);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setUsers((prev) => [
      ...prev,
      {
        email: newEmail.trim(),
        profile: newProfile,
        status: 'Protected View Enabled',
        lastSignIn: 'Invited (Pending SSO)',
        isCurrentUser: false,
      },
    ]);
    setNewEmail('');
  };

  const handleRevokeUser = (emailToRevoke: string) => {
    setUsers((prev) => prev.filter((u) => u.email !== emailToRevoke));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-teal-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800">
                  Chad-OmniPDF Admin Console &amp; Enterprise Governance
                </h2>
                <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full">
                  Enterprise Tier
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Centralized Named User Licensing (NUL), Federated IMS SAML SSO, and Microsoft Purview Policies
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 text-xs">
          <button
            onClick={() => setActiveTab('licensing')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'licensing'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Named User Licensing (NUL)
          </button>
          <button
            onClick={() => setActiveTab('ims')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'ims'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Identity &amp; SSO (SAML 2.0)
          </button>
          <button
            onClick={() => setActiveTab('ai_policies')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'ai_policies'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Granular AI Permissions
          </button>
          <button
            onClick={() => setActiveTab('purview')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'purview'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Microsoft Purview (MIP)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compliance Audit Log
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-5 overflow-y-auto text-xs space-y-4">
          {/* 1. LICENSING */}
          {activeTab === 'licensing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Allocated Seats</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">{users.length} / 500</div>
                  <span className="text-[10px] text-emerald-600 font-medium">{users.length} Active Enterprise Seats</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Primary Admin Account</span>
                  <div className="text-sm font-bold text-slate-800 mt-1 truncate">info@topchartmedia.com</div>
                  <span className="text-[10px] text-teal-600 font-medium">Organization Superadmin</span>
                </div>
                <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50">
                  <span className="text-[10px] text-purple-700 font-semibold uppercase">Studio &amp; AI Add-on</span>
                  <div className="text-xl font-bold text-purple-950 mt-1">{users.filter(u => u.profile.includes('Studio')).length} Seats</div>
                  <span className="text-[10px] text-purple-600">Enterprise AI Entitlement</span>
                </div>
              </div>

              {/* Assign New Seat Form */}
              <form onSubmit={handleAddUser} className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg flex items-center gap-2">
                <span className="font-semibold text-teal-900 shrink-0">Assign Seat:</span>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="bg-white border border-teal-300 rounded px-2.5 py-1 text-xs text-slate-800 flex-1 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
                <select
                  value={newProfile}
                  onChange={(e) => setNewProfile(e.target.value)}
                  className="bg-white border border-teal-300 rounded px-2 py-1 text-xs text-slate-800"
                >
                  <option value="Chad-OmniPDF Enterprise Studio">Enterprise Studio</option>
                  <option value="Chad-OmniPDF Pro + Compliance Suite">Pro + Compliance</option>
                  <option value="Chad-OmniPDF Pro Desktop">Pro Desktop</option>
                </select>
                <button
                  type="submit"
                  disabled={!newEmail.trim()}
                  className="px-3 py-1 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded font-medium text-xs shrink-0"
                >
                  Assign Seat
                </button>
              </form>

              <div>
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider mb-2 block">
                  Active Directory User Assignments ({users.length} Users)
                </span>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2 border-b">User Email</th>
                        <th className="p-2 border-b">License Profile</th>
                        <th className="p-2 border-b">AppContainer Status</th>
                        <th className="p-2 border-b">Last Sign In</th>
                        <th className="p-2 border-b text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {users.map((u) => (
                        <tr key={u.email} className={u.isCurrentUser ? 'bg-teal-50/40 font-medium' : ''}>
                          <td className="p-2 text-slate-800 flex items-center gap-1.5">
                            {u.isCurrentUser && <span className="w-2 h-2 rounded-full bg-teal-500"></span>}
                            <span>{u.email}</span>
                            {u.isCurrentUser && (
                              <span className="text-[9px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-bold">You</span>
                            )}
                          </td>
                          <td className="p-2 text-slate-700">{u.profile}</td>
                          <td className="p-2 text-emerald-600 font-medium">{u.status}</td>
                          <td className="p-2 font-mono text-[11px]">{u.lastSignIn}</td>
                          <td className="p-2 text-right">
                            {!u.isCurrentUser && (
                              <button
                                onClick={() => handleRevokeUser(u.email)}
                                className="text-red-600 hover:text-red-800 text-[11px] font-semibold"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. IDENTITY & SAML */}
          {activeTab === 'ims' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-teal-700" />
                  SAML 2.0 Identity Provider Federation (Okta / Microsoft Entra ID)
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Entity ID (Issuer):</span>
                    <span className="font-mono text-slate-800 font-medium">urn:federation:adobe:apexglobal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ACS URL (Assertion Consumer):</span>
                    <span className="font-mono text-slate-800 font-medium">https://ims.adobe.com/sp/saml2</span>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-700 font-medium pt-1">
                  ✓ Certificate Thumbprint Validated • SHA-256 Digest Match
                </div>
              </div>
            </div>
          )}

          {/* 3. GRANULAR AI POLICIES */}
          {activeTab === 'ai_policies' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 mb-2">
                Configure corporate security boundaries and privacy sandboxing for Chad-OmniPDF AI Assistant and generative features.
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Allow AI Assistant in Enterprise PDFs</div>
                    <div className="text-[11px] text-slate-500">Enable conversational Q&amp;A and document summaries</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiPolicyState.aiAssistantEnabled}
                    onChange={(e) => setAiPolicyState({ ...aiPolicyState, aiAssistantEnabled: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Retain Cloud Chat History (Zero Retention Default)</div>
                    <div className="text-[11px] text-slate-500">
                      When disabled, session transcripts expire after 12 hours with zero training retention
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiPolicyState.cloudChatHistory}
                    onChange={(e) => setAiPolicyState({ ...aiPolicyState, cloudChatHistory: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Enable Generative Podcasts &amp; Audio Overview</div>
                    <div className="text-[11px] text-slate-500">Allows synthesis with Google Chirp and Azure OpenAI</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiPolicyState.audioPodcastGen}
                    onChange={(e) => setAiPolicyState({ ...aiPolicyState, audioPodcastGen: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 4. MICROSOFT PURVIEW MIP LABELS */}
          {activeTab === 'purview' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 mb-2">
                Apply Microsoft Information Protection (MIP) sensitivity labels directly into document metadata:
              </div>
              <div className="space-y-2">
                {sensitivityLabels.map((lbl) => (
                  <button
                    key={lbl.name}
                    disabled={!currentDoc}
                    onClick={() => onUpdateSensitivityLabel(lbl.name)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between active:scale-[0.98] ${
                      currentDoc?.sensitivityLabel === lbl.name
                        ? 'border-amber-400 bg-amber-50/60 shadow-xs ring-1 ring-amber-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-800">{lbl.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{lbl.desc}</div>
                    </div>
                    {currentDoc?.sensitivityLabel === lbl.name && (
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. COMPLIANCE AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-tight">System Compliance Events</div>
                <div className="text-[10px] text-slate-400">Total Events: {auditLog.length}</div>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/30">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2 w-32">Timestamp</th>
                      <th className="p-2 w-40">Action Type</th>
                      <th className="p-2">Details & Audit Trail</th>
                      <th className="p-2 w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {auditLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono text-[10px]">{log.timestamp.replace('T', ' ').split('.')[0]}</td>
                        <td className="p-2 font-bold text-slate-700 uppercase tracking-tighter">{log.action}</td>
                        <td className="p-2 leading-relaxed">{log.details}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                            log.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                            log.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium text-xs"
          >
            Close Admin Console
          </button>
        </div>
      </div>
    </div>
  );
};
