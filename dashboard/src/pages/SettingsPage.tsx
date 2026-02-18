import { useEffect, useState } from "react";
import { useSites } from "../context/SiteContext";
import { useToast } from "../context/ToastContext";
import { config as configApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { ColorPicker } from "../components/ui/ColorPicker";
import { Spinner } from "../components/ui/Spinner";
import type { ConfigUpdate } from "../types/api";
import { Settings } from "lucide-react";

export function SettingsPage() {
  const { activeSite } = useSites();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [iconColor, setIconColor] = useState("#3B82F6");
  const [position, setPosition] = useState("right");
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [iconSize, setIconSize] = useState("medium");
  const [language, setLanguage] = useState("he");
  const [statementHe, setStatementHe] = useState("");
  const [statementEn, setStatementEn] = useState("");
  const [statementTab, setStatementTab] = useState<"he" | "en">("he");

  useEffect(() => {
    if (!activeSite) return;
    setLoading(true);
    configApi.get(activeSite.id).then((c) => {
      setIconColor(c.icon_color || "#3B82F6");
      setPosition(c.position || "right");
      setOffsetX(c.offset_x || 0);
      setOffsetY(c.offset_y || 0);
      setIconSize(c.icon_size || "medium");
      setLanguage(c.language || "he");
      setStatementHe(c.statement_he || "");
      setStatementEn(c.statement_en || "");
    }).catch(() => {
      showToast("שגיאה בטעינת הגדרות", "error");
    }).finally(() => setLoading(false));
  }, [activeSite, showToast]);

  if (!activeSite) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Settings size={48} className="mx-auto mb-3 opacity-50" />
        <p>בחר אתר כדי לערוך הגדרות</p>
      </div>
    );
  }

  if (loading) return <Spinner className="py-20" />;

  const saveAppearance = async () => {
    setSaving(true);
    try {
      const data: ConfigUpdate = { icon_color: iconColor, position, offset_x: offsetX, offset_y: offsetY, icon_size: iconSize, language };
      await configApi.update(activeSite.id, data);
      showToast("ההגדרות נשמרו בהצלחה", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "שגיאה", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveStatement = async () => {
    setSaving(true);
    try {
      await configApi.update(activeSite.id, { statement_he: statementHe, statement_en: statementEn });
      showToast("ההצהרה נשמרה בהצלחה", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "שגיאה", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">הגדרות ווידג'ט</h1>
      <p className="text-sm text-gray-500 mb-6">אתר: <span className="font-medium text-gray-700" dir="ltr">{activeSite.domain}</span></p>

      {/* Appearance */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">נראות ומיקום</h2>
        <div className="space-y-5">
          <ColorPicker label="צבע אייקון" value={iconColor} onChange={setIconColor} />

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">מיקום</label>
            <div className="flex gap-2">
              {(["right", "left"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    position === p ? "bg-brand-50 border-brand-300 text-brand-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p === "right" ? "ימין" : "שמאל"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">מרחק X</label>
            <input
              type="number"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg"
              dir="ltr"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">מרחק Y</label>
            <input
              type="number"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg"
              dir="ltr"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">גודל אייקון</label>
            <select
              value={iconSize}
              onChange={(e) => setIconSize(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
            >
              <option value="small">קטן</option>
              <option value="medium">בינוני</option>
              <option value="large">גדול</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">שפה</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
            >
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={saveAppearance}
              disabled={saving}
              className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
            >
              {saving ? "שומר..." : "שמור שינויים"}
            </button>
          </div>
        </div>
      </Card>

      {/* Statement */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">הצהרת נגישות</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setStatementTab("he")}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              statementTab === "he" ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            עברית
          </button>
          <button
            onClick={() => setStatementTab("en")}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              statementTab === "en" ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            English
          </button>
        </div>

        {statementTab === "he" ? (
          <textarea
            value={statementHe}
            onChange={(e) => setStatementHe(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="הזן הצהרת נגישות בעברית..."
          />
        ) : (
          <textarea
            value={statementEn}
            onChange={(e) => setStatementEn(e.target.value)}
            rows={8}
            dir="ltr"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Enter accessibility statement in English..."
          />
        )}

        <div className="pt-4">
          <button
            onClick={saveStatement}
            disabled={saving}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
          >
            {saving ? "שומר..." : "שמור הצהרה"}
          </button>
        </div>
      </Card>
    </div>
  );
}
