import React, { useState, useEffect, createContext } from "react";
import { Table } from "antd";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CsvDownloader from "react-csv-downloader";
function MostrarInventario() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchTodoInventario = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(
          collection(db, "InventarioCompleto")
        );
        const dataArr = [];
        querySnapshot.forEach((doc) => {
          dataArr.push(doc.data());
        });
        setData(dataArr);
      } catch (error) {
        console.error("Error fetching TodoInventario collection:", error);
      }
    };

    fetchTodoInventario();
  }, []);

  const columns = [
    { title: "IDscanner", dataIndex: "IDscanner", key: "IDscanner" },
    { title: "Categoria", dataIndex: "Categoria", key: "Categoria" },
    { title: "field1", dataIndex: "field1", key: "field1" },
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
