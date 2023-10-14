import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Card,
  Select,
  message,
  notification,
  Spin,
  TreeSelect,
  Menu,
} from "antd";
import ScannerQrBarCode from "./ScannerQrBarCode";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
const { Option } = Select;

import { useUserAuth } from "../../auth/UserAuthContext";
import CustomForm from "./CustomForm";
const AddMaletas = ({ loading, userTipo, ConfiguracionData }) => {
  const { SubMenu } = Menu;
  const { user } = useUserAuth(); // Access and use user data as needed
  const [currentLugar, setcurrentLugar] = useState(null);
  const [DataConfigLugar, setDataConfigLugar] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [valuesChecks, setValues] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const childRef = useRef(null);
  const [Checks, setChecks] = useState({});
  const [DataAlert, setDataAlert] = useState(null);
  const [gondolasOptions, setGondolasOptions] = useState(ConfiguracionData);
  // Verificar si ya hay un valor en localStorage, de lo contrario, establecer el valor predeterminado "Campo"
  const [tipoFormulario, setTipoFormulario] = useState(
    localStorage.getItem("TipoFormulario") || "Configuracion"
  );
  const [selectedData, setSelectedData] = useState(null);
  const [localTipoFormulario, setLocalTipoFormulario] =
    useState(tipoFormulario);
  // Verificar si ya hay un valor en localStorage, de lo contrario, establecer el valor predeterminado "Campo"
  const tipoFormularioEnLocalStorage = localStorage.getItem("TipoFormulario");
  if (tipoFormularioEnLocalStorage === null) {
    localStorage.setItem("TipoFormulario", "Configuracion");
  }
  const { LoadTipoFormulario } = useUserAuth();

  const onFinish = async (values, formId, formRef) => {
    setValues(values);

    values.IDScanner = searchValue; // Set the value of IDScanner to searchValue

    try {
      const db = getFirestore();
      const id = searchValue;

      const documentRef = doc(collection(db, `Gondolas`), id);

      // Verificar si el documento existe
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const DataAlert = documentSnapshot.data();

        const openNotification = (placement) => {
          api.error({
            duration: null,
            message: `Ya Esta registrada la maleta  ${DataAlert.IDScanner}`,
            description: (
              <div>
                <ul>
                  <li> en la gondola {DataAlert.Gondola}</li>
                  <li>Torre {DataAlert.Lado}</li>
                  <li> Bloque {DataAlert.Bloque}</li>
                  <li>Nivel {DataAlert.Nivel}</li>
                  <li>por {DataAlert.InventariadoPorUserEmail}</li>
                </ul>
              </div>
            ),
            placement,
          });
        };
        openNotification("top");

        return; // Retorna sin crear el documento
      }

      // Remove unwanted values
      delete values.LadoCheck;
      delete values.BloqueCheck;
      delete values.GondolaCheck;
      delete values.NivelCheck;

      // add  values
      values.InventariadoPorUserEmail = user.user.email;
      values.InventariadoPorUserIDentidad = user.Identidad;
      values.Lugar = tipoFormulario;

      await setDoc(documentRef, values);

      message.success(`Guardado Correctamente`);

      form.setFieldsValue({
        IDScanner: "",
      });

      setSearchValue("");
      if (!Checks.BloqueCheck) {
        form.setFieldsValue({ Bloque: "" });
      }
      if (!Checks.GondolaCheck) {
        form.setFieldsValue({ Gondola: "" });
      }
      if (!Checks.LadoCheck) {
        form.setFieldsValue({ Lado: "" });
      }
      if (!Checks.NivelCheck) {
        form.setFieldsValue({ Nivel: "" });
      }
    } catch (error) {
      console.error("Error adding document:", error);
    }
    // Add similar logic for other input fields
  };

  console.log("setDataConfigLugar:", DataConfigLugar);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("No se Guardo!");
  };

  function qrCodeSuccessCallback(childData) {
    form.setFieldsValue({
      IDScanner: childData,
    });
    setSearchValue(childData);
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const onChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prevSelectedValues) => ({
      ...prevSelectedValues,
      [name]: checked,
    }));
  };



  const onClickLugar = async (e) => {
    try {
      console.log("Click Lugar", e.key)
      const db = getFirestore();
      const docRef = doc(db, "ConfigLugar", e.key);
      const docSnap = await getDoc(docRef);
      console.log("222222222,", e.key)
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setDataConfigLugar(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };




  const itemsLugar = [
    {
      label: "CAMPO",
      key: "Campo",

      //disabled: true,
    },
    {
      label: "CLE",
      key: "SubMenu",

      children: [
        {
          type: "group",
          label: "NAVE",
          children: [
            {
              label: "Nave 1",
              key: "Nave1",
            },
            {
              label: "Nave 2",
              key: "Nave2",
            },
          ],
        },
      ],
    },
  ];

 

  return (
    <div style={{ height: "100vh", paddingTop: "1%" }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          {contextHolder}
          <div style={{ paddingBottom: "2%" }}></div>
          <Menu
          
            onClick={onClickLugar}
            selectedKeys={[currentLugar]}
            mode="horizontal"
            items={itemsLugar}
          />
          
          <Card
            hoverable
            title="Formulario Maletas"
            style={{
              maxWidth: 600,
              margin: "0 auto",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div>
              <ScannerQrBarCode
                fps={10}
                qrbox={250}
                disableFlip={false}
                ref={childRef}
                handleCallback={qrCodeSuccessCallback}
              />
            </div>
            <Form
              form={form}
              disabled={DataConfigLugar && DataConfigLugar.Activo ? (
                DataConfigLugar.Activo
                
              ) : (
                null
              )
            }
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              //initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="JRV"
                name="IDScanner"
                rules={[
                  {
                    required: true,
                    message: "Por favor completar JRV",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 99999,
                    transform: (value) => parseFloat(value),
                    message: "Ingrese un número válido con al menos 5 cifras",
                  },
                  {
                    max: 5, // Máximo número de caracteres permitidos
                    message: "El campo no puede tener más de 5 caracteres",
                  },
                ]}
              >
                <Row gutter={2}>
                  <Col span={12}>
                    <Input
                      value={searchValue}
                      onChange={handleSearchChange}
                      onPressEnter={(e) => {
                        console.log(e.key);
                        if (e.key === "Enter") {
                          const form = e.target.form;
                          const index = [...form].indexOf(e.target);
                          console.log(index);
                          form[index + 1].focus();
                          e.preventDefault();
                        }
                      }}
                    />
                  </Col>
                  <Col span={12}></Col>
                </Row>
              </Form.Item>

              <Form.Item label="Gondola">
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      name="Gondola"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Por favor Completar Gondola !",
                        },
                      ]}
                    >
                      <Select>
                        {DataConfigLugar && DataConfigLugar.Gondola ? (
                          Object.keys(DataConfigLugar.Gondola).map((opcion) => (
                            <Option key={opcion} value={opcion}>
                              {DataConfigLugar.Gondola[opcion]}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            Configuración no disponible
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{
                        paddingLeft: "20px",
                      }}
                      name="GondolaCheck"
                      valuePropName="checked"
                    >
                      <Checkbox name="GondolaCheck" onChange={onChange}>
                        Recordar
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Torre">
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      name="Lado"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Por favor Completar Torre !",
                        },
                      ]}
                    >
                      <Select>
                        {DataConfigLugar && DataConfigLugar.Torre ? (
                          Object.keys(DataConfigLugar.Torre).map((opcion) => (
                            <Option key={opcion} value={opcion}>
                              {DataConfigLugar.Torre[opcion]}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            Configuración no disponible
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{
                        paddingLeft: "20px",
                      }}
                      name="LadoCheck"
                      valuePropName="checked"
                    >
                      <Checkbox name="LadoCheck" onChange={onChange}>
                        Recordar
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Bloque">
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      name="Bloque"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Por favor Completar Bloque !",
                        },
                      ]}
                    >
                      <Select>
                        {DataConfigLugar && DataConfigLugar.Bloque ? (
                          Object.keys(DataConfigLugar.Bloque).map((opcion) => (
                            <Option key={opcion} value={opcion}>
                              {DataConfigLugar.Bloque[opcion]}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            Configuración no disponible
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{
                        paddingLeft: "20px",
                      }}
                      name="BloqueCheck"
                      valuePropName="checked"
                    >
                      <Checkbox name="BloqueCheck" onChange={onChange}>
                        Recordar
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Nivel">
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      name="Nivel"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Por favor Completar Nivel !",
                        },
                      ]}
                    >
                      <Select>
                        {DataConfigLugar && DataConfigLugar.Nivel ? (
                          Object.keys(DataConfigLugar.Nivel).map((opcion) => (
                            <Option key={opcion} value={opcion}>
                              {DataConfigLugar.Nivel[opcion]}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            Configuración no disponible
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{
                        paddingLeft: "20px",
                      }}
                      name="NivelCheck"
                      valuePropName="checked"
                    >
                      <Checkbox name="NivelCheck" onChange={onChange}>
                        Recordar
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddMaletas;
