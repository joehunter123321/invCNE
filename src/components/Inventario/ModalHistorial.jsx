import React, { useState, useEffect } from "react";
import { Modal, Timeline, Button } from "antd";
import { StarTwoTone} from '@ant-design/icons';
const ModalHistorial = ({ visible, values, onClose, onModalVisible }) => {
  const [modalVisible, setModalVisible] = useState(false);

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
    closable={false}
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
        <p>No values .</p>
      )}
    </Modal>
  );
};

export default ModalHistorial;
