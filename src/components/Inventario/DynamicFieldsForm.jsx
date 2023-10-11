import React, { useState } from "react";
import { Button, Input, Form } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import Card from "antd/es/card/Card";
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

  const handleSubmits = () => {};

  const handleSubmit = async (values, formId, formRef) => {
    const defaultFields = fields.slice(0, 2); // Obtén los campos predeterminados
    const additionalFields = fields.slice(2); // Obtén los campos adicionales

    const formData = {
      ...Object.fromEntries(
        defaultFields.map((field) => [field.key, field.value])
      ),
    };

    const additionalFieldsObject = additionalFields.reduce((result, field) => {
      result[field.key] = field.value;
      return result;
    }, {});

    if (Object.keys(additionalFieldsObject).length > 0) {
      formData.Values = additionalFieldsObject; // Agrupa los campos adicionales en un objeto llamado "Values"
    }

    console.log(formData);

    const categoria = formData.Categoría;
    const subcategoria = formData.Subcategoría;
    const valores = formData.Values;
    try {
      const db = getFirestore();

      const docRef = doc(db, "Categorias2", categoria);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const nuevosValores = {
          ...docSnap.data(),
          [subcategoria]: valores,
          // Puedes agregar una marca de tiempo si lo deseas
        };
        await setDoc(docRef, nuevosValores, { merge: true });
        console.log("Valores agregados a la Subcategoría con éxito.");
      } else {
        console.log("else.");
        // docSnap.data() will be undefined in this case
        const cityRef = doc(db, "Categorias2", categoria);

        const nuevosValores = {
          [subcategoria]: valores,
        };

        await setDoc(cityRef, nuevosValores);

        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  return (
    <div style={{ height: "100vh", paddingTop: "5%" }}>
      <Card
        hoverable
        style={{
          maxWidth: 600,
          margin: "0 auto",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
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

                  <Button onClick={() => handleRemoveFields(index)}>
                    Remove
                  </Button>
                </>
              )}
            </div>
          ))}
          <Form.Item
            style={{
              paddingTop:"50px"
            }}
          >
         <div style={{ display: 'flex', gap: '10px',justifyContent: 'center' }}>

            <Button onClick={handleAddFields}>Add Field</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            </div>
           
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DynamicFieldsForm;
