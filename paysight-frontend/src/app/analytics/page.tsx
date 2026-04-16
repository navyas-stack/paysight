"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Select, Statistic, Row, Col, Table, Typography, Spin, Empty } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { analyticsApi, type SalaryStats, type TitleSalary, type CountryOverview } from "@/lib/api";

const { Title } = Typography;

const COUNTRY_CURRENCY: Record<string, string> = {
  India: "INR", USA: "USD", UK: "GBP", Germany: "EUR", Canada: "CAD",
  Australia: "AUD", Japan: "JPY", Singapore: "SGD", Brazil: "BRL", France: "EUR",
};

const COUNTRIES = Object.keys(COUNTRY_CURRENCY);

const JOB_TITLES = [
  "Engineer", "Designer", "Manager", "Director", "Analyst",
  "Consultant", "Architect", "Lead", "Intern", "Coordinator",
];

export default function AnalyticsPage() {
  const [country, setCountry] = useState<string>("India");
  const [jobTitle, setJobTitle] = useState<string>("Engineer");
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [jobTitleAvg, setJobTitleAvg] = useState<number | null>(null);
  const [allTitles, setAllTitles] = useState<TitleSalary[]>([]);
  const [overview, setOverview] = useState<CountryOverview[]>([]);
  const [loading, setLoading] = useState(false);

  const currency = COUNTRY_CURRENCY[country] || "USD";

  useEffect(() => {
    analyticsApi.salarySummaryByCountry().then(({ data }) => setOverview(data.countries));
  }, []);

  const fetchCountryData = useCallback(async (selectedCountry: string) => {
    setLoading(true);
    try {
      const [statsRes, titlesRes] = await Promise.all([
        analyticsApi.salaryStats(selectedCountry),
        analyticsApi.salaryByJobTitle(selectedCountry),
      ]);
      setStats(statsRes.data);
      setAllTitles((titlesRes.data as { titles: TitleSalary[] }).titles || []);
    } catch {
      setStats(null);
      setAllTitles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountryData(country);
  }, [country, fetchCountryData]);

  const fetchJobTitleAvg = useCallback(async (c: string, jt: string) => {
    try {
      const { data } = await analyticsApi.salaryByJobTitle(c, jt);
      setJobTitleAvg((data as { average: number | null }).average);
    } catch {
      setJobTitleAvg(null);
    }
  }, []);

  useEffect(() => {
    fetchJobTitleAvg(country, jobTitle);
  }, [country, jobTitle, fetchJobTitleAvg]);

  const overviewColumns = [
    { title: "Country", dataIndex: "country", key: "country" },
    { title: "Employees", dataIndex: "count", key: "count" },
    {
      title: "Avg Salary",
      dataIndex: "average_salary",
      key: "average_salary",
      render: (val: number, record: CountryOverview) =>
        `${COUNTRY_CURRENCY[record.country] || ""} ${val.toLocaleString()}`,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "sticky", top: 0, zIndex: 5, background: "#f5f5f5", paddingTop: 16, paddingBottom: 8 }}>
        <Title level={3} style={{ margin: 0 }}>Salary Insights</Title>
        <Select
          value={country}
          onChange={setCountry}
          style={{ width: 200 }}
          options={COUNTRIES.map((c) => ({ label: c, value: c }))}
        />
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
      ) : (
        <>
          <Card title={`Salary Statistics — ${country}`} style={{ marginBottom: 24 }}>
            {stats && stats.count > 0 ? (
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="Minimum Salary" value={stats.min} prefix={currency} />
                </Col>
                <Col span={6}>
                  <Statistic title="Maximum Salary" value={stats.max} prefix={currency} />
                </Col>
                <Col span={6}>
                  <Statistic title="Average Salary" value={stats.average} prefix={currency} precision={2} />
                </Col>
                <Col span={6}>
                  <Statistic title="Total Employees" value={stats.count} />
                </Col>
              </Row>
            ) : (
              <Empty description={`No employees found in ${country}`} />
            )}
          </Card>

          <Card title={`Average Salary by Job Title — ${country}`} style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Select
                value={jobTitle}
                onChange={setJobTitle}
                style={{ width: 200 }}
                options={JOB_TITLES.map((t) => ({ label: t, value: t }))}
              />
            </div>

            {jobTitleAvg !== null ? (
              <Statistic title={`${jobTitle} in ${country}`} value={jobTitleAvg} prefix={currency} precision={2} />
            ) : (
              <Empty description={`No ${jobTitle} employees in ${country}`} />
            )}

            {allTitles.length > 0 && (
              <ResponsiveContainer width="100%" height={350} style={{ marginTop: 24 }}>
                <BarChart data={allTitles}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="job_title" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currency} ${Number(value).toLocaleString()}`} />
                  <Bar dataKey="average_salary" fill="#1677ff" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </>
      )}

      <Card title="Salary Summary by Country">
        <Table
          dataSource={overview}
          columns={overviewColumns}
          rowKey="country"
          pagination={false}
        />
      </Card>
    </div>
  );
}
