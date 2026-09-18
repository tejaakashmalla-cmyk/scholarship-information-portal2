import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/index.jsx';
import {
  LayoutDashboard, User, CheckCircle, BookOpen,
  Trophy, LogOut, Menu, X, Moon, Sun, GraduationCap,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/profile',     label: 'My Profile',        icon: User },
  { to: '/eligibility', label: 'Check Eligibility', icon: CheckCircle, badge: null },
  { to: '/schemes',     label: 'Browse Schemes',    icon: BookOpen },
  { to: '/results',     label: 'My Results',        icon: Trophy, badge: 'New' },
];

export default function DashboardLayout({ children }) {
  const { user, profile, logout, darkMode, setDarkMode } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 z-50
        bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700
        flex flex-col transition-transform duration-300 overflow-y-auto
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-gray-900 dark:text-slate-100 leading-none">ScholarFind Portal</div>
              <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Scholarship System</div>
            </div>
          </div>
          <button className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          <div className="px-5 mb-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Main Menu</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="badge badge-success text-[10px] px-1.5 py-0.5">{badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3 px-1">
            <Avatar name={user?.name || 'U'} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{user?.name}</div>
              <div className="text-[11px] text-gray-400 dark:text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost w-full text-xs py-2 gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 lg:px-6 h-14 flex items-center gap-3 shadow-sm">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-slate-300" />
          </button>

          <div className="flex-1">
            {profile?.isComplete ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                ✓ Profile Complete
              </span>
            ) : (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                ⚠ Complete your profile
              </span>
            )}
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title="Toggle dark mode"
          >
            {darkMode
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-gray-500" />
            }
          </button>

          <Avatar name={user?.name || 'U'} size="sm" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}


