"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Tag, Typography } from "antd";
import { employeesApi, type Employee, type PaginationMeta } from "@/lib/api";

const { Title } = Typography;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total_count: 0, total_pages: 0, current_page: 1, per_page: 25 });
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await employeesApi.list({ page, per_page: 25 });
      setEmployees(data.employees);
      setMeta(data.meta);
    } catch {
      console.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const columns = [
    { title: "Full Name", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Job Title", dataIndex: "job_title", key: "job_title" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (val: string) => `$${Number(val).toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "employment_status",
      key: "employment_status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : status === "inactive" ? "orange" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>Employees</Title>

      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: meta.current_page,
          pageSize: meta.per_page,
          total: meta.total_count,
          onChange: (page) => fetchEmployees(page),
          showTotal: (total) => `${total} employees`,
        }}
      />
    </div>
  );
}
