import React, { useState, useEffect } from "react";
import { Modal, Timeline, Button } from "antd";

const ModalHistorial = ({ visible, values, onClose ,onModalVisible }) => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log("ModalHistorial Inventario", visible);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleCancel = () => {
    setModalVisible(onModalVisible);
  };
  const handleOk = () => {
    setTimeout(() => {
      setModalVisible(onModalVisible);
    }, 3000);
  };
  return (
    <Modal
      destroyOnClose
      open={modalVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cerrar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Descargar
        </Button>,
      ]}
    >
      {values && values.length > 0 ? (
        <Timeline items={values} mode="alternate" />
      ) : (
        <p>No values to display.</p>
      )}
    </Modal>
  );
};

export default ModalHistorial;
