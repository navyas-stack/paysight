"use client";

import React from "react";
import { Layout, Menu } from "antd";
import { TeamOutlined, BarChartOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants";

const { Sider, Content } = Layout;

const menuItems = [
  { key: ROUTES.EMPLOYEES, icon: <TeamOutlined />, label: "Employees" },
  { key: ROUTES.ANALYTICS, icon: <BarChartOutlined />, label: "Salary Insights" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Layout className="app-layout">
      <Sider breakpoint="lg" collapsedWidth={80} className="app-sider">
        <div className="app-logo">PaySight</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout className="app-content-wrapper">
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  );
}
