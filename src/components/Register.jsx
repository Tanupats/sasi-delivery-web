import { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { httpPost } from "../http";
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

  let filename = "";
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await httpPost(`/upload`, formData).then((res) => {
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
    };
    await httpPost("/auth/sigup", bodyUser).then((res) => {
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
    await httpPost("/shop", bodyShop).then((res) => {
      if (res) {
        if (res.status === 200) {
          Swal.fire({
            title: "ลงทะเบียนสำเร็จ!",
            text: "คุณได้ลงทะเบียนร้านค้าสำเร็จแล้ว",
          });

          router("/");
        }
      }
    });
  };

  const saveRegister = async (e) => {
    e.preventDefault();
    await createUser();
    await createShop();
  };

  return (
    <Row className="mt-4">
      <Col md={3}></Col>
      <Col md={6}>
        <Card>
          <Card.Title className="text-center mt-4  title-heading">
            ลงทะเบียนผู้ใช้
          </Card.Title>
          <Card.Body>
            <Form onSubmit={saveRegister}>
              <Form.Group>
                <Form.Label> ชื่อ-นามสกุล</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  placeholder="ชื่อ-นามสกุล"
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="password"
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>ชื่อร้านค้า</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setshopName(e.target.value)}
                  type="text"
                  placeholder="ตั้งชื่อร้านค้าของคุณ"
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>รูปภาพ</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="โลโก้"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Form.Group>

              <Form.Group className="mt-4">
                <Form.Label className="fw-bold">เลือกแพ็กเกจ</Form.Label>
                <div className="d-flex flex-column gap-2 mt-2">
                  <Form.Check
                    type="radio"
                    name="package"
                    id="package-trial"
                    label={
                      <span>
                        <strong>ทดลองใช้ฟรี 7 วัน</strong>
                        <br />
                        <small className="text-muted">
                          ทดลองใช้งานฟีเจอร์เต็มรูปแบบ ฟรี 7 วัน
                        </small>
                      </span>
                    }
                    value="trial"
                    checked={selectedPackage === "trial"}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                  />

                  <Form.Check
                    type="radio"
                    name="package"
                    id="package-pro"
                    label={
                      <span>
                        <strong>แพ็กเกจ Pro</strong>
                        <br />
                        <small className="text-muted">600฿ /เดือน </small>
                      </span>
                    }
                    value="pro"
                    checked={selectedPackage === "pro"}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Row className="mt-4">
                <Col md={6} xs={6}>
                  <Button className="w-100" type="submit" variant="primary">
                    ลงทะเบียน
                  </Button>
                </Col>
                <Col md={6} xs={6}>
                  <Button
                    onClick={() => router("/")}
                    className="w-100"
                    variant="danger"
                  >
                    ยกเลิก
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}></Col>
    </Row>
  );
};

export default Register;
