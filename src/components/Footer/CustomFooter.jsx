import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Link } = Typography;

const CustomFooter = () => {
  return (
    <Footer style={{ backgroundColor: "grey", color: "#fff" }}>
      <p style={{ color: "#333" }}> test</p>
      <p style={{ color: "#777" }}>
      
      </p>
    </Footer>
  );
};

export default CustomFooter;
