import React, { useState, useEffect, createContext } from "react";
import { Drawer, Button, Menu, Spin } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.jpg";
import { getAuth, signOut } from "firebase/auth";
function TestNav({ user, loading, userTipo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Función para alternar la visibilidad del menú desplegable
  const toggleMenu = () => {
    setIsDrawerOpen(!isMenuOpen);
  };
  let navigate = useNavigate();

  function handleClick(key) {
    navigate(key.key);
    setIsDrawerOpen(false);
    console.log("Loading", key);
  }
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  let Links = [
    { key: "/Inventario", label: "Agregar ", link: "/Inventario" },
    { key: "/MostrarInventario", label: "Buscar", link: "/MostrarInventario" },
   
    {
      key: "/AsignarInventario",
      label: "Asignar ",
      link: "/AsignarInventario",
    },
  ];

  Links = Links.filter(
    (link) =>
      link.link !== "/MostrarInventarioAD" ||
      (link.link === "/MostrarInventarioAD" &&
        loading === false &&
        userTipo === "Admin")
  );
  if (!user) {
    Links = [];
  }

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div>
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
      >
        <Menu
          mode="vertical"
          items={Links}
          theme="light"
          selectable={false}
          onClick={handleClick}
        />
      </Drawer>
      <nav className="bg-white shadow-lg py-4 px-6 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-12 w-12 mr-2" />
            <span className="text-blue-500 text-lg font-semibold">INV</span>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-300"
            >
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 7h16v2H2V7zm0 6h16v-2H2v2zm0-4h16V7H2v2z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 3h20v2H0V3zm0 6h20V7H0v2zm0 6h20v-2H0v2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center">
          {!user ? (
            <div>
              {Links.map((link) => (
                <a
                  key={link.key}
                  href={link.link}
                  className="text-blue-500 hover:text-green-500 hover:underline px-3 py-2 rounded-md text-sm font-medium inline-block border-b-2 border-transparent hover:border-green-500"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : !loading && user ? (
            <div>
              {Links.map((link) => (
                <a
                  key={link.key}
                  href={link.link}
                  className="text-blue-500 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium inline-block border-b-2 border-transparent hover:border-blue-500"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : (
            <Spin size="large" />
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="ml-4 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default TestNav;
