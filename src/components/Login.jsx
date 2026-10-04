import React, { useState, useContext, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import { httpPost,httpGet } from "../http";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
const Login = () => {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setStaffName, setUser } = useContext(AuthData);
  const [messageError, setMessageError] = useState("");

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
          if (department?.trim().toLowerCase() !== "rider") {
            setMessageError("บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานสำหรับ Rider เท่านั้น");
            return;
          }

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
          setMessageError("รหัสผ่าน หรือ ชื่อผู้ใช้ไม่ถูกต้อง");
        }
      }
    });
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (localStorage.getItem("token") && role?.trim().toLowerCase() === "rider") {
      router("/orders");
    } else if (localStorage.getItem("token")) {
      ["token", "role", "name", "userId", "shopId"].forEach((key) =>
        localStorage.removeItem(key),
      );
    }
  }, []);
  return (
    <main className="login-page">
      <section className="login-story" aria-label="Sasi Rider">
        <div className="login-story-pattern" aria-hidden="true" />
        <div className="login-brand">
          <span className="login-brand-mark"><DeliveryDiningIcon /></span>
          <span>SASI<span>RIDER</span></span>
        </div>
        <div className="login-story-copy">
          <p className="login-kicker">DELIVERY, MADE SIMPLE</p>
          <h1>ทุกเส้นทาง<br />เริ่มต้นที่นี่</h1>
          <p className="login-story-caption">พร้อมออกไปส่งมอบประสบการณ์ที่ดี<br className="desktop-break" /> ให้ถึงมือลูกค้า</p>
        </div>
        <div className="login-route-art" aria-hidden="true">
          <span className="route-point route-point-start" />
          <span className="route-line" />
          <span className="route-point route-point-end"><DeliveryDiningIcon /></span>
          <span className="route-label">ON THE WAY</span>
        </div>
        <p className="login-story-footer">SASI DELIVERY <span>•</span> RIDER DRIVER</p>
      </section>

      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="login-brand-mark"><DeliveryDiningIcon /></span>
            <span>SASI<span>RIDER</span></span>
          </div>
          <p className="login-form-eyebrow">RIDER DRIVER</p>
          <h2>ยินดีต้อนรับ</h2>
          <p className="login-form-intro">เข้าสู่ระบบเพื่อจัดการออเดอร์จัดส่งของร้านคุณ</p>

          <Form onSubmit={login} className="login-form">
            <Form.Group className="login-field">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control
                required
                autoComplete="username"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="login-field">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                required
                autoComplete="current-password"
                placeholder="กรอกรหัสผ่าน"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </Form.Group>
            {messageError && (
              <p className="login-error" role="alert">{messageError}</p>
            )}
            <button type="submit" className="login-submit">
              เข้าสู่ระบบ <span aria-hidden="true">→</span>
            </button>
          </Form>
        
        </div>
      </section>
    </main>
  );
};

export default Login;
