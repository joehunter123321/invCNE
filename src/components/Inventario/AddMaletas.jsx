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
const AddMaletas = () => {
  const { user } = useUserAuth(); // Access and use user data as needed

  const [form] = Form.useForm();
  const [values, setValues] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const childRef = useRef(null);

  const onFinish = async (values, formId, formRef) => {
    console.log("values.user:", user.Identidad);
    values.IDScanner = searchValue; // Set the value of IDScanner to searchValue

    console.log("values.values:", values);

    form.setFieldsValue({
      IDScanner: "",
    });
    setSearchValue("");
    if (!values.BloqueCheck) {
      form.setFieldsValue({ Bloque: "" });
    }
    if (!values.GondolaCheck) {
      form.setFieldsValue({ Gondola: "" });
    }
    if (!values.LadoCheck) {
      form.setFieldsValue({ Lado: "" });
    }
    if (!values.NivelCheck) {
      form.setFieldsValue({ Nivel: "" });
    }

    try {
      const db = getFirestore();
      const id = searchValue;

      const documentRef = doc(collection(db, `Gondolas`), id);

      // Verificar si el documento existe
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        message.error("El documento con la ID especificada ya existe");
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
      console.log("Document written with ID:", documentRef.id);
      message.success(`searchValue: ${searchValue}`);
    } catch (error) {
      console.error("Error adding document:", error);
    }
    // Add similar logic for other input fields
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Submit failed!");
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

  return (
    <div style={{ height: "100vh", paddingTop: "5%" }}>
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
          initialValues={{ remember: true }}
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
                message: "Please input your password!",
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
                      message: "Please input the Gondola !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="GondolaCheck" valuePropName="checked">
                  <Checkbox></Checkbox>
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
                      message: "Please input the Lado !",
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
                <Form.Item name="LadoCheck" valuePropName="checked">
                  <Checkbox></Checkbox>
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
                      message: "Please input the Bloque !",
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
                <Form.Item name="BloqueCheck" valuePropName="checked">
                  <Checkbox></Checkbox>
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
                      message: "Please input the Nivel !",
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
                <Form.Item name="NivelCheck" valuePropName="checked">
                  <Checkbox></Checkbox>
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
  );
};

export default AddMaletas;
