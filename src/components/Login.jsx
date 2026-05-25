import React, { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import { httpPost,httpGet } from "../http";
const Login = () => {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setStaffName, setUser } = useContext(AuthData);
  const [messageError, setMessageError] = useState(false);

  const getShopId = async (shop_id) => {
    const data = await httpGet("/shop/" + shop_id).then((res) => {
      if (res.status === 200) {
        return res.data;
      }
    });
    if (data) {
        console.log(data);
      localStorage.setItem("facebook_token", data[0].facebook_token);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const body = { email: email, password: password };
    await httpPost("/auth/signin", body).then((res) => {
      if (res) {
        if (res.status === 200) {
          const { name, department, token, id, shop_id } = res.data;
          localStorage.setItem("name", name);
          localStorage.setItem("role", department);
          localStorage.setItem("token", token);
          localStorage.setItem("userId", id);
          localStorage.setItem("shopId", shop_id);
          getShopId(shop_id);
          setUser(res.data);
          setStaffName(name);
          router("/orders");
        } else {
          setMessageError(true);
        }
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router("/orders");
    }
  }, []);
  return (
    <>
      <Row className="mt-4">
        <Col md={4}></Col>
        <Col md={4}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title
                className="text-center"
                style={{ color: "#FD720D", border: "0px" }}
              >
                SASI RIDER<br />
                <br />
                Login{" "}
              </Card.Title>

              <Form onSubmit={login}>
                <Form.Group>
                  <Form.Label>username</Form.Label>
                  <Form.Control
                    required
                    placeholder="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>password</Form.Label>

                  <Form.Control
                    required
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </Form.Group>
                {messageError ? (
                  <p style={{ color: "red", marginTop: "12px" }}>
                    {" "}
                    รหัสผ่าน หรือ ชื่อผู้ใช้ไม่ถูกต้อง{" "}
                  </p>
                ) : (
                  <> </>
                )}

                <Button
                  type="submit"
                  style={{ backgroundColor: "#FD720D", border: "0px" }}
                  className="w-100 mt-4"
                >
                  เข้าสู่ระบบ
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}></Col>
      </Row>
    </>
  );
};

export default Login;
