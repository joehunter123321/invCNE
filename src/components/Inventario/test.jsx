import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";

const MostrarInventario = () => {
  const [formData, setFormData] = useState({});

  const fields = [
    { name: "telefono", required: false },
    { name: "edad", required: true },
  ];

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="IDENTIDAD"
        rules={[{ required: true, message: "IDENTIDAD is required" }]}
      >
        <Input
          value={formData["IDENTIDAD"] || ""}
          onChange={(e) => handleInputChange("IDENTIDAD", e.target.value)}
        />
      </Form.Item>
      {fields.map((field, index) => (
        <Form.Item
          key={index}
          label={field.name}
          rules={[
            { required: field.required, message: `${field.name} is required` },
          ]}
        >
          <Input
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MostrarInventario;
