import React, { useState } from "react";
import { Table, Input, Button, Select, Popconfirm } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

import CsvDownloader from "react-csv-downloader";
const { Option } = Select;

function MostrarInventarioAD({ user, loading, userTipo }) {
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("IDScanner");
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

  const handleDelete = async (id) => {
    console.log("Deleting)", id);
    try {
      const db = getFirestore();
      const documentRef = doc(collection(db, "Inventario"), id);
      await deleteDoc(documentRef);
      setData((prevData) => prevData.filter((item) => item.IDScanner !== id));
    } catch (error) {
      console.error("Error deleting element:", error);
    }
  };

  const columns = [
    // Customize columns based on your data requirements
    { title: "IDScanner", dataIndex: "IDScanner", key: "IDScanner" },
    { title: "Correo", dataIndex: "Correo", key: "Correo" },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="¿Seguro de eliminarlo??"
          onConfirm={() => handleDelete(record.IDScanner)}
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const columns2 = [
    {
      id: "IDScanner",
      displayName: "IDScanner",
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
      {!user ? null : !loading && user ? (
        <div>
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Enter search value"
          />
          <Select value={filterBy} onChange={handleFilterChange}>
            <Option value="IDScanner">IDScanner</Option>
            <Option value="Correo">Correo</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Table
            rowKey={(record) => record.IDScanner}
            dataSource={data}
            columns={columns}
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
      ) : null}
    </div>
  );
}

export default MostrarInventarioAD;
