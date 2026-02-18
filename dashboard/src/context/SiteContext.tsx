import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { sites as sitesApi } from "../lib/api";
import { ACTIVE_SITE_KEY } from "../lib/constants";
import type { Site } from "../types/api";

interface SiteState {
  sites: Site[];
  activeSite: Site | null;
  loading: boolean;
  loadSites: () => Promise<void>;
  selectSite: (site: Site) => void;
  addSite: (domain: string) => Promise<Site>;
  removeSite: (id: number) => Promise<void>;
}

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSites = useCallback(async () => {
    setLoading(true);
    try {
      const list = await sitesApi.list();
      setSites(list);

      const savedId = localStorage.getItem(ACTIVE_SITE_KEY);
      const saved = savedId ? list.find((s) => s.id === Number(savedId)) : null;
      setActiveSite(saved || list[0] || null);
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectSite = (site: Site) => {
    setActiveSite(site);
    localStorage.setItem(ACTIVE_SITE_KEY, String(site.id));
  };

  const addSite = async (domain: string) => {
    const site = await sitesApi.create({ domain });
    setSites((prev) => [site, ...prev]);
    selectSite(site);
    return site;
  };

  const removeSite = async (id: number) => {
    await sitesApi.remove(id);
    setSites((prev) => prev.filter((s) => s.id !== id));
    if (activeSite?.id === id) {
      const remaining = sites.filter((s) => s.id !== id);
      setActiveSite(remaining[0] || null);
    }
  };

  return (
    <SiteContext.Provider value={{ sites, activeSite, loading, loadSites, selectSite, addSite, removeSite }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSites() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSites must be inside SiteProvider");
  return ctx;
}
