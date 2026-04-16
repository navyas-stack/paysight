"use client";

import React from "react";
import { Layout, Menu } from "antd";
import { TeamOutlined, BarChartOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "/employees", icon: <TeamOutlined />, label: "Employees" },
  { key: "/analytics", icon: <BarChartOutlined />, label: "Salary Insights" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={80}
        style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 10 }}
      >
        <div style={{ padding: "16px", textAlign: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>
          PaySight
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ padding: "0 24px 24px", background: "#f5f5f5", overflow: "auto", height: "100vh" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
