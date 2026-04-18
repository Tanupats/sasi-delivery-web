import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Tabs, Tab,Badge ,Button,Form} from "react-bootstrap";
import "./index.scss";

import Products from "./products";
import ReportProduct from "./ReportProduct";
import MenuType from "./MenuType";
import User from "./user";
import MessageIcon from '@mui/icons-material/Message';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import PollIcon from "@mui/icons-material/Poll";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { httpGet } from "../../http";
import { AuthData } from "../../ContextData";

const Admin = () => {
  const [openMenu, setOpenMenu] = useState("เมนูอาหาร");

  const [inComeNow, setIncomeNow] = useState(0);
  const [totalOrder,setTotalOrder] = useState(85);

  const token = localStorage.getItem("token");
  const { shop } = useContext(AuthData);

  const geIncomeNow = async () => {
    if (shop) {
      const res = await httpGet(`/bills/reportByMounth/${shop?.shop_id}`, {
        headers: { apikey: token },
      });
      setIncomeNow(res.data.totalAmount);
      setTotalOrder(res.data.total_bill);
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
                    คำสั่งซื้อ {totalOrder}{" "} ออเดอร์{" "}
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
  <Col md={4}>
                   <Button variant="success"> + chatbot </Button>
                  </Col>
                <Row className="mt-4 border-top bg-gray pt-4">
                <span className="mb-2">block_name</span> 
                 
                  <Col md={4}>
                      <div className="block">


                        <h5>คีย์เวิร์ด </h5>  <hr />
                        
                          <Row>
                            <Col md={8}>
                             <Form.Control type="text" placeholder="Enter keyword" />
                            </Col>
                            <Col md={4}>
                             <Button variant="outline-primary"> + คีย์เวิร์ด</Button> 
                            </Col>
                            </Row> 
                          <br />
                      

                          <span   className="border  p-2" variant="primary">สวัสดี</span>
                          <span   className="border  p-2" variant="primary">สวัสดี</span>
                          <span   className="border  p-2" variant="primary">สวัสดี</span>
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
                    <div className="block">
                      <h5>ตัวอย่างแชทบอท</h5>
                      <hr />
                      <p>ข้อความที่จะแสดงเมื่อมีลูกค้าส่งข้อความเข้ามา</p>
                    </div>
                  </Col>
                </Row>
            </Card.Body>

          </Card>
         
        </Tab>
      </Tabs>
    </>
  );
};

export default Admin;
