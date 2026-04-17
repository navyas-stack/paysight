"use client";

import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { COUNTRIES, COUNTRY_CURRENCY, JOB_TITLES, EMPLOYMENT_STATUSES } from "@/constants";
import type { Employee } from "@/types";

interface EmployeeFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  initialValues?: Partial<Employee>;
}

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
        <InputNumber className="w-full" min={1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="currency" label="Currency" initialValue="USD">
        <Input disabled />
      </Form.Item>

      <Form.Item name="employment_status" label="Status" initialValue="active">
        <Select options={EMPLOYMENT_STATUSES} />
      </Form.Item>

      <Form.Item name="date_of_joining" label="Date of Joining">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
    </Form>
  );
}
