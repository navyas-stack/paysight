"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space, Popconfirm, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { employeesApi, type Employee, type EmployeeFilters, type PaginationMeta } from "@/lib/api";
import EmployeeForm from "@/components/EmployeeForm";

const { Title } = Typography;

const COUNTRIES = ["India", "USA", "UK", "Germany", "Canada", "Australia", "Japan", "Singapore", "Brazil", "France"];
const JOB_TITLES = ["Engineer", "Designer", "Manager", "Director", "Analyst", "Consultant", "Architect", "Lead", "Intern", "Coordinator"];
const EMPLOYMENT_STATUSES = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Terminated", value: "terminated" },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total_count: 0, total_pages: 0, current_page: 1, per_page: 25 });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [form] = Form.useForm();

  const fetchEmployees = useCallback(async (page = 1, activeFilters: EmployeeFilters = {}) => {
    setLoading(true);
    try {
      const { data } = await employeesApi.list({ page, per_page: 25, ...activeFilters });
      setEmployees(data.employees);
      setMeta(data.meta);
    } catch {
      message.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const applyFilters = (next: EmployeeFilters) => {
    setFilters(next);
    fetchEmployees(1, next);
  };

  const clearFilters = () => applyFilters({});

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date_of_joining: values.date_of_joining?.format("YYYY-MM-DD") || null,
      };

      if (editingEmployee) {
        await employeesApi.update(editingEmployee.id, payload);
        message.success("Employee updated");
      } else {
        await employeesApi.create(payload);
        message.success("Employee created");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingEmployee(null);
      fetchEmployees(meta.current_page, filters);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { errors?: string[] } } };
        const errors = axiosErr.response?.data?.errors;
        if (errors) message.error(errors.join(", "));
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await employeesApi.delete(id);
      message.success("Employee deleted");
      fetchEmployees(meta.current_page, filters);
    } catch {
      message.error("Failed to delete employee");
    }
  };

  const openCreate = () => {
    setEditingEmployee(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

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
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="Delete this employee?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Employees</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Employee
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Search by name or email"
          allowClear
          defaultValue={filters.search}
          onSearch={(val) => applyFilters({ ...filters, search: val.trim() || undefined })}
          style={{ width: 260 }}
        />
        <Select
          placeholder="Country"
          allowClear
          showSearch
          value={filters.country}
          onChange={(val) => applyFilters({ ...filters, country: val })}
          options={COUNTRIES.map((c) => ({ label: c, value: c }))}
          style={{ width: 160 }}
        />
        <Select
          placeholder="Job title"
          allowClear
          value={filters.job_title}
          onChange={(val) => applyFilters({ ...filters, job_title: val })}
          options={JOB_TITLES.map((t) => ({ label: t, value: t }))}
          style={{ width: 160 }}
        />
        <Select
          placeholder="Status"
          allowClear
          value={filters.employment_status}
          onChange={(val) => applyFilters({ ...filters, employment_status: val })}
          options={EMPLOYMENT_STATUSES}
          style={{ width: 140 }}
        />
        <Button onClick={clearFilters}>Clear</Button>
      </Space>

      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: meta.current_page,
          pageSize: meta.per_page,
          total: meta.total_count,
          onChange: (page) => fetchEmployees(page, filters),
          showTotal: (total) => `${total} employees`,
        }}
      />

      <Modal
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditingEmployee(null); }}
        okText={editingEmployee ? "Update" : "Create"}
        forceRender
      >
        <EmployeeForm form={form} initialValues={editingEmployee || undefined} />
      </Modal>
    </div>
  );
}
