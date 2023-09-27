import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import MostrarInventario from "../Inventario/mostrarInventario";
import MostrarInventarioAD from "../Inventario/mostrarInventario";
const items = [
  {
    key: "/Inventario",
    label: "Agregar",
    url: "/Inventario",
    children: <MostrarInventario />,
  },
  {
    key: "/MostrarInventario",
    label: "Buscar",
    url: "/MostrarInventario",
    children: <MostrarInventario />,
  },
  {
    key: "/MostrarInventarioAD",
    label: "Elimnar",
    url: "/MostrarInventarioAD",
    children: <MostrarInventarioAD  />,
  },
  {
    key: "/AsignarInventario",
    label: "Asignar",
    url: "/AsignarInventario",
    children: <MostrarInventario />,
  },
];

const Inicio = (r) => {
  const history = useNavigate();
  const onChange = (key) => {
    
  };

  return (
    <div>
       
      <Tabs
        type="card"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        size="large"
      />
    </div>
  );
};

export default Inicio;
