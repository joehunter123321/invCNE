import React, { useState } from "react";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getAuth, signOut } from "firebase/auth";
import Logo from "../../assets/images/logo.jpg";
import { Button, Spin } from "antd";
const Navbar = ({ user, loading, userTipo }) => {
  console.log("navbaruserTipo", userTipo);
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
    console.log("navbar", user);
  };

  let Links = [
    { key: "1", name: "INICIO", link: "/" },
    { key: "2", name: "Agregar ", link: "/Inventario" },
    { key: "3", name: "Buscar", link: "/MostrarInventario" },
    { key: "4", name: "Elimnar ", link: "/MostrarInventarioAD" },
    { key: "5", name: "Asignar ", link: "/AsignarInventario" },
  ];

  Links = Links.filter(
    (link) =>
      link.link !== "/MostrarInventarioAD" ||
      (link.link === "/MostrarInventarioAD" &&
        loading === false &&
        userTipo === "Admin")
  );
  if (!user) {
    Links = [{ key: "1", name: "INICIO", link: "/" }];
  }

  let [open, setOpen] = useState(false);

  return (
    <div>
      <div className="shadow-md w-full fixed top-0 left-0">
        <div className="md:flex items-center justify-between bg-white md:py-0 sm:py-4 xs:py-4  xxs:py-4  md:px-10 px-7">
          {/* logo section */}
          <a href="/">
            <div className="font-bold text-2xl cursor-pointer flex items-center gap-1">
              <img src={Logo} className="w-12 h-12" />
              <span>Test Inv</span>
            </div>
          </a>
          {/* Menu icon */}
          <div
            onClick={() => setOpen(!open)}
            className="absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7"
          >
            {open ? <XMarkIcon /> : <Bars3BottomRightIcon />}
          </div>

          <div>
            {!user ? (
              <ul
                className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
                  open ? "top-12" : "top-[-490px]"
                }`}
              >
                {Links.map((link) => (
                  <li
                    key={link.key}
                    className="md:ml-8 md:my-0 my-7 font-semibold"
                  >
                    <a
                      href={link.link}
                      className="text-gray-800 hover:text-blue-400 duration-500"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : !loading && user ? (
              <ul
                className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
                  open ? "top-12" : "top-[-490px]"
                }`}
              >
                {Links.map((link) => (
                  <li
                    key={link.key}
                    className="md:ml-8 md:my-0 my-7 font-semibold"
                  >
                    <a
                      href={link.link}
                      className="text-gray-800 hover:text-blue-400 duration-500"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                <div>
                  {user ? (
                    <Button
                      style={{
                        marginLeft: "20px",
                        backgroundColor: "blue",
                        color: "white",
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  ) : null}
                </div>
              </ul>
            ) : (
              <Spin size="large" />
            )}

            {/* linke items */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
