import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, message } from "antd";
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
    const id = values.IDScanner;

    try {
      console.log("values.user:", user.Identidad);
      console.log("values.user:", user.user.email);
      console.log("values.user:", user.Nombre);
      const db = getFirestore();
      const MaletaDocRef = doc(collection(db, "Gondolas"), id);

      // Update field1 field in the document
      await updateDoc(MaletaDocRef, formValues);
      message.info("Actualizado ");

      // Save the updated NOMBREASIGNADO value to "Asignado" collection
      const HistorialEdicionesDocRef = doc(
        collection(MaletaDocRef, "HistorialEdiciones")
      );

      await setDoc(HistorialEdicionesDocRef, {
        EditadoPorIdentidad: user.Identidad,
        EditadoPorNombre: user.Nombre,
        FechaEditado: new Date().toISOString(),
      });
    } catch (error) {
      message.info("Error al Actualizar ", error);
      console.error("Error updating document:", error);
    }

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
      ) : null}
    </Modal>
  );
};

export default ModalEditarMaletas;
