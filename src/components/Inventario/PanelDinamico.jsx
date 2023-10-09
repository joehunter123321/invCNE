import React, { useState } from "react";
import { Collapse, Form, Input, Button, message } from "antd";
import ScannerQrBarCode from "./ScannerQrBarCode";

const { Panel } = Collapse;

const data = [
  {
    id: "Electtronica",
    PC: {
      Ram: "",
      IDScanner: "",
      Procesador: "",
      Disco: "",
    },
    TV: {
      Color: "",
      IDScanner: "",
    },
  },
  {
    id: "Moviliario",
    Sillas: {
      Color: "",
      IDScanner: "",
    },
    Mesas: {
      IDScanner: "",
      Color: "",
    },
  },
];

const MyAccordion = () => {
  const [formData, setFormData] = useState(data);
  const [ScannerData, setScannerData] = useState(null);
  const formInstances = {}; // Objeto para almacenar las instancias de Form
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Estado para almacenar la subcategoría actualmente seleccionada
  const onFinish = (values, subcategory) => {
    console.log(`Valores del formulario para ${subcategory}:`, values);
  };

  const handleSetIdScannerValue = (value, subcategory) => {
    // Actualizar el valor del campo IDScanner en el formulario actual
    formInstances[subcategory].setFieldsValue({
      IDScanner: value,
    });
  };

  function qrCodeSuccessCallback(childData) {
    message.info(selectedSubcategory);
    message.info(childData);
    setScannerData(childData);
    formInstances[selectedSubcategory].setFieldsValue({
      IDScanner: childData,
    });
  }
  // Función para manejar el cambio de panel
  const handlePanelChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  return (
    <div>
      <div>
        <ScannerQrBarCode
          fps={10}
          qrbox={250}
          disableFlip={false}
          handleCallback={(childData) =>
            qrCodeSuccessCallback(childData, selectedSubcategory)
          }
        />
      </div>
      <Collapse accordion>
        {data.map((category) => (
          <Panel header={category.id} key={category.id}>
            <Collapse accordion onChange={handlePanelChange}>
              {Object.entries(category).map(
                ([subcategory, fields]) =>
                  subcategory !== "id" && (
                    <Panel header={subcategory} key={subcategory}>
                      <Form
                        onFinish={(values) => onFinish(values, subcategory)}
                        initialValues={fields}
                        key={subcategory}
                        ref={(form) => (formInstances[subcategory] = form)}
                      >
                        {Object.entries(fields).map(([field, value]) => (
                          <Form.Item label={field} name={field} key={field}>
                            <Input />
                          </Form.Item>
                        ))}

                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Enviar
                          </Button>
                        </Form.Item>
                      </Form>
                    </Panel>
                  )
              )}
            </Collapse>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default MyAccordion;
