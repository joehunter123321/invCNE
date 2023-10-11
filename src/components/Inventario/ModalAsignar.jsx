import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Divider, Space,message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
import { useUserAuth } from "../../auth/UserAuthContext";
const ModalAsignar = ({
  idScanner,
  Values,
  visible,
  onModalVisible,
  onClose,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [nameSelected, setnameSelected] = useState("");
  const [items, setItems] = useState(["Stock"]);
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const { user } = useUserAuth(); // Access and use user data as needed
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleCancel = () => {
    setModalVisible(onModalVisible);
  };



  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
   
  };

  const handleFormSubmit = async (values) => {
    const NOMBREASIGNADO = values.AsignarA;
    const id = idScanner;
    console.log("Updating document", values.AsignarA);
    try {
      const db = getFirestore();
      const inventoryDocRef = doc(collection(db, "Inventario"), id);

      // Update field1 field in the document
      await updateDoc(inventoryDocRef, {
        AsignadoA: NOMBREASIGNADO,
        AsignadoPOR: user.Identidad,
      });

      // Save the updated NOMBREASIGNADO value to "Asignado" collection
      const assignedDocRef = doc(
        collection(inventoryDocRef, "AsignadoHistorial")
      );

      await setDoc(assignedDocRef, {
        AsignadoA: NOMBREASIGNADO,
        FechaAsignado: new Date().toISOString(),
      });
       message.success( "Asignado Correctamente a : "+ nameSelected );
      setData((prevData) =>
        prevData.map((item) => {
          if (item.IDScanner === id) {
            // Merge the new data with the existing item
            return { ...item, ...NOMBREASIGNADO.NOMBREASIGNADO };
          }
          return item;
        })
      );
      setModalVisible(onModalVisible);
     
    } catch (error) {
      message.error("Error al Asignar :", error);
 
    }
  };

  const onNameSelected = (event) => {
    console.log("onNameSelected", event);

    setnameSelected(event);
  };
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <Modal
        closable={false}
        open={modalVisible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cerrar
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleFormSubmit}>
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAsignar;
