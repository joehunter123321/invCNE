import { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga del formulario
  const auth = getAuth();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log("User logged in:", user);
      setLoading(false);
      navigate("/Inventario"); // Redirigir al usuario a /Pedidos después de iniciar sesión
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        paddingTop: "2%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Form labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }} onFinish={onFinish}>
        <Form.Item
          label="Correo"
          name="email"
          rules={[
            {
              required: true,
              message: "Por favor, ingrese su correo electrónico",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor, ingresa tu contraseña",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{
        offset: 8,
        span: 16,
      }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "lightblue",
              borderColor: "lightblue",
            }}
          >
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
