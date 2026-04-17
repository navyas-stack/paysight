export const ROUTES = {
  EMPLOYEES: "/employees",
  EMPLOYEE_DETAIL: (id: number | string) => `/employees/${id}`,
  ANALYTICS: "/analytics",
} as const;

export const API_PATHS = {
  EMPLOYEES: "/employees",
  EMPLOYEE: (id: number) => `/employees/${id}`,
  SALARY_STATS: "/analytics/salary_stats",
  SALARY_BY_JOB_TITLE: "/analytics/salary_by_job_title",
  SALARY_SUMMARY_BY_COUNTRY: "/analytics/salary_summary_by_country",
} as const;

export const COUNTRY_CURRENCY: Record<string, string> = {
  India: "INR",
  USA: "USD",
  UK: "GBP",
  Germany: "EUR",
  Canada: "CAD",
  Australia: "AUD",
  Japan: "JPY",
  Singapore: "SGD",
  Brazil: "BRL",
  France: "EUR",
};

export const COUNTRIES = Object.keys(COUNTRY_CURRENCY);

export const JOB_TITLES = [
  "Engineer",
  "Designer",
  "Manager",
  "Director",
  "Analyst",
  "Consultant",
  "Architect",
  "Lead",
  "Intern",
  "Coordinator",
];

export const EMPLOYMENT_STATUSES = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Terminated", value: "terminated" },
];

export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "SGD", "BRL"];

export const PAGE_SIZE_OPTIONS = ["10", "25", "50", "100"];
export const DEFAULT_PAGE_SIZE = 25;

export const STATUS_COLORS: Record<string, string> = {
  active: "green",
  inactive: "orange",
  terminated: "red",
};
