import api from "@/lib/api";
import { API_PATHS } from "@/constants";
import type { SalaryStats, TitleSalary, CountryOverview } from "@/types";

export const analyticsApi = {
  salaryStats: (country: string) =>
    api.get<SalaryStats>(API_PATHS.SALARY_STATS, { params: { country } }),

  salaryByJobTitle: (country: string, job_title?: string) =>
    job_title
      ? api.get<{ average: number | null }>(API_PATHS.SALARY_BY_JOB_TITLE, { params: { country, job_title } })
      : api.get<{ titles: TitleSalary[] }>(API_PATHS.SALARY_BY_JOB_TITLE, { params: { country } }),

  salarySummaryByCountry: () =>
    api.get<{ countries: CountryOverview[] }>(API_PATHS.SALARY_SUMMARY_BY_COUNTRY),
};
