import React, { useState, useRef } from "react";
import { Collapse, Form, Input, Button } from "antd";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useUserAuth } from "../../auth/UserAuthContext";

const { Panel } = Collapse;

function Inventario() {
  const { user } = useUserAuth(); // Access and use user data as needed

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (values, formId, form) => {
    try {
      const db = getFirestore();
      const id = values.IDscanner;
      const Correo = user.email;
      const documentRef = doc(collection(db, "InventarioCompleto"), id);

      // Add formId to values object
      values.Categoria = formId;
      values.Correo = user.email;

      await setDoc(documentRef, values);
      console.log("Document written with ID:", documentRef.id);

      form.current.resetFields(); // Clear the form fields
      
      // Additional logic or actions after adding the document
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const form1Ref = useRef(null);
  const form2Ref = useRef(null);
  const form3Ref = useRef(null);

  const form1Fields = [
    {
      name: "IDscanner",
      label: "IDscanner",
      rules: [{ required: true, message: "IDscanner is required" }],
    },
    {
      name: "field1",
      label: "Field 1",
      rules: [{ required: true, message: "Field 1 is required" }],
    },
    // Add more fields for form1
  ];

  const form2Fields = [
    {
      name: "field2",
      label: "Field 2",
      rules: [{ required: true, message: "Field 2 is required" }],
    },
    // Add more fields for form2
  ];

  const form3Fields = [
    {
      name: "field3",
      label: "Field 3",
      rules: [{ required: true, message: "Field 3 is required" }],
    },
    // Add more fields for form3
  ];

  const filteredFormPanels = [
    {
      id: "Categoria1",
      title: "Categoria1 1",
      fields: form1Fields,
      formRef: form1Ref,
    },
    {
      id: "Categoria2",
      title: "Categoria2 2",
      fields: form2Fields,
      formRef: form2Ref,
    },
    {
      id: "Categoria3",
      title: "Categoria3 3",
      fields: form3Fields,
      formRef: form3Ref,
    },
  ].filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "10%" }}>
      <Input
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Enter panel name"
      />

      <Collapse accordion>
        {filteredFormPanels.map((form) => (
          <Panel header={form.title} key={form.id}>
            <Form
              ref={form.formRef}
              name={form.id}
              onFinish={(values) => handleSubmit(values, form.id, form.formRef)}
            >
              {form.fields.map((field) => (
                <Form.Item
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  rules={field.rules}
                >
                  <Input />
                </Form.Item>
              ))}
              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "lightblue",
                      borderColor: "lightblue",
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}

export default Inventario;
