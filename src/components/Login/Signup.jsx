import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Input, Button, Select, Card } from "antd";
import { useUserAuth } from "../../auth/UserAuthContext";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    setError("");
    try {
      const { email, password } = values;

      const user = await signUp(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(JSON.stringify(user.uid, null, 2));
          console.log(user.uid);
          const uid = user.uid;

          const db = getFirestore();
          const usuariosCollection = collection(db, "Usuario");
          const usuarioDocRef = doc(usuariosCollection, user.uid);

          setDoc(usuarioDocRef, {
            Correo: values.email,
            Identidad: values.Identidad,
            Nombre: values.Nombre,
            Tipo: values.Tipo,
            uid: user.uid,
          });
          // ...
        })
        .catch((error) => {
          console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    } catch (err) {
      setError(err.message);
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
        <div className="p-4 box">
          <h2 className="mb-3">Registro</h2>
          {error && <Alert message={error} type="error" showIcon />}
          <Form name="signup" onFinish={onFinish}>
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
              <Input
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
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
              <Input.Password
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
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
              <div className="d-grid gap-2">
                <Button type="primary" htmlType="submit">
                  Registrar
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
