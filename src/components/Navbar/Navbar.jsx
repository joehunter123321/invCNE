import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockOutlined,
  FileAddOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Menu, Drawer, Button, Spin } from "antd";
import Logo from "../../assets/images/logo.jpg";
import { getAuth, signOut } from "firebase/auth";
import { useLocation } from "react-router-dom";
const Navbar = ({ user, loading, userTipo, childData }) => {
  console.log("navbar", loading);

  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuNormal, setmenuNormal] = useState("");
  const [menuResponsive, setmenuResponsive] = useState("");

  const userType = userTipo; // Replace with your user type logic
  const location = useLocation();
  const currentPath = location.pathname.substring(1);
  const items = [
    (user && userType === "Admin") ||
    userType === "Escritura" ||
    userType === "Lectura"
      ? {
          label: "Agregar",
          key: "SubMenu1",
          icon: <FileAddOutlined />,
          children: [
            {
              type: "group",
              label: "Agregar",
              children: [
                { label: "Maletas", key: "AgregarMaletas" },
                { label: "Logistica", key: "AgragarLogistica" },
              ],
            },
          ],
        }
      : null,
    (user && userType === "Admin") || userType === "Lectura"
      ? {
          label: "Buscar",
          key: "SubMenu2",
          icon: <SearchOutlined />,
          children: [
            {
              type: "group",
              label: "Buscar",
              children: [
                { label: "Maletas", key: "BuscarMaletas" },
                { label: "Logistica", key: "BuscarLogistica" },
              ],
            },
          ],
        }
      : null,
    ...(user && userType === "Admin"
      ? [
          {
            label: "Test",
            key: "SubMenu3",
            icon: <LockOutlined />,
            children: [
              {
                type: "group",
                label: "Test",
                children: [
                  { label: "Agregar Categorias", key: "AgregarCategorias" },
                  {
                    label: "Mostrar Maletas Total",
                    key: "MostrarMaletasTotal",
                  },
                  { label: "Registro", key: "Registro" },
                ],
              },
            ],
          },
        ]
      : []),
    { label: user ? "LogOut" : "Login", key: "/" },
  ];

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/"); // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleDrawerOpen = () => {
    setMenuVisible(true);
  };

  const handleDrawerClose = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    const handleMediaQueryChange = (mediaQuery) => {
      if (mediaQuery.matches) {
        setmenuNormal(false);
        setmenuResponsive(true);
      } else {
        setmenuNormal(true);
        setmenuResponsive(false);
      }
    };

    const mediaQuery = window.matchMedia("(max-width: 480px)");
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Agrega esta parte para restablecer el estado al aumentar el tamaño de la pantalla
    if (!mediaQuery.matches) {
      setmenuNormal(true);
      setmenuResponsive(false);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const onClick = (e) => {
    setCurrent(e.key);
    if (e.key === "/") {
      setMenuVisible(false);
      handleLogout();
    } else {
      navigate(e.key);
      setMenuVisible(false);
    }
  };

  return (
    <div>
      <div
        className="Nav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          className="Logo"
          style={{ alignSelf: "flex-start", paddingLeft: "20px" }}
        >
          <img src={Logo} alt="Logo" style={{ width: 40 }} />
        </div>

        {menuNormal ? (
          loading ? (
            <Spin size="large" />
          ) : (
            <div style={{ alignSelf: "flex-end", minWidth: "390px" }}>
              <Menu
                onClick={onClick}
                selectedKeys={currentPath}
                mode="horizontal"
                items={items}
              />
            </div>
          )
        ) : (
          <div>
            <Button type="text" onClick={handleDrawerOpen}>
              <MenuOutlined />
            </Button>
          </div>
        )}
      </div>

      {loading ? null : (
        <Drawer
          placement="right"
          open={menuVisible}
          onClose={handleDrawerClose}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            onClick={onClick}
            selectedKeys={[currentPath]}
            mode="inline"
            items={items}
          />
        </Drawer>
      )}
    </div>
  );
};

export default Navbar;
