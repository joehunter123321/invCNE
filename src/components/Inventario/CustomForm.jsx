import React, { useState } from "react";
import { Form, Input, Button } from "antd";

const CustomForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [additionalFieldCount, setAdditionalFieldCount] = useState(0);

  const addFormField = () => {
    const newField = { key: "", value: "" };
    setFormFields([...formFields, newField]);
    setAdditionalFieldCount(additionalFieldCount + 1);
  };

  const removeFormField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
    setAdditionalFieldCount(additionalFieldCount - 1);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], key, value };
    setFormFields(updatedFields);
  };

  const handleSubmit = (values) => {
    console.log("Objeto enviado:", values);
  };

  const renderDefaultFields = () => {
    const defaultFields = [
      { key: "IDscanner", label: "IDscanner" },
      { key: "Categoria", label: "Categoria" },
      { key: "Subcategoria", label: "Subcategoria" },
    ];

    return defaultFields.map((field, index) => (
      <Form.Item
        key={index}
        label={field.label}
        name={field.key}
        rules={[{ required: true, message: `Please enter the ${field.key}` }]}
      >
        <Input placeholder={`Valor de ${field.key}`} />
      </Form.Item>
    ));
  };

  const renderAdditionalFields = () => {
    return Array.from({ length: additionalFieldCount }).map((_, index) => {
      const fieldIndex = index + 3;
      const field = formFields[fieldIndex];

      return (
        <div key={fieldIndex}>
          <Form.Item
            label={`Campo ${fieldIndex + 1}`}
            name={`key_${fieldIndex}`}
            rules={[{ required: true, message: `Please enter the field name` }]}
          >
            <Input placeholder="Nombre del campo" />
          </Form.Item>
          <Form.Item
            label={`Valor del Campo ${fieldIndex + 1}`}
            name={`value_${fieldIndex}`}
            rules={[
              { required: true, message: `Please enter the field value` },
            ]}
          >
            <Input placeholder="Valor del campo" />
          </Form.Item>
          <Button onClick={() => removeFormField(fieldIndex)}>
            Eliminar Campo
          </Button>
        </div>
      );
    });
  };

  return (
    <Form onFinish={handleSubmit}>
      {renderDefaultFields()}
      {renderAdditionalFields()}
      <Button onClick={addFormField}>Agregar Campo</Button>
      <Button type="primary" htmlType="submit">
        Enviar
      </Button>
    </Form>
  );
};

export default CustomForm;
