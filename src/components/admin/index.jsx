import { useState, useEffect, useContext } from "react";
import { Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import "./index.scss";

import Products from "./products";
import ReportProduct from "./ReportProduct";
import MenuType from "./MenuType";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import PollIcon from "@mui/icons-material/Poll";

import { httpGet } from "../../http";
import { AuthData } from "../../ContextData";
import User from "./user";

const Admin = () => {
  const [openMenu, setOpenMenu] = useState("เมนูอาหาร");
  const [showSidebar, setShowSidebar] = useState(false);

  const [inComeNow, setIncomeNow] = useState(0);
  const [outComeNow, setOutcomeNow] = useState(0);
  const [totalOrder, setTotalOrder] = useState(85);

  const token = localStorage.getItem("token");
  const { shop } = useContext(AuthData);

  const geIncomeNow = async () => {
    if (shop) {
      const res = await httpGet(`/bills/reportByMounth/${shop?.shop_id}`, {
        headers: { apikey: token },
      });
      setIncomeNow(res.data.totalAmount);
    }
  };

  const geOutcomeNow = async () => {
    const res = await httpGet(`/account/outcome-mounth?shop_id=${shop?.shop_id}`);
    setOutcomeNow(res.data._sum.total);
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat().format(val || 0);
  };

  const handleNavClick = (menu) => {
    setOpenMenu(menu);
    setShowSidebar(false); // ปิด sidebar ตอนเลือกเมนูมือถือ
  };

  useEffect(() => {
    if (openMenu === "สรุปยอดขาย") {
      geIncomeNow();
      geOutcomeNow();
    }
  }, [openMenu]);

  return (
    <>
   

      <Row> 
      

      <div className="mobile-header">
        <button
          className="menu-toggle"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰ เมนู
        </button>
      </div>
    
        <Col md={2} className={`dash-board sidebar ${showSidebar ? "open" : ""}`}>
          <Navbar expand="lg" className="d-flex flex-column vh-100">
            <Nav className="flex-column w-100">

              <Nav.Link onClick={() => handleNavClick("เมนูอาหาร")}>
                <MenuBookIcon /> จัดการข้อมูลสินค้า
              </Nav.Link>

              <Nav.Link onClick={() => handleNavClick("ประเภทสินค้า")}>
                <PollIcon /> ประเภทสินค้า
              </Nav.Link>

              <Nav.Link onClick={() => handleNavClick("บัญชี")}>
                <CreditCardIcon /> จัดการผู้ใช้และบัญชี
              </Nav.Link>

              <Nav.Link onClick={() => handleNavClick("สรุปรายการสั่งซื้อ")}>
                <CreditCardIcon /> สรุปรายการขาย
              </Nav.Link>

              <Nav.Link onClick={() => handleNavClick("สรุปยอดขาย")}>
                <DataThresholdingIcon /> รายงานยอดขาย
              </Nav.Link>

            </Nav>
          </Navbar>
        </Col>

   
        <Col md={10} xs={12} className="main-content">

          {openMenu === "เมนูอาหาร" && <Products />}

          {openMenu === "บัญชี" && <User />}

          {openMenu === "สรุปรายการสั่งซื้อ" && <ReportProduct />}

          {openMenu === "ประเภทสินค้า" && <MenuType />}

          {openMenu === "สรุปยอดขาย" && (
            <Row className="mt-3">

              <Col md={6}>
                <Card className="mt-2 text-center">
                  <Card.Body>
                    <Card.Title style={{ color: "green" }}>
                      ยอดขายเดือนนี้ + {formatMoney(inComeNow)} บาท
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>

          

              <Col md={6}>
                <Card className="mt-2 text-center">
                  <Card.Body>
                    <Card.Title style={{ color: "blue" }}>
                      คำสั่งซื้อ {totalOrder}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          )}

        </Col>
      </Row>
    </>
  );
};

export default Admin;