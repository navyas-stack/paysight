import api from "@/lib/api";
import { API_PATHS } from "@/constants";
import type { Employee, EmployeeFilters, PaginationMeta } from "@/types";

type ListParams = { page?: number; per_page?: number } & EmployeeFilters;

export const employeesApi = {
  list: (params?: ListParams) =>
    api.get<{ employees: Employee[]; meta: PaginationMeta }>(API_PATHS.EMPLOYEES, { params }),

  get: (id: number) =>
    api.get<{ employee: Employee }>(API_PATHS.EMPLOYEE(id)),

  create: (employee: Partial<Employee>) =>
    api.post<{ employee: Employee }>(API_PATHS.EMPLOYEES, { employee }),

  update: (id: number, employee: Partial<Employee>) =>
    api.patch<{ employee: Employee }>(API_PATHS.EMPLOYEE(id), { employee }),

  delete: (id: number) =>
    api.delete(API_PATHS.EMPLOYEE(id)),
};
