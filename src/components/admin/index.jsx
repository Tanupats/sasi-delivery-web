import { useState, useEffect, useContext } from "react";
import { Row, Col, Navbar, Nav, Card } from 'react-bootstrap'
import './index.scss';
import FoodMenuAdmin from "./FoodMenuAdmin";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import PollIcon from '@mui/icons-material/Poll';
import Stock from "./stock";
import Accounting from "./accounting";
import ReportProduct from "./ReportProduct";
import { httpGet } from "../../http";
import { AuthData } from "../../ContextData";
import MenuType from "./MenuType";

const Admin = () => {
    const [openMenu, setOpenMenu] = useState("เมนูอาหาร");
    const [inComeNow, setIncomeNow] = useState(0);
    const [outComeNow, setOutcomeNow] = useState(0);
    const [totalOrder, setTotalOrder] = useState(85);
    const token = localStorage.getItem("token");
    const { shop } = useContext(AuthData);

    const geIncomeNow = async () => {
        if (shop) {
            await httpGet(`/bills/reportByMounth/${shop?.shop_id}`, { headers: { 'apikey': token } })
                .then(res => {
                    setIncomeNow(res.data.totalAmount);
                })
        }
    }

    const formatMoney = (val) => {
        return new Intl.NumberFormat().format(val)
    }

    const geOutcomeNow = async () => {
        await httpGet(`/account/outcome-mounth?shop_id=${shop?.shop_id}`)
            .then(res => {
                setOutcomeNow(res.data._sum.total);
            })
    }



    const handleNavClick = (event) => {
        setOpenMenu(event);
    };

    useEffect(() => {
        if (openMenu === "สรุปยอดขาย") {
            geIncomeNow();
            geOutcomeNow();
        }
    }
        , [openMenu])

    return (
        <Row>
            <Col md={2} className="dash-board">
                <Navbar expand="lg" className="d-flex flex-column vh-100" style={{ height: '100%' }}>
                    <Nav className="flex-column w-100" style={{ flex: 1 }}>
                        <Nav.Link onClick={() => handleNavClick("เมนูอาหาร")}><MenuBookIcon /> รายการสินค้า</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("ประเภทสินค้า")}><PollIcon /> ประเภทสินค้า</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("บัญชี")}><CreditCardIcon /> บันทึกรายจ่าย</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("สรุปรายการสั่งซื้อ")}><CreditCardIcon /> สรุปรายการสั่งซื้อ</Nav.Link> 
                        <Nav.Link onClick={() => handleNavClick("สรุปยอดขาย")}><DataThresholdingIcon /> สรุปยอดขายทั้งหมด</Nav.Link>
                    </Nav>
                </Navbar>
            </Col>
            <Col md={10} xs={12}>
                {
                    openMenu === "สต๊อก" && (
                        <Stock />
                    )
                }
                {
                    openMenu === "เมนูอาหาร" && (
                        <FoodMenuAdmin />
                    )
                }
                {
                    openMenu === "บัญชี" && (<>
                        <Accounting />
                    </>)
                }
                {
                    openMenu === "สรุปยอดขาย" && (<Row className="mt-3">
                        <Col md={6}>
                            <Card className="mt-2 text-center">
                                <Card.Body>
                                    <Card.Title style={{ color: 'green' }}>

                                        ยอดขายเดือนนี้ +  {formatMoney(inComeNow)} บาท  <br />


                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mt-2 text-center">
                                <Card.Body>
                                    <Card.Title style={{ color: 'red' }}>


                                        ค่าใช้จ่ายเดือนปัจจุบัน  - {formatMoney(outComeNow)} บาท  <br />

                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col> 
                         <Col md={6}>
                            <Card className="mt-2 text-center">
                                <Card.Body>
                                    <Card.Title style={{ color: '#FD720D' }}>

                                        กำไร   {formatMoney(inComeNow - outComeNow)} บาท  <br />

                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col> 
                         <Col md={6}>
                            <Card className="mt-2 text-center">
                                <Card.Body>
                                    <Card.Title style={{ color: 'blue' }}>
                                      คำสั่งซื้อ   {totalOrder}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col> 
                    </Row>
                    )
                }
                {
                    openMenu === "สรุปรายการสั่งซื้อ" && (

                        <ReportProduct />
                    )
                }
                {
                    openMenu === "รายจ่าย" && (

                        <Accounting />
                    )
                }
                
                {
                    openMenu === "ประเภทสินค้า" && (

                        <MenuType />
                    )
                }
            </Col>

        </Row>)
}
export default Admin;