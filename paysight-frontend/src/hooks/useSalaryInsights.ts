import { useEffect, useState, useCallback } from "react";
import { analyticsApi } from "@/services/analyticsApi";
import type { SalaryStats, TitleSalary, CountryOverview } from "@/types";

export function useSalarySummary() {
  const [summary, setSummary] = useState<CountryOverview[]>([]);

  useEffect(() => {
    analyticsApi.salarySummaryByCountry().then(({ data }) => setSummary(data.countries));
  }, []);

  return summary;
}

export function useCountryInsights(country: string) {
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [titles, setTitles] = useState<TitleSalary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!country) return;
    setLoading(true);

    try {
      const [statsRes, titlesRes] = await Promise.all([
        analyticsApi.salaryStats(country),
        analyticsApi.salaryByJobTitle(country),
      ]);
      setStats(statsRes.data);
      setTitles((titlesRes.data as { titles: TitleSalary[] }).titles || []);
    } catch {
      setStats(null);
      setTitles([]);
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, titles, loading };
}
