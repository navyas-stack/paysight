import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use((response) => {
  const body = response.data;
  if (body && typeof body === "object" && "success" in body) {
    const { data, meta } = body as { data: unknown; meta?: unknown };
    response.data = meta !== undefined ? { ...(data as object), meta } : data;
  }
  return response;
});

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  job_title: string;
  country: string;
  salary: number;
  currency: string;
  employment_status: string;
  date_of_joining: string | null;
}

export interface PaginationMeta {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

export interface SalaryStats {
  min: number;
  max: number;
  average: number;
  count: number;
}

export interface TitleSalary {
  job_title: string;
  average_salary: number;
}

export interface CountryOverview {
  country: string;
  count: number;
  average_salary: number;
}

export const employeesApi = {
  list: (params?: { page?: number; per_page?: number }) =>
    api.get<{ employees: Employee[]; meta: PaginationMeta }>("/employees", { params }),

  get: (id: number) =>
    api.get<{ employee: Employee }>(`/employees/${id}`),

  create: (employee: Partial<Employee>) =>
    api.post<{ employee: Employee }>("/employees", { employee }),

  update: (id: number, employee: Partial<Employee>) =>
    api.patch<{ employee: Employee }>(`/employees/${id}`, { employee }),

  delete: (id: number) =>
    api.delete(`/employees/${id}`),
};

export const analyticsApi = {
  salaryStats: (country: string) =>
    api.get<SalaryStats>("/analytics/salary_stats", { params: { country } }),

  salaryByJobTitle: (country: string, job_title: string) =>
    api.get<{ average: number | null }>("/analytics/salary_by_job_title", { params: { country, job_title } }),

  topPayingTitles: (country: string, limit?: number) =>
    api.get<{ titles: TitleSalary[] }>("/analytics/top_paying_titles", { params: { country, limit } }),

  countryOverview: () =>
    api.get<{ countries: CountryOverview[] }>("/analytics/country_overview"),
};

export default api;
