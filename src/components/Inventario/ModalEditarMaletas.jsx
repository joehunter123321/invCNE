import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";
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
const ModalEditarMaletas = ({ visible, values, onClose, onModalVisible }) => {
  const { user } = useUserAuth(); // Access and use user data as needed
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    // Actualiza los valores iniciales del formulario cuando cambian las propiedades 'values'
    if (visible) {
      form.setFieldsValue(values);
    }
  }, [visible, values]);

  const handleCancel = () => {
    setModalVisible(onModalVisible);

  };

  const handleOk = (formValues) => {
    setTimeout(() => {
      setModalVisible(onModalVisible);
    }, 3000);
    console.log(formValues);
  };

  const onFinish = async (formValues) => {
    try {
      console.log("values.user:", user.Identidad);
      console.log("values.user:", user.user.email);
      console.log("values.user:", user.Nombre);
      const db = getFirestore();
      const MaletaDocRef = doc(collection(db, "Gondolas"), id);

      // Update field1 field in the document
      await updateDoc(MaletaDocRef, {
        formValues
      });

      // Save the updated NOMBREASIGNADO value to "Asignado" collection
      const assignedDocRef = doc(
        collection(MaletaDocRef, "HistorialEdiciones")
      );

      await setDoc(assignedDocRef, {
        EditadoPorIdentidad: user.Identidad,
        EditadoPorNombre: user.Nombre,
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
    console.log(formValues);
    setModalVisible(false);
    // Puedes manejar la acción de envío de datos aquí
    // 'formValues' contendrá los valores actualizados del formulario
  };

  return (
    <Modal
      closable={false}
      open={modalVisible} // Cambiado de 'open' a 'visible'
      onCancel={onClose}
      destroyOnClose
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cerrar
        </Button>,
      ]}
    >
      {values ? (
        <Form form={form} onFinish={onFinish}>
          {Object.entries(values).map(([key, value]) => (
            <Form.Item key={key} label={key} name={key}>
              <Input
                placeholder={`Ingrese ${key}`}
                disabled={key === "IDScanner"}
              />
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <h1>sss</h1>
      )}
    </Modal>
  );
};

export default ModalEditarMaletas;
