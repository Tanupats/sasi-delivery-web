import { useContext, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { httpPut } from "../http";
import { AuthData } from "../ContextData";
import Swal from "sweetalert2";
import moment from "moment";

const Profile = () => {
  const { user, setUser, shop, getUser, setShop } = useContext(AuthData);
  const [status, setStatus] = useState(shop?.is_open);

  const updateData = async () => {
    await httpPut("/shop/" + shop?.id, { ...shop, is_open: status }).then(
      (res) => {
        if (res) {
          getUser();
          Swal.fire({
            title: "แก้ไขข้อมูลสำเร็จ",
            icon: "success",
            confirmButtonText: "ยืนยัน",
          });
        }
      },
    );
  };

  return (
    <Row className="mt-4 justify-content-center">
      <Col md={7}>
        <Card className="p-4 shadow-sm">
          <Card.Title className="text-center mb-4">
            บัญชีผู้ใช้งานร้านค้า
          </Card.Title>

          {/* ---------------- บัญชีผู้ใช้ ---------------- */}
          <h6 className="mb-3">บัญชีผู้ใช้งาน</h6>

          <div className="mb-3">
            <label>ชื่อ-นามสกุล</label>
            <input className="form-control" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          </div>

          <div className="mb-3">
            <label>อีเมล</label>
            <input
            disabled
              readOnly
              type="email"
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value }) }
            />
          </div>

          <div className="mb-4">
            <label>เบอร์โทร</label>
            <input
              type="text"
              className="form-control"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

        

          {/* ---------------- ข้อมูลร้านค้า ---------------- */}
          <h6 className="mb-3">ข้อมูลร้านค้า</h6>

          <Row className="mb-3">
            <Col md={6}>
              <label>ร้านค้า</label>
              <input
                className="form-control"
                value={shop.name}
                onChange={(e) => setShop({ ...shop, name: e.target.value })}
              />
            </Col>

            <Col md={6}>
              <label>ประเภทร้านค้า</label>
              <input className="form-control" value={shop.shop_type} disabled />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <label>วันที่ลงทะเบียน</label>
              <input
                className="form-control"
                value={moment(shop.created).format("DD/MM/YYYY")}
                disabled
              />
            </Col>

            <Col md={6}>
              <label>page access token</label>
              <input
                type="password"
                className="form-control"
                value={shop.facebook_token}
                onChange={(e) =>
                  setShop({
                    ...shop,
                    facebook_token: e.target.value,
                  })
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <label>เวลาเปิด - ปิดร้าน</label>

              <input
                type="text"
                className="form-control"
                value={shop.open_time}
                onChange={(e) =>
                  setShop({
                    ...shop,
                    open_time: e.target.value,
                  })
                }
              />
            </Col>
            <Col md={6}>
              <label>สถานะร้าน</label>
              <Button
                className="w-100"
                variant={status ? "outline-success" : "outline-danger"}
                onClick={() => setStatus(!status)}
              >
                {status ? "ร้านเปิด" : "ร้านปิด"}
              </Button>
            </Col>

            <Col md={12}>
              <Button
                className="w-100 mt-4"
                style={{ background: "#ff7a00", border: "none" }}
                onClick={updateData}
              >
                แก้ไขข้อมูล
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
