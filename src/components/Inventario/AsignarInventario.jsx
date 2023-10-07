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
  const [filterBy, setFilterBy] = useState("IDscanner");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values, record) => {
    handleUpdate(record.IDscanner, nameSelected);
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

      // Agregar columna IDscanner como primera columna
      const indexOfIDscanner = fieldNames.indexOf("IDscanner");
      if (indexOfIDscanner !== -1) {
        fieldNames.splice(indexOfIDscanner, 1);
        fieldNames.unshift("IDscanner");
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
              <Modal open={modalVisible} onCancel={handleCancel} footer={null}>
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
                <Button onClick={() => setModalVisible(true)}>Asignar</Button>
                <Button
                  style={{ background: "yellow" }}
                  onClick={() => handleHistorial(record.IDscanner)}
                >
                  Historial
                </Button>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record.IDscanner)}
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
      setData((prevData) => prevData.filter((item) => item.IDscanner !== id));
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
          if (item.IDscanner === id) {
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

  const columns = [
    // Customize columns based on your data requirements
    {
      title: "IDscanner",
      dataIndex: "IDscanner",
      key: "IDscanner",
      fixed: "left",
      width: 100,
    },

    {
      title: "Inventariado Por",
      dataIndex: "InventariadoPorUserEmail",
      key: "InventariadoPorUserEmail",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (InventariadoPorUserEmail) => (
        <Tooltip placement="topLeft" title={InventariadoPorUserEmail}>
          {InventariadoPorUserEmail}
        </Tooltip>
      ),
    },
    {
      title: "Inventariado IDentidad",
      dataIndex: "InventariadoPorUserIDentidad",
      key: "InventariadoPorUserIDentidad",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (InventariadoPorUserIDentidad) => (
        <Tooltip placement="topLeft" title={InventariadoPorUserIDentidad}>
          {InventariadoPorUserIDentidad}
        </Tooltip>
      ),
    },
    {
      title: "Estado",
      dataIndex: "Estado",
      key: "Estado",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (Estado) => (
        <Tooltip placement="topLeft" title={Estado}>
          {Estado}
        </Tooltip>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "Categoria",
      key: "Categoria",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (Categoria) => (
        <Tooltip placement="topLeft" title={Categoria}>
          {Categoria}
        </Tooltip>
      ),
    },
    {
      title: "subCategoria",
      dataIndex: "subCategoria",
      key: "subCategoria",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (subCategoria) => (
        <Tooltip placement="topLeft" title={subCategoria}>
          {subCategoria}
        </Tooltip>
      ),
    },
    {
      title: "Ubicación",
      dataIndex: "Ubicacion",
      key: "Ubicacion",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (Ubicacion) => (
        <Tooltip placement="topLeft" title={Ubicacion}>
          {Ubicacion}
        </Tooltip>
      ),
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      width: 250,
      render: (values, record) => (
        <>
          <Modal open={modalVisible} onCancel={handleCancel} footer={null}>
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
                  style={{
                    width: 300,
                  }}
                  placeholder="custom dropdown render"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                        }}
                      />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                        }}
                      >
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
            <Button onClick={() => setModalVisible(true)}>Asignar</Button>

            <Button
              style={{ background: "yellow" }}
              onClick={() => handleHistorial(record.IDscanner)}
            >
              Historial
            </Button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.IDscanner)}
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
      id: "subCategoria",
      displayName: "subCategoria",
    },
    {
      id: "InventariadoPorUserIDentidad",
      displayName: "InventariadoPorUserIDentidad",
    },
    {
      id: "InventariadoPorUserEmail",
      displayName: "InventariadoPorUserEmail",
    },
    {
      id: "Estado",
      displayName: "Estado",
    },
    {
      id: "ubicacion",
      displayName: "ubicacion",
    },
  ];

  function qrCodeSuccessCallback(childData) {
    setSearchValue(childData);
  }
  const handleModaHistorialVisible = (isVisible) => {
    // Use the updated modalVisible value here in the parent
    if (isVisible) {
      setModalHistorialVisible(false);
    }
  };
  console.log("columns3:", JSON.stringify(columns3, null, 2));
  return (
    <div
      style={{
        padding: "10%",
      }}
    >
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
            <Option value="IDscanner">IDscanner</Option>
            <Option value="InventariadoPorUserEmail">Correo</Option>
          </Select>

          <Button onClick={handleSearch}>Search</Button>
          <Table
            bordered
            scroll={{ x: 600 }}
            rowKey={(record) => record.IDscanner}
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
        </div>
      ) : null}
    </div>
  );
}

export default AsignarInventario;
