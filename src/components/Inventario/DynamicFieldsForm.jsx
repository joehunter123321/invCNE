import React, { useState } from 'react';
import { Button, Input, Form } from 'antd';

const DynamicFieldsForm = () => {
  const [fields, setFields] = useState([
    { key: "Categoría", value: "" },
    { key: "Subcategoría", value: "" },
  ]);

  const handleAddFields = () => {
    const newFields = [...fields];
    newFields.push({ key: "", value: "" });
    setFields(newFields);
  };

  const handleRemoveFields = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleChangeKey = (index, value) => {
    const newFields = [...fields];
    newFields[index].key = value;
    setFields(newFields);
  };

  const handleInputChange = (index, e) => {
    const newFields = [...fields];
    newFields[index].value = e.target.value;
    setFields(newFields);
  };

  const handleSubmit = () => {
    const formData = {};
    fields.forEach((field) => {
      formData[field.key] = field.value;
    });
    console.log(formData);
  };

  return (
    <Form onFinish={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index}>
          {index < 2 ? (
            <Form.Item
              label={field.key}
              name={`field-${index}`}
              key={index}
              rules={[
                {
                  required: true,
                  message: `Please input ${field.key}!`,
                },
              ]}
            >
              <Input
                value={field.value}
                onChange={(e) => handleInputChange(index, e)}
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Propiedad"
                name={`key_${index}`}
                rules={[
                  {
                    required: true,
                    message: "Please enter the field name",
                  },
                ]}
              >
                <Input
                  value={field.key}
                  onChange={(e) => handleChangeKey(index, e.target.value)}
                />
              </Form.Item>
          
              <Button onClick={() => handleRemoveFields(index)}>Remove</Button>
            </>
          )}
        </div>
      ))}
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button onClick={handleAddFields}>Add Field</Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicFieldsForm;