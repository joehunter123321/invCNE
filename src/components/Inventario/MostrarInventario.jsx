import React, { useState, useEffect, createContext } from "react";
import { Table, Input, Button, Select } from "antd";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useUserAuth } from "../../auth/UserAuthContext";
import CsvDownloader from "react-csv-downloader";
const { Option } = Select;

function MostrarInventario() {
  const { user } = useUserAuth();
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("IDscanner");
  const [data, setData] = useState([]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };

  const handleSearch = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "Inventario"));
      const filteredData = querySnapshot.docs
        .filter((doc) => doc.data()[filterBy] === searchValue)
        .map((doc) => doc.data());
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const columns = [
    { title: "IDscanner", dataIndex: "IDscanner", key: "IDscanner" },
    { title: "Categoria", dataIndex: "Categoria", key: "Categoria" },
    { title: "Estado", dataIndex: "Estado", key: "Estado" },
    { title: "Inventariado Por", dataIndex: "InventariadoPorUserIDentidad", key: "InventariadoPorUserIDentidad" },
   
  ];
  const columns2 = [
    {
      id: "IDscanner",
      displayName: "IDscanner",
    },
    {
      id: "Categoria",
      displayName: "Categoria",
    },
    {
      id: "field1",
      displayName: "field1",
    },
  ];

  return (
    <div>
      <h1> MostrarInventario </h1>
      <Input
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Enter search value"
      />
      <Select value={filterBy} onChange={handleFilterChange}>
        <Option value="IDscanner">ID Scanner</Option>
        <Option value="InventariadoPorUserEmail">Correo</Option>
        <Option value="Categoria">Categoria</Option>
        <Option value="Estado">Estado</Option>
      </Select>
      <Button onClick={handleSearch}>Search</Button>

      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record) => record.IDscanner}
      />

      <CsvDownloader
        filename="myfile"
        extension=".csv"
        separator=";"
        wrapColumnChar="'"
        columns={columns2}
        datas={data}
        text="DOWNLOAD"
      />
    </div>
  );
}

export default MostrarInventario;
