import React, { useState } from 'react';
import { Button, Input } from 'antd';

const DynamicFieldsForm = () => {
  const [fields, setFields] = useState([]);

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
    <div>
      {fields.map((field, index) => (
        <div key={index}>
          <Input
            value={field.key}
            onChange={(e) => handleChangeKey(index, e.target.value)}
            style={{ marginRight: 8 }}
          />
          <Input
            value={field.value}
            onChange={(e) => handleInputChange(index, e)}
            style={{ marginRight: 8 }}
          />
          {index > 0 && (
            <Button onClick={() => handleRemoveFields(index)}>Remove</Button>
          )}
        </div>
      ))}
      <Button onClick={handleAddFields}>Add Field</Button>
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default DynamicFieldsForm;