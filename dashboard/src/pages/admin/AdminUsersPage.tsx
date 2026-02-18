import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { admin } from "../../lib/api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { Users } from "lucide-react";
import type { User } from "../../types/api";

export function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    admin.users()
      .then(setUsers)
      .catch(() => showToast("שגיאה בטעינת משתמשים", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const updated = await admin.approveUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      showToast("המשתמש אושר בהצלחה", "success");
    } catch {
      showToast("שגיאה באישור המשתמש", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (id: number) => {
    setActionLoading(id);
    try {
      const updated = await admin.revokeUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      showToast("האישור בוטל", "success");
    } catch {
      showToast("שגיאה בביטול האישור", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ניהול משתמשים</h1>

      <Card>
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">אין משתמשים</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">אימייל</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">אדמין</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">תאריך הרשמה</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900" dir="ltr">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.is_approved ? "green" : "yellow"}>
                        {user.is_approved ? "מאושר" : "ממתין"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {user.is_admin && <Badge variant="blue">אדמין</Badge>}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("he-IL")}
                    </td>
                    <td className="py-3 px-4">
                      {!user.is_admin && (
                        user.is_approved ? (
                          <button
                            onClick={() => handleRevoke(user.id)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50"
                          >
                            {actionLoading === user.id ? "..." : "בטל אישור"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(user.id)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 text-xs text-green-600 bg-green-50 hover:bg-green-100 rounded-lg disabled:opacity-50"
                          >
                            {actionLoading === user.id ? "..." : "אשר"}
                          </button>
                        )
                      )}
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
