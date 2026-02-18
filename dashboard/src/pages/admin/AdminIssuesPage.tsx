import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { admin } from "../../lib/api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { MessageSquare } from "lucide-react";
import type { Issue } from "../../types/api";

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

export function AdminIssuesPage() {
  const { showToast } = useToast();
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.issues()
      .then(setIssuesList)
      .catch(() => showToast("שגיאה בטעינת דיווחים", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">כל הדיווחים</h1>

      <Card>
        {issuesList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">אין דיווחים</p>
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
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">עמוד</th>
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
                    <td className="py-3 px-4 text-gray-500 max-w-[200px] truncate" dir="ltr">{issue.page_url}</td>
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
