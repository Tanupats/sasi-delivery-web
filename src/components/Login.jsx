import { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import { http } from "../http";

const Login = () => {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setStaffName, setUser, setShop } = useContext(AuthData);
  const [messageError, setMessageError] = useState(false);

  const getShop = (id) => {
    http.get("/shop/shop-user/"+id).then((res) => {
      setShop({ ...res.data[0] });
      localStorage.setItem("shopId", res.data[0].shop_id);
      localStorage.setItem("page_access_token", res.data[0].facebook_token);
    });
  };


  const login = async (e) => {
    e.preventDefault();
    const body = { email: email, password: password };
    await http.post("/auth/signin", body).then((res) => {
      if (res) {
        if (res.status === 200) {
          const { name, department, token, id, shop_id } = res.data;
          localStorage.setItem("shopId", shop_id);
          localStorage.setItem("name", name);
          localStorage.setItem("role", department);
          localStorage.setItem("token", token);
          localStorage.setItem("userId", id);     
            setUser(res.data);
            getShop(id);
            setStaffName(name);
            router("/pos");
        } else {
          setMessageError(true);
        }
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router("/pos");
    }
  }, []);

  return (
    <div className="login-page">
      <Row className="login-row w-100">
        <Col lg={8} md={10} sm={12} className="mx-auto">
          <Card className="login-card">
            <Card.Body className="login-card-body p-0">
              <Row className="g-0 login-grid">
                <Col lg={5} className="login-hero">
                  <div className="login-brand">
                    <h5 className="register-badge">SASI POS</h5>
                    <h2>ยินดีต้อนรับ</h2>
                    <p>เริ่มต้นใช้งานระบบจัดการร้านค้าของคุณได้ทันที</p>

                    <ul className="login-feature-list">
                      <li>จัดการคำสั่งซื้อได้สะดวก</li>
                
                      <li>ระบบจัดส่งและ แชทบอทช่วยขาย</li>
                      <li>รายงานยอดขายแบบเข้าใจง่าย</li>
                    </ul>
                  </div>
                </Col>

                <Col lg={7} className="login-form-col">
                  <div className="login-panel">
                    <div className="login-header">
                      <h4>เข้าสู่ระบบ</h4>
                      <p>กรอกอีเมล และรหัสผ่านเพื่อเข้าระบบ</p>
                    </div>

                    <Form onSubmit={login} className="login-form">
                      <Form.Group className="mb-3">
                        <Form.Label>อีเมล</Form.Label>
                        <Form.Control
                          className="modern-input"
                          required
                          placeholder="example@email.com"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>รหัสผ่าน</Form.Label>
                        <Form.Control
                          className="modern-input"
                          required
                          placeholder="กรอกรหัสผ่าน"
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                        />
                      </Form.Group>

                      {messageError ? (
                        <div className="login-error">
                          รหัสผ่าน หรือ อีเมลไม่ถูกต้อง
                        </div>
                      ) : null}

                      <Button type="submit" className="w-100 modern-submit-btn">
                        เข้าสู่ระบบ
                      </Button>

                      <div className="login-divider">
                        <span>หรือ</span>
                      </div>

                      <Button
                        onClick={() => router("/register")}
                        type="button"
                        className="w-100 modern-secondary-btn"
                      >
                        ลงทะเบียนบัญชีใหม่
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
