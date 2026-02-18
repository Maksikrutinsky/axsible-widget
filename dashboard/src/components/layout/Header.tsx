import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSites } from "../../context/SiteContext";

export function Header() {
  const { user, logout } = useAuth();
  const { sites, activeSite, selectSite } = useSites();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Site Selector */}
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
        >
          <span className="font-medium text-gray-700">
            {activeSite ? activeSite.domain : "בחר אתר"}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full mt-1 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => { selectSite(site); setDropdownOpen(false); }}
                className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  activeSite?.id === site.id ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-700"
                }`}
              >
                {site.domain}
              </button>
            ))}
            {sites.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">אין אתרים עדיין</div>
            )}
            <div className="border-t border-gray-100">
              <button
                onClick={() => { setDropdownOpen(false); window.location.href = "/"; }}
                className="w-full text-right px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 flex items-center gap-2"
              >
                <Plus size={14} />
                הוסף אתר חדש
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{user?.email}</span>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          יציאה
        </button>
      </div>
    </header>
  );
}
