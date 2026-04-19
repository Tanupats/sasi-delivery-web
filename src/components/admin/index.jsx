import { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import "./index.scss";
import LinkIcon from "@mui/icons-material/Link";
import Products from "./products";
import ReportProduct from "./ReportProduct";
import MenuType from "./MenuType";
import User from "./user";
import MessageIcon from "@mui/icons-material/Message";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import PollIcon from "@mui/icons-material/Poll";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { httpGet } from "../../http";
import { AuthData } from "../../ContextData";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SendIcon from "@mui/icons-material/Send";
const Admin = () => {
  const [openMenu, setOpenMenu] = useState("เมนูอาหาร");

  const [inComeNow, setIncomeNow] = useState(0);
  const [totalOrder, setTotalOrder] = useState(85);

  const token = localStorage.getItem("token");
  const { shop } = useContext(AuthData);
  const randomKeywords = ["สวัสดี", "ขอบคุณ"];
  const geIncomeNow = async () => {
    if (shop) {
      const res = await httpGet(`/bills/reportByMounth/${shop?.shop_id}`, {
        headers: { apikey: token },
      });
      setIncomeNow(res.data.totalAmount);
      setTotalOrder(res.data.total_bill);
    }
  };

  const getWebHook = async () => {
    const url = `${import.meta.env.VITE_API_URL}/webhook?shop=${shop?.shop_id}`;

    try {
      await navigator.clipboard.writeText(url);
      Swal.fire("คัดลอก webhook ลิงก์เรียบร้อยแล้ว");
    } catch (err) {
      console.error("Copy failed", err);
      Swal.fire("คัดลอกไม่สำเร็จ");
    }
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat().format(val || 0);
  };

  useEffect(() => {
    if (openMenu === "สรุปยอดขาย") {
      geIncomeNow();
    }
  }, [openMenu]);

  return (
    <>
      <Tabs
        activeKey={openMenu}
        onSelect={(k) => setOpenMenu(k)}
        className="mb-3 mt-3"
      >
        <Tab
          eventKey="เมนูอาหาร"
          title={
            <span style={{ color: "#6c757d" }}>
              <MenuBookIcon /> สินค้า
            </span>
          }
        >
          <Products />
        </Tab>

        <Tab
          eventKey="ประเภทสินค้า"
          title={
            <span style={{ color: "#6c757d" }}>
              <PollIcon /> ประเภทสินค้า
            </span>
          }
        >
          <MenuType />
        </Tab>

        <Tab
          eventKey="บัญชี"
          title={
            <span style={{ color: "#6c757d" }}>
              <AccountCircleIcon /> จัดการพนักงาน
            </span>
          }
        >
          <User />
        </Tab>

        <Tab
          eventKey="สรุปรายการสั่งซื้อ"
          title={
            <span style={{ color: "#6c757d" }}>
              <CreditCardIcon /> สรุปการสั่งซื้อ
            </span>
          }
        >
          <ReportProduct />
        </Tab>

        <Tab
          eventKey="สรุปยอดขาย"
          title={
            <span style={{ color: "#6c757d" }}>
              <DataThresholdingIcon /> รายงานยอดขาย
            </span>
          }
        >
          <Row className="mt-3">
            {" "}
            <Col md={6}>
              {" "}
              <Card className="text-center">
                {" "}
                <Card.Body>
                  {" "}
                  <Card.Title style={{ color: "green" }}>
                    {" "}
                    ยอดขายเดือนนี้ + {formatMoney(inComeNow)} บาท{" "}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
            <Col md={6}>
              {" "}
              <Card className="text-center">
                {" "}
                <Card.Body>
                  {" "}
                  <Card.Title style={{ color: "#007bff" }}>
                    {" "}
                    คำสั่งซื้อ {totalOrder} ออเดอร์{" "}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
          </Row>
        </Tab>
        <Tab
          eventKey="ตั้งค่าแชทบอท"
          title={
            <span style={{ color: "#6c757d" }}>
              <MessageIcon /> จัดการแชทบอท
            </span>
          }
        >
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                ออกแบบแชทบอท ตอบกลับอัตโนมัติ
              </Card.Title>
              <Row>
                <Col md={2}>
                  <Button variant="outline-primary" className="w-100">
                    <PlaylistAddIcon /> block
                  </Button>
                </Col>
                <Col md={2}>
                  <Button
                    className="w-100"
                    variant="outline-secondary"
                    onClick={() => getWebHook()}
                  >
                    <LinkIcon /> get webhook
                  </Button>
                </Col>
              </Row>

              <Row
                className="mt-4 border-top g-3"
                style={{
                  backgroundColor: "#ececec",
                  height: "auto",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <span className="mb-2">ยินดีต้อนรับ</span>

                <Col md={4}>
                  <div className="block">
                    <h5>คีย์เวิร์ด </h5> <hr />
                    <Row>
                      <Col md={8}>
                        <Form.Control type="text" placeholder="Enter keyword" />
                      </Col>
                      <Col md={4}>
                        <Button variant="outline-primary">
                          <AddIcon /> คีย์เวิร์ด
                        </Button>
                      </Col>
                    </Row>
                    <br />
                    <Row className="g-2 bg-light p-2">
                      {randomKeywords.map((item, index) => (
                        <Col
                          key={index}
                          xs="auto"
                          className="border rounded p-1"
                        >
                          <span
                            className="keyword-tag"
                            onClick={() => navigator.clipboard.writeText(item)}
                          >
                            {item}
                          </span>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="block">
                    <h5>ตั้งค่าข้อความตอบกลับอัตโนมัติ</h5>
                    <hr />
                    <p>สนในเมนูไหน ดูก่อนได้</p>
                  </div>
                </Col>
                <Col md={4}>
                  <h5>ตัวอย่างแชทบอท</h5>
                  <hr />
                  <div className="chat-card bg-light p-4">
                    <div className="chat-header">
                      <div className="avatar"></div>
                      <div>
                        <div className="chat-status">ออนไลน์</div>
                      </div>
                    </div>

                    <div className="chat-body">
                      {/* ข้อความฝั่งลูกค้า */}
                      <div className="chat-row left">
                        <div className="bubble left">
                          สวัสดีครับ มีเมนูอะไรแนะนำบ้าง?
                        </div>
                      </div>

                      {/* ข้อความบอท */}
                      <div className="chat-row right">
                        <div className="bubble right">
                          แนะนำเป็นเมนูยอดนิยมของร้านได้เลยครับ 😊
                        </div>
                      </div>

                      <div className="chat-row right">
                        <div className="bubble right">
                          👉 กดเลือกคีย์เวิร์ดด้านซ้ายได้เลย
                        </div>
                      </div>
                    </div>

                    <div className="chat-footer mt-3">
                      <Button variant="outline-primary" size="md">
                        <SendIcon /> ทดสอบ chatbot ด้วย Messenger
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

              <Button variant="success" className="mt-4 mb-2">
                บันทึกการตั้งค่า
              </Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
};

export default Admin;
