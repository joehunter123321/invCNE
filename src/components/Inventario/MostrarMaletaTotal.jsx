import React, { useState, useEffect } from "react";
import { Table, Input, Space, Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import CsvDownloader from "react-csv-downloader";
function MostrarMaletaTotal() {
  const [dataMaletas, setDataMaletas] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, "Gondolas"), (snapshot) => {
      const dataMaletas = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        dataMaletas.push({
          id: doc.id,
          ...data,
        });
      });

      setDataMaletas(dataMaletas);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const columns = [
    {
      title: "IDScanner",
      dataIndex: "IDScanner",
      key: "IDScanner",
      width: 100,
      sorter: (a, b) => a.IDScanner.localeCompare(b.IDScanner),
      sortDirections: ["ascend", "descend"],
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Buscar IDScanner`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reiniciar
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.IDScanner.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Gondola",
      dataIndex: "Gondola",
      key: "Gondola",
      sorter: (a, b) => a.Gondola - b.Gondola,
      sortDirections: ["ascend", "descend"],
      width: 100,
    },
    {
      title: "Lado",
      dataIndex: "Lado",
      key: "Lado",
      sorter: (a, b) => a.Lado.localeCompare(b.Lado),
      sortDirections: ["ascend", "descend"],
      width: 100,
    },
    {
      title: "Bloque",
      dataIndex: "Bloque",
      key: "Bloque",
      sorter: (a, b) => a.Bloque - b.Bloque,
      sortDirections: ["ascend", "descend"],
      width: 100,
    },
    {
      title: "Nivel",
      dataIndex: "Nivel",
      key: "Nivel",
      sorter: (a, b) => a.Nivel - b.Nivel,
      sortDirections: ["ascend", "descend"],
      width: 100,
    },
    {
      title: "InventariadoPorUserIDentidad",
      width: 250,
      dataIndex: "InventariadoPorUserIDentidad",
      key: "InventariadoPorUserIDentidad",
      sorter: (a, b) =>
        a.InventariadoPorUserIDentidad.localeCompare(
          b.InventariadoPorUserIDentidad
        ),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "InventariadoPorUserEmail",
      dataIndex: "InventariadoPorUserEmail",
      key: "InventariadoPorUserEmail",

      sorter: (a, b) =>
        a.InventariadoPorUserEmail.localeCompare(b.InventariadoPorUserEmail),
      sortDirections: ["ascend", "descend"],
    },
  ];

  const columns2 = columns.map((column) => ({
    id: column.dataIndex,
    displayName: column.title,
  }));

  const Total = dataMaletas.length;
  const Datadown = dataMaletas;
  console.log("dataMaletas",dataMaletas)
  return (
    <div style={{ height: "100vh", paddingTop: "5%" }}>
      {dataMaletas.length > 0 ? (
        <div>
          {" "}
          <h1>Todas las Maletas {Total}</h1>
          <Table
            style={{ padding: "5%" }}
            bordered
            virtual
            pagination={false}
            columns={columns}
            scroll={{ x: 900, y: 900 }}
            dataSource={dataMaletas}
            rowKey={(record) => record.IDScanner}
          />
          <CsvDownloader
            filename="myfile"
            extension=".csv"
            separator=";"
            wrapColumnChar=""
            columns={columns2}
            datas={dataMaletas}
          >
            <Button>Download</Button>
          </CsvDownloader>
        </div>
      ) : (
        <Spin size="large" />
      )}
    </div>
  );
}

export default MostrarMaletaTotal;
