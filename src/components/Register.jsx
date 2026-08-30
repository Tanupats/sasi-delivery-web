import { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { http } from "../http";
import Swal from "sweetalert2";
const Register = () => {
  //user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("trial");
  let userId = "";
  const router = useNavigate();

  //shop
  const [shopName, setshopName] = useState("");
  const [file, setFile] = useState("");
  const [phone, setPhone] = useState("");

  const packagePlans = [
    {
      value: "trial",
      name: "ทดลองใช้ฟรี 7 วัน",
      price: "ฟรี",
      tagClass: "tag-trial",
      description: "ทดลองใช้งานฟีเจอร์เต็มรูปแบบ ฟรี 7 วัน",
    },
    {
      value: "pro",
      name: "แพ็กเกจ Pro",
      price: "600฿",
      tagClass: "tag-pro",
      description: "ใช้งานต่อเนื่อง 1 เดือน",
    },
    {
      value: "premium",
      name: "แพ็กเกจ Premium",
      price: "5900฿",
      tagClass: "tag-premium",
      description: "ใช้งานยาว 1 ปี คุ้มค่าที่สุด",
    },
  ];

  let filename = "";
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await http.post(`/upload`, formData).then((res) => {
      if (res.status === 200) {
        filename = res.data.filename;
      }
    });
  };

  const createUser = async () => {
    const bodyUser = {
      name: name,
      email: email,
      password: password,
      department: "admin",
      phone: phone,
    };
    await http.post("/auth/sigup", bodyUser).then((res) => {
      if (res) {
        if (res.status === 200) {
          userId = res.data.id;
        }
      }
    });
  };

  const createShop = async () => {
    if (filename !== "") {
      await uploadFile();
    }

    const date_start = new Date();
    let date_end = new Date();

    if (selectedPackage === "trial") {
      date_end.setDate(date_end.getDate() + 7);
    } else if (selectedPackage === "pro") {
      date_end.setMonth(date_end.getMonth() + 1);
    } else if (selectedPackage === "premium") {
      date_end.setFullYear(date_end.getFullYear() + 1); // ✅ เพิ่มตรงนี้
    }

    const bodyShop = {
      name: shopName,
      user_id: String(userId),
      photo: filename,
      package_name: selectedPackage,
      date_start: date_start.toISOString(),
      end_date: date_end.toISOString(),
      payment: selectedPackage === "trial" ? "free" : "unpaid",
    };

    await http.post("/shop", bodyShop).then((res) => {
      if (res && res.status === 200) {
        Swal.fire({
          title: "ลงทะเบียนสำเร็จ!",
          text: "คุณได้ลงทะเบียนร้านค้าสำเร็จแล้ว",
        });

        router("/");
      }
    });
  };

  const saveRegister = async (e) => {
    e.preventDefault();
    await createUser();
    await createShop();
  };

  return (
    <div className="register-page">
      <Row className="register-row w-100">
        <Col lg={7} md={9} sm={12} className="mx-auto">
          <Card className="register-card">
            <Card.Body className="register-card-body">
              <div className="register-header">
                <span className="register-badge">SASI POS</span>
                <h4>สร้างบัญชีร้านค้า</h4>
                <p>เริ่มต้นใช้งานระบบจัดการร้านค้าของคุณได้ทันที</p>
              </div>

              <Form onSubmit={saveRegister} className="register-form">
                <div className="register-section">
                  <div className="section-title">ข้อมูลผู้ใช้</div>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>ชื่อ-นามสกุล</Form.Label>
                        <Form.Control
                          className="modern-input"
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          required
                          placeholder="ชื่อ-นามสกุล"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>อีเมล</Form.Label>
                        <Form.Control
                          className="modern-input"
                          type="email"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>รหัสผ่าน</Form.Label>
                        <Form.Control
                          className="modern-input"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="รหัสผ่าน"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>เบอร์โทร</Form.Label>
                        <Form.Control
                          className="modern-input"
                          required
                          onChange={(e) => setPhone(e.target.value)}
                          type="text"
                          placeholder="08xxxxxxxx"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="register-section">
                  <div className="section-title">ข้อมูลร้านค้า</div>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>ชื่อร้านค้า</Form.Label>
                        <Form.Control
                          className="modern-input"
                          required
                          onChange={(e) => setshopName(e.target.value)}
                          type="text"
                          placeholder="ตั้งชื่อร้านค้าของคุณ"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>รูปภาพร้าน</Form.Label>
                        <Form.Control
                          className="modern-input file-input"
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="register-section">
                  <div className="section-title">เลือกแพ็กเกจ</div>
                  <div className="package-list">
                    {packagePlans.map((plan) => (
                      <button
                        key={plan.value}
                        type="button"
                        className={`package-card ${selectedPackage === plan.value ? "selected" : ""}`}
                        onClick={() => setSelectedPackage(plan.value)}
                        aria-pressed={selectedPackage === plan.value}
                      >
                        <div className="package-card-content">
                          <div className="package-header-row">
                            <strong>{plan.name}</strong>
                            <span className={`package-tag ${plan.tagClass}`}>{plan.price}</span>
                          </div>
                          <small>{plan.description}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Row className="mt-4 action-row">
                  <Col md={6} xs={12} className="mb-2 mb-md-0">
                    <Button className="w-100 register-submit-btn" type="submit">
                      ลงทะเบียน
                    </Button>
                  </Col>
                  <Col md={6} xs={12}>
                    <Button
                      onClick={() => router("/")}
                      className="w-100 register-cancel-btn"
                      type="button"
                    >
                      ยกเลิก
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
