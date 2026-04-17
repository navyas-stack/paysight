import { useState, useCallback } from "react";
import { employeesApi } from "@/services/employeesApi";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { Employee, EmployeeFilters, PaginationMeta } from "@/types";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    per_page: DEFAULT_PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(
    async (page = 1, perPage = DEFAULT_PAGE_SIZE, filters: EmployeeFilters = {}) => {
      setLoading(true);
      try {
        const { data } = await employeesApi.list({ page, per_page: perPage, ...filters });
        setEmployees(data.employees);
        setMeta(data.meta);
      } catch {
        console.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { employees, meta, loading, fetchEmployees };
}
