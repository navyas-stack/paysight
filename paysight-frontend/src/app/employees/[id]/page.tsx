"use client";

import React, { useState, useEffect } from "react";
import { Card, Descriptions, Tag, Button, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { employeesApi, type Employee } from "@/lib/api";

const { Title } = Typography;

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;

    employeesApi.get(id)
      .then(({ data }) => setEmployee(data.employee))
      .catch(() => router.push("/employees"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
  if (!employee) return null;

  const statusColor = employee.employment_status === "active" ? "green" : employee.employment_status === "inactive" ? "orange" : "red";

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/employees")} style={{ marginBottom: 16 }}>
        Back to Employees
      </Button>

      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>{employee.full_name}</Title>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="Job Title">{employee.job_title}</Descriptions.Item>
          <Descriptions.Item label="Country">{employee.country}</Descriptions.Item>
          <Descriptions.Item label="Salary">{employee.currency} {Number(employee.salary).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColor}>{employee.employment_status.toUpperCase()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Date of Joining">{employee.date_of_joining || "N/A"}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
