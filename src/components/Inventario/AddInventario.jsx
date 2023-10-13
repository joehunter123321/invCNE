import React, { useState, useEffect } from "react";
import { Collapse, Form, Input, Button, message, Spin } from "antd";
import ScannerQrBarCode from "./ScannerQrBarCode";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
const { Panel } = Collapse;

const MyAccordion = (user) => {
  const [CategoriasFirebase, setCategoriasFirebase] = useState([]);
  const [ScannerData, setScannerData] = useState(null);
  const formInstances = {}; // Objeto para almacenar las instancias de Form
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Estado para almacenar la subcategoría actualmente seleccionada

  //set funcional
  const onFinish = async (values, subcategory, category) => {
    // console.log(`Valores del formulario para ${category}:`, category);
    try {
      const db = getFirestore();
      const id = values.IDScanner;
      const Categoria = category.id;

      const subCategoria = subcategory;
      const documentRef = doc(collection(db, `Inventario`), id);

      // Verificar si el documento existe
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        message.error("El documento con la ID especificada ya existe");
        return; // Retorna sin crear el documento
      }
      values.subCategoria = subCategoria;
      values.Categoria = Categoria;
      values.InventariadoPorUserEmail = user.user.user.email;
      values.InventariadoPorUserIDentidad = user.user.Identidad;
      values.Estado = "Stock";

      await setDoc(documentRef, values);

      formInstances[subcategory].resetFields();
      message.success(subCategoria + " Agregado Correctamente");
      // Verificar si formRef existe antes de restablecer los campos  formRef?.current?.resetFields();
    } catch (error) {
      message.error(error);
    }
  };

  //get firestore funcional useEffect
  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, "Categorias"), (snapshot) => {
      const dataCategorias = [];
  
      snapshot.forEach((doc) => {
        const data = doc.data();
        dataCategorias.push({
          id: doc.id,
          ...data,
        });
      });
  
      setCategoriasFirebase(dataCategorias);
    });
  
    return () => {
      // Se debe realizar la limpieza del listener cuando el componente se desmonte
      unsubscribe();
    };
  }, []);
  // El segundo argumento [] asegura que este efecto se ejecute solo una vez
  const handleSetIdScannerValue = (value, subcategory) => {
    // Actualizar el valor del campo IDScanner en el formulario actual
    formInstances[subcategory].setFieldsValue({
      IDScanner: value,
    });
  };

  function qrCodeSuccessCallback(childData) {
    setScannerData(childData);
    formInstances[selectedSubcategory].setFieldsValue({
      IDScanner: childData,
    });
  }
  // Función para manejar el cambio de panel
  const handlePanelChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };
console.log ("child",CategoriasFirebase)
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
      <div style={{ height: "100vh", paddingTop: "5%" }}>
        <h1>Inventario</h1>

        {CategoriasFirebase.length > 0 ? (
          <Collapse accordion style={{ margin: "5%" }}>
            {CategoriasFirebase.map((category) => (
              <Panel header={category.id} key={category.id}>
                <Collapse accordion onChange={handlePanelChange}>
                  {Object.entries(category).map(
                    ([subcategory, fields]) =>
                      subcategory !== "id" && (
                        <Panel header={subcategory} key={subcategory}>
                          <Form
                            autoComplete="off"
                            onFinish={(values) =>
                              onFinish(values, subcategory, category)
                            }
                            initialValues={fields}
                            key={subcategory}
                            ref={(form) => (formInstances[subcategory] = form)}
                          >
                            {/* Ordenamos los campos para que IDScanner sea el primero */}
                            {[
                              ["IDScanner", fields.IDScanner], // Campo IDScanner primero
                              ...Object.entries(fields).filter(
                                ([field, value]) => field !== "IDScanner"
                              ), // Otros campos después
                            ].map(([field, value]) => (
                              <Form.Item
                                label={field}
                                name={field}
                                key={field}
                                rules={[
                                  {
                                    required: true,
                                    message: "Por favor, complete este campo",
                                  },
                                ]}
                              >
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
        ) : (
          <div
            style={{
              margin: "20px",
              marginBottom: "20px",
              padding: "30px 50px",
              textAlign: "center",
              borderRadius: "4px",
            }}
          >
            <Spin tip="Cargando" size="large">
              <div className="content" />
            </Spin>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccordion;
