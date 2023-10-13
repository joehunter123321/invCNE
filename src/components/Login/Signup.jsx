import React, { useState } from "react";
import { Form, Alert, Input, Button, Select, Card } from "antd";
import { useUserAuth } from "../../auth/UserAuthContext";
import { collection, setDoc, doc, getFirestore } from "firebase/firestore";

const Signup = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useUserAuth();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setError("");
    try {
      const { email, password } = values;
      const userCredential = await signUp(email, password);
      const user = userCredential.user;
      console.log(JSON.stringify(user.uid, null, 2));
      console.log(user.uid);
      const uid = user.uid;

      const db = getFirestore();
      const usuariosCollection = collection(db, "Usuario");
      const usuarioDocRef = doc(usuariosCollection, user.uid);

      await setDoc(usuarioDocRef, {
        Correo: values.email,
        Identidad: values.Identidad,
        Nombre: values.Nombre,
        Tipo: values.Tipo,
        uid: user.uid,
      });

      form.resetFields();
      setSuccess(true);
    } catch (err) {
      
      setError(err.message);
    }
  };

  return (
    <Card
      hoverable
      style={{
        margin: "0 auto",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        width: 300,
        marginTop: 40,
      }}
    >
      <Form form={form} name="signup" onFinish={onFinish} layout="vertical">
        <h2 style={{ textAlign: "center" }}>Registro</h2>
        {error && <Alert message={error} type="error" showIcon />}
        {success && (
          <Alert message="Registro exitoso" type="success" showIcon />
        )}

        <Form.Item
          label="Email address"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email address!",
            },
          ]}
        >
          <Input type="email" placeholder="Email address" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          label="Identidad"
          name="Identidad"
          rules={[
            {
              required: true,
              message: "Please input your identidad!",
            },
          ]}
        >
          <Input placeholder="Identidad" />
        </Form.Item>

        <Form.Item
          label="Nombre"
          name="Nombre"
          rules={[
            {
              required: true,
              message: "Please input your nombre!",
            },
          ]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="Tipo"
          rules={[
            {
              required: true,
              message: "Please select a Tipo!",
            },
          ]}
        >
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Escritura">Escritura</Select.Option>
            <Select.Option value="Lectura">Escritura y Lectura</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Signup;