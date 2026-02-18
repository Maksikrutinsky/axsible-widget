import { useEffect, useState } from "react";
import { useSites } from "../context/SiteContext";
import { useToast } from "../context/ToastContext";
import { issues as issuesApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { AlertTriangle } from "lucide-react";
import type { Issue } from "../types/api";

const TYPE_LABELS: Record<string, string> = {
  navigation: "ניווט",
  visual: "ויזואלי",
  "screen-reader": "קורא מסך",
  other: "אחר",
};

const TYPE_COLORS: Record<string, string> = {
  navigation: "blue",
  visual: "yellow",
  "screen-reader": "green",
  other: "gray",
};

export function IssuesPage() {
  const { activeSite } = useSites();
  const { showToast } = useToast();
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeSite) return;
    setLoading(true);
    issuesApi.list(activeSite.id)
      .then(setIssuesList)
      .catch(() => showToast("שגיאה בטעינת דיווחים", "error"))
      .finally(() => setLoading(false));
  }, [activeSite, showToast]);

  if (!activeSite) {
    return (
      <div className="text-center py-20 text-gray-400">
        <AlertTriangle size={48} className="mx-auto mb-3 opacity-50" />
        <p>בחר אתר כדי לראות דיווחים</p>
      </div>
    );
  }

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">דיווחי נגישות</h1>
      <p className="text-sm text-gray-500 mb-6">
        אתר: <span className="font-medium text-gray-700" dir="ltr">{activeSite.domain}</span>
      </p>

      <Card>
        {issuesList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <AlertTriangle size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">אין דיווחים עדיין</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">שם</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">אימייל</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">סוג</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">תיאור</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">תאריך</th>
                </tr>
              </thead>
              <tbody>
                {issuesList.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{issue.reporter_name}</td>
                    <td className="py-3 px-4 text-gray-500" dir="ltr">{issue.reporter_email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={TYPE_COLORS[issue.type] as "blue" | "yellow" | "green" | "gray" || "gray"}>
                        {TYPE_LABELS[issue.type] || issue.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{issue.description}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(issue.created_at).toLocaleDateString("he-IL")}</td>
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
