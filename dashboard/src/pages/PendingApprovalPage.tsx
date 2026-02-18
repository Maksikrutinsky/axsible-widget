import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/api";
import { Clock } from "lucide-react";

export function PendingApprovalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const me = await auth.me();
        if (me.is_approved) {
          window.location.href = "/";
        }
      } catch { /* ignore */ }
    }, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-yellow-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">החשבון ממתין לאישור</h2>
        <p className="text-gray-500 text-sm mb-6">
          החשבון שלך ({user?.email}) נרשם בהצלחה וממתין לאישור מנהל.
          <br />
          נעדכן אותך ברגע שהחשבון יאושר.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          יציאה
        </button>
      </div>
    </div>
  );
}
