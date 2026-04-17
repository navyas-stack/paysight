import { useEffect, useState } from "react";
import { employeesApi } from "@/services/employeesApi";
import type { Employee } from "@/types";

export function useEmployee(id: number | null) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    employeesApi
      .get(id)
      .then(({ data }) => setEmployee(data.employee))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { employee, loading, error };
}
