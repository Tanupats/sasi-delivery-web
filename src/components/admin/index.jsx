import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Tabs, Tab } from "react-bootstrap";
import "./index.scss";

import Products from "./products";
import ReportProduct from "./ReportProduct";
import MenuType from "./MenuType";
import User from "./user";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import PollIcon from "@mui/icons-material/Poll";

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
              <PollIcon /> ประเภท
            </span>
          }
        >
          <MenuType />
        </Tab>

        <Tab
          eventKey="บัญชี"
          title={
            <span style={{ color: "#6c757d" }}>
              <CreditCardIcon /> จัดการพนักงาน
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
                  <Card.Title style={{ color: "blue" }}>
                    {" "}
                    คำสั่งซื้อ {totalOrder}{" "}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
          </Row>
        </Tab>
      </Tabs>
    </>
  );
};

export default Admin;
