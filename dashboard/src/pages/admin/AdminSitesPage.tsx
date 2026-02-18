import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { admin } from "../../lib/api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { CopyButton } from "../../components/ui/CopyButton";
import { Globe } from "lucide-react";
import type { Site } from "../../types/api";

export function AdminSitesPage() {
  const { showToast } = useToast();
  const [sitesList, setSitesList] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.sites()
      .then(setSitesList)
      .catch(() => showToast("שגיאה בטעינת אתרים", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">כל האתרים</h1>

      <Card>
        {sitesList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Globe size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">אין אתרים</p>
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
                </tr>
              </thead>
              <tbody>
                {sitesList.map((site) => (
                  <tr key={site.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900" dir="ltr">{site.domain}</td>
                    <td className="py-3 px-4">
                      <Badge variant={site.status === "active" ? "green" : "yellow"}>
                        {site.status === "active" ? "פעיל" : "לא פעיל"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600" dir="ltr">
                          {site.license_key.slice(0, 12)}...
                        </code>
                        <CopyButton text={site.license_key} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(site.created_at).toLocaleDateString("he-IL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
