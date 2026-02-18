import { useEffect, useState } from "react";
import { Globe, Activity, AlertTriangle, Plus, Trash2, Copy } from "lucide-react";
import { useSites } from "../context/SiteContext";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { AddSiteModal } from "../components/features/AddSiteModal";

export function DashboardPage() {
  const { sites, loading, loadSites, removeSite } = useSites();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  if (loading) return <Spinner className="py-20" />;

  const activeSites = sites.filter((s) => s.status === "active").length;

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast("מפתח הועתק", "success");
  };

  const handleDelete = async (id: number, domain: string) => {
    if (!confirm(`למחוק את האתר ${domain}?`)) return;
    try {
      await removeSite(id);
      showToast("האתר נמחק", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "שגיאה", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">לוח בקרה</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          <Plus size={16} />
          הוסף אתר
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
              <Globe size={20} className="text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{sites.length}</p>
              <p className="text-sm text-gray-500">אתרים רשומים</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeSites}</p>
              <p className="text-sm text-gray-500">אתרים פעילים</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{sites.length - activeSites}</p>
              <p className="text-sm text-gray-500">לא פעילים</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sites Table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">האתרים שלי</h2>
        {sites.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Globe size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">אין אתרים עדיין. לחץ "הוסף אתר" כדי להתחיל.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">דומיין</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">מפתח רישיון</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">תאריך יצירה</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900" dir="ltr">{site.domain}</td>
                    <td className="py-3 px-4">
                      <Badge variant={site.status === "active" ? "green" : "gray"}>
                        {site.status === "active" ? "פעיל" : "לא פעיל"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded" dir="ltr">
                          {site.license_key.slice(0, 18)}...
                        </code>
                        <button onClick={() => copyKey(site.license_key)} className="text-gray-400 hover:text-brand-500">
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(site.created_at).toLocaleDateString("he-IL")}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(site.id, site.domain)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddSiteModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
