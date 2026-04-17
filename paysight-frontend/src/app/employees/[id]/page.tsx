"use client";

import React, { useEffect } from "react";
import { Card, Descriptions, Tag, Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useEmployee } from "@/hooks/useEmployee";
import Loader from "@/components/Loader";
import { ROUTES, STATUS_COLORS } from "@/constants";

const { Title } = Typography;

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id) || null;

  const { employee, loading, error } = useEmployee(id);

  useEffect(() => {
    if (error) router.push(ROUTES.EMPLOYEES);
  }, [error, router]);

  if (loading) return <Loader />;
  if (!employee) return null;

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(ROUTES.EMPLOYEES)} className="back-button">
        Back to Employees
      </Button>

      <Card>
        <Title level={3}>{employee.full_name}</Title>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="Job Title">{employee.job_title}</Descriptions.Item>
          <Descriptions.Item label="Country">{employee.country}</Descriptions.Item>
          <Descriptions.Item label="Salary">
            {employee.currency} {Number(employee.salary).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLORS[employee.employment_status] || "default"}>
              {employee.employment_status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Date of Joining">{employee.date_of_joining || "N/A"}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
