"use client";

import React from "react";
import { Spin } from "antd";

interface LoaderProps {
  size?: "small" | "default" | "large";
  fullPage?: boolean;
}

export default function Loader({ size = "large", fullPage = true }: LoaderProps) {
  return <Spin size={size} className={fullPage ? "loader-full-page" : "loader-inline"} />;
}
