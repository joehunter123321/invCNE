import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
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

  const handleSubmit2 = (values) => {
    console.log("Objeto enviado:", values);
  };

  const renderDefaultFields = () => {
    const defaultFields = [
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

  const handleSubmit = async (values, formId, formRef) => {
    console.log("values",values);
    const categoria = "elec";
    const subcategoria = "xx";
    const valores = { 33: "name", 2224: "aa" };
    try {
      const db = getFirestore();

      const docRef = doc(db, "Categorias2", "test");
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
        const cityRef = doc(db, "Categorias2", "test");

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

  const renderAdditionalFields = () => {
    return Array.from({ length: additionalFieldCount }).map((_, index) => {
      const fieldIndex = index + 3;
      const field = formFields[fieldIndex - 1]; // Obtén el campo anterior
  
      return (
        <div key={fieldIndex}>
          <h1>test</h1>
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
            <Input
              placeholder="Valor del campo"
              name={field ? `value_${field.key}` : `value_${fieldIndex}`}
            />
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
