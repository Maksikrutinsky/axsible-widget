import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth as authApi } from "../lib/api";

type Tab = "login" | "register";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ email, password });
      setSuccess("ההרשמה הצליחה! החשבון ממתין לאישור מנהל. תוכל להתחבר בינתיים.");
      setTab("login");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהרשמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600">Axsible</h1>
          <p className="text-gray-500 mt-2">ניהול ווידג'ט הנגישות</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                tab === "login"
                  ? "text-brand-600 border-b-2 border-brand-500 bg-brand-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              התחברות
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                tab === "register"
                  ? "text-brand-600 border-b-2 border-brand-500 bg-brand-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              הרשמה
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                {success}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-brand-500 text-white rounded-lg font-medium text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "מתחבר..." : "התחבר"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="לפחות 8 תווים"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימות סיסמה</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-brand-500 text-white rounded-lg font-medium text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "נרשם..." : "צור חשבון"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  לאחר ההרשמה, החשבון יחכה לאישור מנהל לפני שתוכל להיכנס
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
