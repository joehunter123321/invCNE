import React, { useState } from "react";
import { Link, useNavigate, BrowserRouter as Router } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";

const items = [
  {
    label: "Agregar",
    key: "/MostrarInventario",
    icon: <MailOutlined />,
    path: "/agregars",
  },
  {
    label: "Buscar",
    key: "/agregarss",
    icon: <AppstoreOutlined />,
    path: "/buscarsss",
  },
  {
    label: "Eliminar",
    key: "/agregarsss",
    icon: <AppstoreOutlined />,
    path: "/eliminarssss",
  },
];

const TestNav = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(items[0].key);

  const handleMenuClick = (item) => {
    console.log("handleMenuClick", item.key);
    navigate(item.key);
  };

  return (
    <div>
      
        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
     
    </div>
  );
};

export default TestNav;
