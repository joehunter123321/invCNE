import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";

const ModalEditarMaletas = ({
  visible,
  values,
  onClose,
  onModalVisible,
}) => {
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

  const handleOk = () => {
    setTimeout(() => {
      setModalVisible(onModalVisible);
    }, 3000);
  };

  const onFinish = (formValues) => {
    console.log(formValues);
    // Puedes manejar la acción de envío de datos aquí
    // 'formValues' contendrá los valores actualizados del formulario
  };

  return (
    <Modal
      closable={false}
      visible={modalVisible} // Cambiado de 'open' a 'visible'
      onCancel={onClose}
      destroyOnClose
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cerrar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Descargar
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