import React from "react";
import { Tabs, Card } from "antd";

import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import AddMaletas from "./AddMaletas";
import Inventario from "./inventario";

const MenuAdd = () => {
  const navigate = useNavigate();
  const { source } = useParams();

  const onChange = (key) => {
    console.log(key);

    navigate(`/agregar/${key}`);
    console.log(source);
  };

  const initialItems = [
    {
      label: "Maletas",
      children:   <Outlet />,
      key: "Maletas",
    },
    {
      label: "Logistica",
      children:  <Outlet />,
      key: "Logistica",
    },
  ];
  const defaultTab = "Logistica";
  return (
    <div>
      <Tabs
       
        onChange={onChange}
        type="card"
        items={initialItems}
      />
     
     
    </div>
  );
};

export default MenuAdd;
