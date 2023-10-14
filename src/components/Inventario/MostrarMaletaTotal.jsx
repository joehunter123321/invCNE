import React, { useState, useEffect } from "react";
import { Table, Input, Space, Button, Spin, Tag, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import CsvDownloader from "react-csv-downloader";

function MostrarMaletaTotal() {
  const [dataMaletas, setDataMaletas] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [ExistDup, setExistDup] = useState([]);

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

  useEffect(() => {
    const newDuplicates = checkDuplicates(dataMaletas);
    setDuplicates(newDuplicates);
  }, [dataMaletas]);

  const checkDuplicates = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    const duplicatesArray = [];

    data.forEach((record) => {
      const matchingRows = data.filter((item) => {
        return (
          item.Gondola === record.Gondola &&
          item.Lado === record.Lado &&
          item.Bloque === record.Bloque &&
          item.Nivel === record.Nivel &&
          item.id !== record.id
        );
      });

      // Agrega el número de ocurrencias al objeto del duplicado si es mayor  a VAR 5  + 1
      if (matchingRows.length > 5) {
        const duplicateObject = {
          ...record,
          occurrences: matchingRows.length + 1,
        };
        duplicatesArray.push(duplicateObject);
      }
    });

    duplicatesArray.sort((a, b) => {
      if (a.Gondola !== b.Gondola) {
        return a.Gondola - b.Gondola;
      }
      if (a.Lado !== b.Lado) {
        return a.Lado - b.Lado;
      }
      if (a.Bloque !== b.Bloque) {
        return a.Bloque - b.Bloque;
      }
      return a.Nivel - b.Nivel;
    });

    return duplicatesArray;
  };

  const columns = [
    {
      title: "IDScanner",
      dataIndex: "IDScanner",
      key: "IDScanner",
      width: 150,
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
      render: (text, record) => (
        <span>
          {checkDuplicates(dataMaletas).some(
            (d) =>
              d.Gondola === record.Gondola &&
              d.Lado === record.Lado &&
              d.Bloque === record.Bloque &&
              d.Nivel === record.Nivel
          ) ? (
            <Tag color="red">{text}</Tag>
          ) : (
            <span>{text}</span>
          )}
        </span>
      ),
    },
    {
      title: "Torre",
      dataIndex: "Lado",
      key: "Lado",
      sorter: (a, b) => a.Lado.localeCompare(b.Lado),
      sortDirections: ["ascend", "descend"],
      width: 100,
      render: (text, record) => (
        <span>
          {checkDuplicates(dataMaletas).some(
            (d) =>
              d.Gondola === record.Gondola &&
              d.Lado === record.Lado &&
              d.Bloque === record.Bloque &&
              d.Nivel === record.Nivel
          ) ? (
            <Tag color="red">{text}</Tag>
          ) : (
            <span>{text}</span>
          )}
        </span>
      ),
    },
    {
      title: "Bloque",
      dataIndex: "Bloque",
      key: "Bloque",
      sorter: (a, b) => a.Bloque - b.Bloque,
      sortDirections: ["ascend", "descend"],
      width: 100,
      render: (text, record) => (
        <span>
          {checkDuplicates(dataMaletas).some(
            (d) =>
              d.Gondola === record.Gondola &&
              d.Lado === record.Lado &&
              d.Bloque === record.Bloque &&
              d.Nivel === record.Nivel
          ) ? (
            <Tag color="red">{text}</Tag>
          ) : (
            <span>{text}</span>
          )}
        </span>
      ),
    },
    {
      title: "Nivel",
      dataIndex: "Nivel",
      key: "Nivel",
      sorter: (a, b) => a.Nivel - b.Nivel,
      sortDirections: ["ascend", "descend"],
      width: 100,
      render: (text, record) => (
        <span>
          {checkDuplicates(dataMaletas).some(
            (d) =>
              d.Gondola === record.Gondola &&
              d.Lado === record.Lado &&
              d.Bloque === record.Bloque &&
              d.Nivel === record.Nivel
          ) ? (
            <Tag color="red">{text}</Tag>
          ) : (
            <span>{text}</span>
          )}
        </span>
      ),
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
  console.log("duplicates", duplicates.length);
  console.log("ExistDup", dataMaletas);
  return (
    <div style={{ height: "100vh", paddingTop: "5%" }}>
      {dataMaletas.length > 0 ? (
        <div>
          <h1>Todas las Maletas {Total}</h1>
          <div>
            {duplicates.length > 1 && (
              <Alert
                message="Alerta de Duplicados"
                description="Se han encontrado múltiples duplicados en los datos."
                type="error"
                showIcon
              />
            )}
            {/* Resto del código... */}
          </div>
          <Table
            style={{ padding: "5%" }}
            bordered
            virtual
            pagination={false}
            columns={columns}
            scroll={{ x: 900, y: 500 }}
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
          <CsvDownloader
            filename="DUP"
            extension=".csv"
            separator=";"
            wrapColumnChar=""
            columns={columns2}
            datas={duplicates}
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
