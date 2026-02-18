import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Code, AlertTriangle, BarChart3, Users, Globe, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "לוח בקרה" },
  { to: "/settings", icon: Settings, label: "הגדרות ווידג'ט" },
  { to: "/embed", icon: Code, label: "קוד הטמעה" },
  { to: "/issues", icon: AlertTriangle, label: "דיווחי נגישות" },
];

const ADMIN_ITEMS = [
  { to: "/admin", icon: BarChart3, label: "סטטיסטיקות" },
  { to: "/admin/users", icon: Users, label: "ניהול משתמשים" },
  { to: "/admin/sites", icon: Globe, label: "כל האתרים" },
  { to: "/admin/issues", icon: MessageSquare, label: "כל הדיווחים" },
];

export function Sidebar() {
  const { user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700 border-r-4 border-brand-500 -mr-px"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside className="w-64 bg-white border-l border-gray-200 h-screen fixed top-0 right-0 flex flex-col z-40">
      {/* Brand */}
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-brand-600">Axsible</h1>
        <p className="text-xs text-gray-400 mt-0.5">ניהול נגישות</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {user?.is_admin && (
          <>
            <div className="my-3 border-t border-gray-100" />
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ניהול</p>
            {ADMIN_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/admin"} className={linkClass}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
