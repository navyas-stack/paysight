"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, message, Tag, Space, Popconfirm, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { employeesApi, type Employee, type PaginationMeta } from "@/lib/api";
import EmployeeForm from "@/components/EmployeeForm";

const { Title } = Typography;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total_count: 0, total_pages: 0, current_page: 1, per_page: 25 });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await employeesApi.list({ page, per_page: 25 });
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
      fetchEmployees(meta.current_page);
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
      fetchEmployees(meta.current_page);
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
