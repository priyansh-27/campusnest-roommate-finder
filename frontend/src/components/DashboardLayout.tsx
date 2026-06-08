import { useState, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import BackendStatus from './BackendStatus';
import {
  Home, Users, DollarSign, Shield, MessageSquare, LogOut, Menu,
  Bell, ChevronDown, Settings, LayoutDashboard, Wrench, BarChart3,
  UserCheck, PlusCircle, Crown, Heart, FileCheck
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',    label: 'Dashboard',        icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin','student','landlord'] },
  { id: 'housing',      label: 'Housing',           icon: <Home className="w-5 h-5" />,            roles: ['admin','student','landlord'] },
  { id: 'roommates',    label: 'Roommates',         icon: <Users className="w-5 h-5" />,           roles: ['admin','student'] },
  { id: 'solo-seeker',  label: 'Solo Seeker',       icon: <Heart className="w-5 h-5" />,           roles: ['student'], badge: 'NEW' },
  { id: 'expenses',     label: 'Expenses',          icon: <DollarSign className="w-5 h-5" />,      roles: ['admin','student'] },
  { id: 'maintenance',  label: 'Maintenance',       icon: <Wrench className="w-5 h-5" />,          roles: ['admin','student','landlord'] },
  { id: 'users',        label: 'Users',             icon: <UserCheck className="w-5 h-5" />,       roles: ['admin'] },
  { id: 'analytics',    label: 'Analytics',         icon: <BarChart3 className="w-5 h-5" />,       roles: ['admin'] },
  { id: 'proofs',       label: 'Proof & Verify',    icon: <FileCheck className="w-5 h-5" />,       roles: ['landlord'], badge: 'REQ' },
  { id: 'subscription', label: 'Subscription',      icon: <Crown className="w-5 h-5" />,           roles: ['landlord'], badge: 'PRO' },
  { id: 'add-listing',  label: 'Add Listing',       icon: <PlusCircle className="w-5 h-5" />,      roles: ['landlord'] },
  { id: 'proof-review', label: 'Verify Proofs',     icon: <FileCheck className="w-5 h-5" />,       roles: ['admin'], badge: 'REVIEW' },
  { id: 'safety',       label: 'Safety',            icon: <Shield className="w-5 h-5" />,          roles: ['admin','student'] },
  { id: 'community',    label: 'Community',         icon: <MessageSquare className="w-5 h-5" />,   roles: ['admin','student','landlord'] },
];

interface Props {
  activeTab: string;
  setActiveTab: (t: string) => void;
  children: ReactNode;
}

export default function DashboardLayout({ activeTab, setActiveTab, children }: Props) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const userRole = user?.role?.toLowerCase() || 'student';
  const visibleItems = NAV_ITEMS.filter(n => n.roles.includes(userRole));

  const roleColors: Record<string, string> = {
    admin:    'bg-violet-600',
    student:  'bg-emerald-600',
    landlord: 'bg-amber-500',
  };
  const roleBadge: Record<string, string> = {
    admin:    'bg-violet-100 text-violet-700',
    student:  'bg-emerald-100 text-emerald-700',
    landlord: 'bg-amber-100 text-amber-700',
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex flex-col h-full' : 'hidden lg:flex flex-col'} w-64 bg-slate-900 text-white`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${roleColors[userRole]} flex items-center justify-center text-xl font-black`}>🪺</div>
        <div>
          <div className="font-black text-white text-lg leading-tight">CampusNest</div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${roleBadge[userRole]}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); if (mobile) setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? `${roleColors[userRole]} text-white shadow-lg`
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                item.badge === 'NEW'    ? 'bg-emerald-500 text-white' :
                item.badge === 'REQ'    ? 'bg-rose-500 text-white' :
                item.badge === 'REVIEW' ? 'bg-violet-500 text-white' :
                                          'bg-amber-400 text-slate-900'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User card */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 bg-slate-800 rounded-xl p-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10b981&color=fff`}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">{user?.name}</div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
          <button onClick={logout} title="Logout" className="text-slate-500 hover:text-rose-400 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 flex flex-col">
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-black text-slate-900 text-lg leading-tight capitalize">
                {activeTab === 'dashboard' ? `${user?.role} Dashboard` : visibleItems.find(n => n.id === activeTab)?.label || activeTab}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Welcome back, {user?.name?.split(' ')[0]}!</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Backend status indicator */}
            <BackendStatus />

            {/* Notification bell */}
            <div className="relative p-2 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10b981&color=fff`}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
