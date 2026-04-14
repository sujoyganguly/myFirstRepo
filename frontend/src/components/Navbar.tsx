import { Link, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Ticket, PlusCircle, ShieldAlert, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const NAV_LINKS = [
  { to: '/',         label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/tickets',  label: 'All Tickets', icon: Ticket },
  { to: '/new',      label: 'New Ticket',  icon: PlusCircle },
  { to: '/sla',      label: 'SLA Monitor', icon: ShieldAlert },
  { to: '/sop',      label: 'SOP & Policy',icon: BookOpen },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
            <Building2 className="w-6 h-6 text-indigo-300" />
            <span className="hidden sm:inline">Srijan Nirvana</span>
            <span className="text-indigo-300 text-sm font-normal hidden md:inline">· Resident Support Portal</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === to
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
