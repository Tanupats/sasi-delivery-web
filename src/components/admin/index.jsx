import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button, Navbar, Nav, Card } from 'react-bootstrap'
import axios from "axios";
import './index.scss';
import FoodMenuAdmin from "./FoodMenuAdmin";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import RecentActorsIcon from '@mui/icons-material/RecentActors';

import { Modal } from "react-bootstrap";
import { AuthData } from "../../ContextData";
import Stock from "./stock";
import Accounting from "./accounting";
const Admin = () => {
    const { user } = useContext(AuthData);
  
    const [openMenu, setOpenMenu] = useState("เมนูอาหาร");


    const [inComeNow, setIncomeNow] = useState(0);
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem("token");


    const geIncomeNow = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills/reportByMounth`,{headers:{'apikey':token}})
            .then(res => {
                setIncomeNow(res.data.totalAmount)
            })
    }




    const handleNavClick = (event) => {

        setOpenMenu(event);
    };
   
    useEffect(() => {
        if (openMenu === "สรุปยอดขาย") {
            geIncomeNow()
        }
    }
        , [openMenu])

    return (
        <Row>
            <Col md={2} className="dash-board">
                <Navbar expand="lg" className="d-flex flex-column vh-100" style={{ height: '100%' }}>
                    <Nav className="flex-column w-100" style={{ flex: 1 }}>
                        <Nav.Link onClick={() => handleNavClick("เมนูอาหาร")}><MenuBookIcon /> เมนูอาหาร</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("บัญชี")}><CreditCardIcon /> บัญชี</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("สรุปยอดขาย")}><DataThresholdingIcon /> สรุปยอดขาย</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("พนักงาน")}> <RecentActorsIcon /> พนักงาน</Nav.Link>
                        <Nav.Link onClick={() => handleNavClick("สต๊อก")}> <RecentActorsIcon /> สต๊อกสินค้า</Nav.Link>
                    </Nav>
                </Navbar>
            </Col>
            <Col md={9}>

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
                        <Col md={12}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>

                                        ยอดขายเดือนนี้   {inComeNow} บาท
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    )
                }
            </Col>

        </Row>)
}
export default Admin;