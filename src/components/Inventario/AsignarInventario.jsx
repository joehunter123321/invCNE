import React, { useState } from "react";
import { Table, Input, Button, Select, Modal, Form } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import CsvDownloader from "react-csv-downloader";
const { Option } = Select;

function AsignarInventario({ user, loading, userTipo }) {
  console.log("Asignar Inventario", user.Identidad);
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("IDscanner");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values, record) => {
    handleUpdate(record.IDscanner, { NOMBREASIGNADO: values.AsignarA });
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
      const querySnapshot = await getDocs(collection(db, "InventarioCompleto"));
      const filteredData = querySnapshot.docs
        .filter((doc) => doc.data()[filterBy] === searchValue)
        .map((doc) => doc.data());
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const handleUpdate = async (id,newData) => {
   
    console.log("Updating document", id, "with data", newData);
    try {
      const db = getFirestore();
      const inventoryDocRef = doc(collection(db, "InventarioCompleto"), id);

      // Update field1 field in the document
      await updateDoc(inventoryDocRef, {
        AsignadoA: newData.NOMBREASIGNADO,
      });

      // Save the updated NOMBREASIGNADO value to "Asignado" collection
      const assignedDocRef = doc(
        collection(inventoryDocRef, "AsignadoHistorial")
      );

      await setDoc(assignedDocRef, {
        AsignadoA: newData.NOMBREASIGNADO,
        FechaAsignado: new Date().toISOString(),
      });

      setData((prevData) =>
        prevData.map((item) => {
          if (item.IDscanner === id) {
            // Merge the new data with the existing item
            return { ...item, ...newData.NOMBREASIGNADO };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const columns = [
    // Customize columns based on your data requirements
    { title: "IDscanner", dataIndex: "IDscanner", key: "IDscanner" },
    { title: "Correo", dataIndex: "Correo", key: "Correo" },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => setModalVisible(true)}>Asignar</Button>
          <Modal open={modalVisible} onCancel={handleCancel} footer={null}>
            <Form
              onFinish={(values) => onFinish(values, record)}
              layout="vertical"
              form={form}
            >
              <Form.Item
                label="AsignarA"
                name="AsignarA"
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Modal>
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
            <Option value="IDscanner">IDscanner</Option>
            <Option value="Correo">Correo</Option>
          </Select>
          <Button onClick={handleSearch}>Search</Button>
          <Table
            rowKey={(record) => record.IDscanner}
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

export default AsignarInventario;
