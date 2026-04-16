"use client";

import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import type { Employee } from "@/lib/api";
import dayjs from "dayjs";

interface EmployeeFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  initialValues?: Partial<Employee>;
}

const COUNTRY_CURRENCY: Record<string, string> = {
  India: "INR", USA: "USD", UK: "GBP", Germany: "EUR", Canada: "CAD",
  Australia: "AUD", Japan: "JPY", Singapore: "SGD", Brazil: "BRL", France: "EUR",
};

const COUNTRIES = Object.keys(COUNTRY_CURRENCY);

const JOB_TITLES = [
  "Engineer", "Designer", "Manager", "Director", "Analyst",
  "Consultant", "Architect", "Lead", "Intern", "Coordinator",
];

export default function EmployeeForm({ form, initialValues }: EmployeeFormProps) {
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date_of_joining: initialValues.date_of_joining ? dayjs(initialValues.date_of_joining) : null,
      });
    }
  }, [initialValues, form]);

  const handleCountryChange = (country: string) => {
    form.setFieldsValue({ currency: COUNTRY_CURRENCY[country] });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="full_name" label="Full Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="job_title" label="Job Title" rules={[{ required: true }]}>
        <Select options={JOB_TITLES.map((t) => ({ label: t, value: t }))} />
      </Form.Item>

      <Form.Item name="country" label="Country" rules={[{ required: true }]}>
        <Select showSearch options={COUNTRIES.map((c) => ({ label: c, value: c }))} onChange={handleCountryChange} />
      </Form.Item>

      <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} min={1} />
      </Form.Item>

      <Form.Item name="currency" label="Currency" initialValue="USD">
        <Input disabled />
      </Form.Item>

      <Form.Item name="employment_status" label="Status" initialValue="active">
        <Select options={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }, { label: "Terminated", value: "terminated" }]} />
      </Form.Item>

      <Form.Item name="date_of_joining" label="Date of Joining">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
    </Form>
  );
}
