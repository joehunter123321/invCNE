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
  doc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { PlusOutlined } from "@ant-design/icons";
import CsvDownloader from "react-csv-downloader";

import ScannerQrBarCode from "./ScannerQrBarCode";
import ModalHistorial from "./ModalHistorial";
import ModalAsignar from "./ModalAsignar";
const { Option } = Select;

function AsignarInventario({ user, loading, userTipo, childData }) {
  const [items, setItems] = useState(["Stock"]);
  const [modalHistorialVisible, setModalHistorialVisible] = useState(false);
  const [HistorialValue, setHistorialValue] = useState(null);
  const [historialData, sethistorialData] = useState(null);
  const [columns3, setColumns] = useState([]);
  const [columnsCsv, setColumnsCsv] = useState([]);
  const [name, setName] = useState("");
  const [nameSelected, setnameSelected] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onNameSelected = (event) => {
    console.log("onNameSelected", event);

    setnameSelected(event);
  };
  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const childRef = useRef(null);
  const executeChildFunction = () => {
    if (childRef.current) {
      childRef.current.start();
    }
  };

  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("IDScanner");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [idScanner, setIdScanner] = useState(null);
  const handleAsignar = (id) => {
    setModalVisible(true);
    setIdScanner(id);
  };


  const onFinish = (values, record) => {
    handleUpdate(record.IDScanner, nameSelected);
    setModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };

  const handleSearch = async () => {
    try {
      const db = getFirestore();

      const fieldNames = [];

      const q = query(
        collection(db, "Inventario"),
        where(filterBy, "==", searchValue)
      );

      const querySnapshot = await getDocs(q);
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

      // Agregar columna IDScanner como primera columna
      const indexOfIDScanner = fieldNames.indexOf("IDScanner");
      if (indexOfIDScanner !== -1) {
        fieldNames.splice(indexOfIDScanner, 1);
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

      setData(dataFiltrada);

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
              <Modal open={false} onCancel={handleCancel} footer={null}>
                <Form
                  onFinish={() => onFinish(values, record)}
                  layout="vertical"
                  form={form}
                >
                  <Form.Item name="AsignarA" label="AsignadoA">
                    <Select
                      onSelect={onNameSelected}
                      value={name}
                      name="AsignarA"
                      style={{ width: 300 }}
                      placeholder="custom dropdown render"
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider style={{ margin: "8px 0" }} />
                          <Space style={{ padding: "0 8px 4px" }}>
                            <Input
                              placeholder="Please enter item"
                              ref={inputRef}
                              value={name}
                              onChange={onNameChange}
                            />
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              onClick={addItem}
                            >
                              Add item
                            </Button>
                          </Space>
                        </>
                      )}
                      options={items.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form>
              </Modal>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={() => handleAsignar(record.IDScanner)}>Asignar</Button>
                <Button
                  style={{ background: "yellow" }}
                  onClick={() => handleHistorial(record.IDScanner)}
                >
                  Historial
                </Button>
                <Popconfirm
                  title="¿Seguro de eliminarlo??"
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

      setColumnsCsv(dynamicColumnsWithIdAndDisplayName);
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

  const handleUpdate = async (id, NOMBREASIGNADO) => {
    console.log(
      "Updating document",
      NOMBREASIGNADO,
      "with data",
      NOMBREASIGNADO
    );
    try {
      const db = getFirestore();
      const inventoryDocRef = doc(collection(db, "Inventario"), id);

      // Update field1 field in the document
      await updateDoc(inventoryDocRef, {
        AsignadoA: NOMBREASIGNADO,
      });

      // Save the updated NOMBREASIGNADO value to "Asignado" collection
      const assignedDocRef = doc(
        collection(inventoryDocRef, "AsignadoHistorial")
      );

      await setDoc(assignedDocRef, {
        AsignadoA: NOMBREASIGNADO,
        FechaAsignado: new Date().toISOString(),
      });

      setData((prevData) =>
        prevData.map((item) => {
          if (item.IDScanner === id) {
            // Merge the new data with the existing item
            return { ...item, ...NOMBREASIGNADO.NOMBREASIGNADO };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleHistorial = async (value) => {
    try {
      const db = getFirestore();

      const inventarioRef = doc(db, "Inventario", value);
      const inventarioDocSnapshot = await getDoc(inventarioRef);

      if (inventarioDocSnapshot.exists()) {
        const asignadoHistorialRef = collection(
          inventarioRef,
          "AsignadoHistorial"
        );

        const asignadoHistorialSnapshot = await getDocs(asignadoHistorialRef);

        const asignadoHistorialData = asignadoHistorialSnapshot.docs.map(
          (doc) => {
            return {
              color: doc.data().color,
              label: doc.data().AsignadoA,
              children: doc.data().FechaAsignado,
              // Add more key-value pairs as needed with the updated names
            };
          }
        );

        sethistorialData(asignadoHistorialData);
        setModalHistorialVisible(true);
        console.log(
          "setModalHistorialVisible Inventario",
          modalHistorialVisible
        );
      } else {
        console.log("Document does not exist in the 'Inventario' collection.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }

    setHistorialValue(value);
  };

 

  function qrCodeSuccessCallback(childData) {
    setSearchValue(childData);
  }
  const handleModaHistorialVisible = (isVisible) => {
    // Use the updated modalVisible value here in the parent
    if (isVisible) {
      setModalHistorialVisible(false);
    }
  };

  const handleModalAsignarlVisible = (isVisible) => {
    console.log("modddd", isVisible);
    // Use the updated modalVisible value here in the parent
    if (isVisible) {
      setModalVisible(false);
    }
  };
  console.log("columns3:", JSON.stringify(columns3, null, 2));
  return (
   <div style={{ height: "100vh", paddingTop: "5%" }}>
      <ModalHistorial
        values={historialData}
        visible={modalHistorialVisible}
        onModalVisible={handleModaHistorialVisible}
      />

      {!user ? null : !loading && user ? (
        <div>
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
            <Option value="IDScanner">IDScanner</Option>
            <Option value="InventariadoPorUserEmail">Correo</Option>
          </Select>

          <Button onClick={handleSearch}>Search</Button>
          <Table
            bordered
            scroll={{ x: 600 }}
            rowKey={(record) => record.IDScanner}
            dataSource={data}
            columns={columns3}
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
          <ModalAsignar visible={modalVisible} idScanner={idScanner}
           onModalVisible={handleModalAsignarlVisible}/>
        </div>
      ) : null}
    </div>
  );
}

export default AsignarInventario;
