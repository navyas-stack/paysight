"use client";

import React from "react";
import { Table, Tag, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { PAGE_SIZE_OPTIONS, STATUS_COLORS } from "@/constants";
import type { Employee, PaginationMeta } from "@/types";

interface EmployeeTableProps {
  employees: Employee[];
  meta: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export default function EmployeeTable({ employees, meta, loading, onPageChange, onEdit, onDelete, onView }: EmployeeTableProps) {
  const columns = [
    { title: "Full Name", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Job Title", dataIndex: "job_title", key: "job_title" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (val: string, record: Employee) => `${record.currency} ${Number(val).toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "employment_status",
      key: "employment_status",
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => onView(record.id)} />
          <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          <Popconfirm title="Delete this employee?" onConfirm={() => onDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={employees}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: meta.current_page,
        pageSize: meta.per_page,
        total: meta.total_count,
        showSizeChanger: true,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        onChange: onPageChange,
        showTotal: (total) => `${total} employees`,
      }}
    />
  );
}
