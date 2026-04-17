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

export interface EmployeeFilters {
  search?: string;
  country?: string;
  job_title?: string;
  employment_status?: string;
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
