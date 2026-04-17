"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Space, message, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { employeesApi } from "@/services/employeesApi";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeForm from "@/components/EmployeeForm";
import { ROUTES, COUNTRIES, JOB_TITLES, EMPLOYMENT_STATUSES } from "@/constants";
import type { Employee, EmployeeFilters } from "@/types";

const { Title } = Typography;

export default function EmployeesPage() {
  const router = useRouter();
  const { employees, meta, loading, fetchEmployees } = useEmployees();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const applyFilters = (next: EmployeeFilters) => {
    setFilters(next);
    fetchEmployees(1, meta.per_page, next);
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
      fetchEmployees(meta.current_page, meta.per_page, filters);
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
      fetchEmployees(meta.current_page, meta.per_page, filters);
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

  return (
    <div>
      <div className="page-header">
        <Title level={3} className="page-header__title">Employees</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Employee
        </Button>
      </div>

      <Space className="employees-filters" wrap>
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

      <EmployeeTable
        employees={employees}
        meta={meta}
        loading={loading}
        onPageChange={(page, pageSize) => fetchEmployees(page, pageSize, filters)}
        onEdit={openEdit}
        onDelete={handleDelete}
        onView={(id) => router.push(ROUTES.EMPLOYEE_DETAIL(id))}
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
