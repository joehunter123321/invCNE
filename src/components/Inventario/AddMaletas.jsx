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
const AddMaletas = ({  loading, userTipo }) => {
 
  console.log("loading:", loading);
  console.log("userTipo:", userTipo);
  const { user } = useUserAuth(); // Access and use user data as needed
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [valuesChecks, setValues] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const childRef = useRef(null);
  const [Checks, setChecks] = useState({});
  const [DataAlert, setDataAlert] = useState(null);

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

  console.log("loadingAddMaletas:", loading);

  return (
    <div style={{ height: "100vh", paddingTop: "5%" }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          {contextHolder}
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
                label="IDScanner"
                name="IDScanner"
                rules={[
                  {
                    required: true,
                    message: "Por favor Completar IDScanner!",
                  },
                ]}
              >
                <Row gutter={2}>
                  <Col span={12}>
                    <Input value={searchValue} onChange={handleSearchChange} />
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
                      <Input />
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

              <Form.Item label="Lado">
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      name="Lado"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Por favor Completar Lado !",
                        },
                      ]}
                    >
                      <Select>
                        <Option value={"A"}>A</Option>
                        <Option value={"B"}>B</Option>
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
                        <Option value={1}>1</Option>
                        <Option value={2}>2</Option>
                        <Option value={3}>3</Option>
                        <Option value={4}>4</Option>
                        <Option value={5}>5</Option>
                        <Option value={6}>6</Option>
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
                        <Option value={1}>1</Option>
                        <Option value={2}>2</Option>
                        <Option value={3}>3</Option>
                        <Option value={4}>4</Option>
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
                  Submit
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
