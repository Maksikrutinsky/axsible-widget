import { useSites } from "../context/SiteContext";
import { Card } from "../components/ui/Card";
import { CopyButton } from "../components/ui/CopyButton";
import { Code } from "lucide-react";

export function EmbedPage() {
  const { activeSite } = useSites();

  if (!activeSite) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Code size={48} className="mx-auto mb-3 opacity-50" />
        <p>בחר אתר כדי לראות את קוד ההטמעה</p>
      </div>
    );
  }

  const embedCode = `<script src="https://axsible-widget.onrender.com/dist/a11y-widget.js" data-client-id="${activeSite.license_key}"></script>`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">קוד הטמעה</h1>
      <p className="text-sm text-gray-500 mb-6">
        אתר: <span className="font-medium text-gray-700" dir="ltr">{activeSite.domain}</span>
      </p>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">הוסף את הקוד הבא לאתר שלך</h2>
        <p className="text-sm text-gray-500 mb-4">
          הדבק את הקוד לפני תגית ה-<code className="bg-gray-100 px-1 rounded" dir="ltr">&lt;/body&gt;</code> בכל דף באתר שלך.
        </p>

        <div className="relative">
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto" dir="ltr">
            <code>{embedCode}</code>
          </pre>
          <div className="absolute top-2 left-2">
            <CopyButton text={embedCode} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-brand-50 rounded-lg border border-brand-100">
          <h3 className="text-sm font-semibold text-brand-800 mb-2">מפתח רישיון</h3>
          <div className="flex items-center gap-3">
            <code className="text-sm bg-white px-3 py-1.5 rounded border border-brand-200 text-brand-700 font-mono" dir="ltr">
              {activeSite.license_key}
            </code>
            <CopyButton text={activeSite.license_key} />
          </div>
        </div>
      </Card>
    </div>
  );
}
