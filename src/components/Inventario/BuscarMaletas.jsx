import React, { useState, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Modal,
  Form,
  Divider,
  Space,
  Popconfirm,
  Tooltip,
  message,
} from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import ScannerQrBarCode from "./ScannerQrBarCode";
import CsvDownloader from "react-csv-downloader";
import ModalEditarMaletas from "./ModalEditarMaletas";

function BuscarMaletas({ user, loading, userTipo, childData }) {
  const [columns, setColumns] = useState([]);
  const [columnsCsv, setColumnsCsv] = useState([]);
  const inputRef = useRef(null);
  const childRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("IDScanner");
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [editData, setEditData] = useState(null);
  ////////
  const handleFilterChange = (value) => {
    setFilterBy(value);
  };
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {
    try {
      console.log("searchValue", searchValue, filterBy);
      const db = getFirestore();

      const q = query(
        collection(db, "Gondolas"),
        where(filterBy, "==", searchValue)
      );
      const querySnapshot = await getDocs(q);

      const fieldNames = [];
      const dataFiltrada = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dataFiltrada.push({
          id: doc.id,
          ...doc.data(),
        });

        Object.keys(data).forEach((fieldName) => {
          if (!fieldNames.includes(fieldName)) {
            fieldNames.push(fieldName);
          }
        });
      });

      // Agregar columna IDscanner como primera columna
      const indexOfIDscanner = fieldNames.indexOf("IDScanner");
      if (indexOfIDscanner !== -1) {
        fieldNames.splice(indexOfIDscanner, 1);
        fieldNames.unshift("IDScanner");
      }

      const dynamicColumns = fieldNames.map((fieldName) => ({
        title: fieldName,
        dataIndex: fieldName,
        key: fieldName,
      }));

      const dynamicColumnsWithIdAndDisplayName = fieldNames.map(
        (fieldName) => ({
          id: fieldName,
          displayName: fieldName,
        })
      );

      const filteredData = querySnapshot.docs
        .filter((doc) => doc.data()[filterBy] === searchValue)
        .map((doc) => doc.data());

      // Agregar columna adicional "Actions"
      const columnsWithActions = [
        ...dynamicColumns,
        {
          title: "Actions",
          dataIndex: "",
          key: "actions",
          width: 250,
          render: (values, record) => (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => setModalVisible(true)}>Asignar</Button>
                <Button
                  style={{ background: "yellow" }}
                  onClick={() => handleEdit(record)}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record.IDScanner)}
                >
                  <Button type="primary" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
              </div>
            </>
          ),
        },
      ];

      setColumns(columnsWithActions);
      setData(dataFiltrada);

      setColumnsCsv(dynamicColumnsWithIdAndDisplayName);
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  function qrCodeSuccessCallback(childData) {
    setSearchValue(childData);
  }
  const handleEdit = (record) => {
    const id = record.IDScanner
    delete record.id;
    if (record.hasOwnProperty("IDScanner")) {
      const { IDScanner, ...rest } = record;
      const reorderedRecord = {
        IDScanner,
        ...rest,
      };
      console.log(reorderedRecord);
      setEditItemId(id);
      setEditData(reorderedRecord);
      setModalVisible(true);
    }
  };

  const handleModalEditar = (isVisible) => {
    // Use the updated modalVisible value here in the parent
    if (isVisible) {
      setModalVisible(false);
    }
  };
  return (
    <div style={{ height: "100vh", paddingTop: "5%" }}>
      <h1>Buscar Maletas</h1>

      <ScannerQrBarCode
        fps={10}
        qrbox={250}
        disableFlip={false}
        ref={childRef}
        handleCallback={qrCodeSuccessCallback}
      />
      <Input
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Enter search value"
      />
      <Select value={filterBy} onChange={handleFilterChange}>
        <Option value="IDscanner">IDscanner</Option>
        <Option value="InventariadoPorUserEmail">Correo</Option>
      </Select>

      <Button onClick={handleSearch}>Search</Button>
      <Table
        bordered
        scroll={{ x: 600 }}
        rowKey={(record) => record.IDScanner}
        dataSource={data}
        columns={columns}
      />

      <CsvDownloader
        filename="myfile"
        extension=".csv"
        separator=";"
        wrapColumnChar="'"
        columns={columnsCsv}
        datas={data}
      >
        <Button>Download</Button>
      </CsvDownloader>
      <ModalEditarMaletas
        editItemId={editItemId}
        values={editData}
        visible={modalVisible}
        onModalVisible={handleModalEditar}
      />
    </div>
  );
}

export default BuscarMaletas;
