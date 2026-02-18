import { useState } from "react";
import { Modal } from "../ui/Modal";
import { useSites } from "../../context/SiteContext";
import { useToast } from "../../context/ToastContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddSiteModal({ open, onClose }: Props) {
  const { addSite } = useSites();
  const { showToast } = useToast();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    try {
      await addSite(domain.trim());
      showToast("האתר נוסף בהצלחה", "success");
      setDomain("");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "שגיאה בהוספת אתר", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="הוספת אתר חדש">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">דומיין</label>
          <input
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            dir="ltr"
          />
          <p className="text-xs text-gray-400 mt-1">הזן את הדומיין ללא https:// או נתיב</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "מוסיף..." : "הוסף אתר"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
