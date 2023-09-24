import React, { useState, useRef } from "react";
import { Collapse, Form, Input, Button } from "antd";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useUserAuth } from "../../auth/UserAuthContext";
import BarcodeScanner from "../Login/BarcodeScanner";

const { Panel } = Collapse;

function Inventario(user) {
 
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (values, formId, formRef) => {
    console.log("Inventario", user.user.user.email);
    try {
      const db = getFirestore();
      const id = values.IDscanner;

      const documentRef = doc(collection(db, "InventarioCompleto"), id);
      values.Categoria = formId;
      values.InventariadoPorUserEmail = user.user.user.email;
      values.InventariadoPorUserIDentidad = user.user.Identidad;
      values.Estado = "Stock";
      await setDoc(documentRef, values);
      console.log("Document written with ID:", documentRef.id);
      formRef?.current?.resetFields(); // Check if formRef exists before resetting fields
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const form1Ref = useRef(null);
  const form2Ref = useRef(null);
  const form3Ref = useRef(null);
  const form4Ref = useRef(null);
  const form5Ref = useRef(null);
  const form6Ref = useRef(null);

  const form1Fields = [
    {
      name: "IDscanner",
      label: "ID",
      rules: [{ required: true, message: "IDscanner is required" }],
    },
    {
      name: "Procesador",
      label: "Procesador",
      rules: [{ required: true, message: "Field 1 is required" }],
    },
    {
      name: "Pantalla",
      label: "Pantalla",
      rules: [{ required: true, message: "Field 1 is required" }],
    },
    {
      name: "TipoAlmacenamiento",
      label: "Tipo Almacenamiento",
      rules: [{ required: true, message: "Field 1 is required" }],
    },
    {
      name: "CapacidadAlmacenamiento",
      label: "Capacidad Almacenamiento",
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

  const form4Fields = [
    {
      name: "field4",
      label: "Field 4",
      rules: [{ required: true, message: "Field 3 is required" }],
    },
    // Add more fields for form3
  ];

  const filteredFormPanels = [
    {
      id: "Electronica",
      title: "Electronica",
      formPanels: [
        {
          id: "Computadoras",
          title: "Computadoras",
          fields: form1Fields,
          formRef: form1Ref,
        },
        {
          id: "TV",
          title: "TV",
          fields: form2Fields,
          formRef: form2Ref,
        },
      ],
    },
    {
      id: "Categoria2",
      title: "Categoria2 2",
      formPanels: [
        {
          id: "Panel3",
          title: "Panel 3",
          fields: form3Fields,
          formRef: form3Ref,
        },
        {
          id: "Panel4",
          title: "Panel 4",
          fields: form4Fields,
          formRef: form4Ref,
        },
      ],
    },
  ].filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "10%" }}>
      <BarcodeScanner/>
      <Input
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Enter panel name"
      />

      <Collapse accordion>
        {filteredFormPanels.map((form) => (
          <Panel header={form.title} key={form.id}>
            <Collapse accordion>
              {form.formPanels.map((formPanel) => (
                <Panel header={formPanel.title} key={formPanel.id}>
                  <Form
                    ref={formPanel.formRef}
                    name={formPanel.id}
                    onFinish={(values) =>
                      handleSubmit(values, form.id, formPanel.formRef)
                    }
                  >
                    {formPanel.fields.map((field) => (
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
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}

export default Inventario;
