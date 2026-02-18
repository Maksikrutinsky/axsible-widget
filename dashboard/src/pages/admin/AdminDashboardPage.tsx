import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { admin } from "../../lib/api";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Users, Globe, MessageSquare, UserCheck, UserX } from "lucide-react";
import type { AdminDashboard } from "../../types/api";

export function AdminDashboardPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.dashboard()
      .then(setData)
      .catch(() => showToast("שגיאה בטעינת סטטיסטיקות", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) return <Spinner className="py-20" />;
  if (!data) return null;

  const stats = [
    { label: "סה\"כ משתמשים", value: data.total_users, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "משתמשים מאושרים", value: data.approved_users, icon: UserCheck, color: "text-green-600 bg-green-50" },
    { label: "ממתינים לאישור", value: data.pending_users, icon: UserX, color: "text-yellow-600 bg-yellow-50" },
    { label: "סה\"כ אתרים", value: data.total_sites, icon: Globe, color: "text-purple-600 bg-purple-50" },
    { label: "אתרים פעילים", value: data.active_sites, icon: Globe, color: "text-indigo-600 bg-indigo-50" },
    { label: "סה\"כ דיווחים", value: data.total_issues, icon: MessageSquare, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">לוח בקרה - ניהול</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
