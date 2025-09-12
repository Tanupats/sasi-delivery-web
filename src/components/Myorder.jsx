import React, { useState, useEffect, useContext } from "react";
import { Row, Card, Alert, Col, Button } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import Details from "./Details";
import moment from "moment";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AuthData } from "../ContextData";
import QRCode from 'qrcode.react';
import generatePayload from 'promptpay-qr'

const Myorder = () => {
    const steps = ['รับออเดอร์แล้ว', 'กำลังทำอาหาร', 'กำลังจัดส่ง', 'จัดส่งสำเร็จ'];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { counterOrder } = useContext(AuthData)
    let messengerId = localStorage.getItem("messangerId");
    const [myOrder, setMyOrder] = useState([]);
    const getMyOrder = () => {
        axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills/myorder?messengerId=${messengerId}`)
            .then(res => {
                if (res.status === 200) {
                    setMyOrder(res.data);
                }
            })
    }

    const [showQr, setShowQr] = useState(false);
    const [qrCode, setQrCode] = useState("sample");

    function handleQR(amount) {
        setQrCode(generatePayload("0983460756", { amount: Number(amount) }));
    }

    useEffect(() => {
        getMyOrder();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getMyOrder();
        }, 5000);

        return () => clearInterval(interval);
    }, [])
    return (<>
        <Card>
            <Card.Body>
                <Card.Title
                    className="text-center mb-3">
                    คำสั่งซื้อของฉัน
                </Card.Title>
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title={<b className="custom-tab-title">คำสั่งซื้อใหม่ {counterOrder}</b>}>
                        {
                            myOrder?.map((item, index) => {
                                if (item.statusOrder === "รับออเดอร์แล้ว") {
                                    return (
                                        <React.Fragment key={index}>
                                            <Card className="mb-4">
                                                <Card.Body>
                                                    <h6>หมายเลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                        {moment(item.Date_times).format('YYYY-MM-DD')}
                                                        &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.
                                                    </h6>
                                                    <hr />
                                                    <br />
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <h6 style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</h6>
                                                    <h6 style={{ fontSize: '18px' }}>วิธีการรับอาหาร - {item.ordertype === "สั่งกลับบ้าน" ? "จัดส่งที่ " + item.address : item.ordertype}

                                                        <br />

                                                    </h6>

                                                    <Row>
                                                        <Stepper activeStep={item.step} orientation={isMobile ? 'vertical' : 'horizontal'}>
                                                            {steps.map((label) => {

                                                                return (
                                                                    <Step key={label} >
                                                                        <StepLabel>{label}</StepLabel>
                                                                    </Step>
                                                                );
                                                            })}
                                                        </Stepper>
                                                        <Col md={12} className="mt-3 mb-3" >
                                                            <Button
                                                                variant='primary'

                                                                onClick={() => {
                                                                    handleQR(item.amount),
                                                                        setShowQr(!showQr)
                                                                }}>
                                                                จ่ายด้วย qrcode พร้อมเพย์ </Button>
                                                            {
                                                                showQr ? <center><QRCode value={qrCode} className="mt-3" />
                                                                    <h5>นายตนุภัทร สิทธิวงศ์  <br /> ยอดรวมทั้งหมด {item.amount} บาท </h5>
                                                                </center> : <></>
                                                            }
                                                        </Col>


                                                    </Row>
                                                    <></>
                                                </Card.Body>

                                            </Card>
                                        </React.Fragment>)
                                }

                            })
                        }
                    </Tab>
                    <Tab eventKey="profile" title={<b className="custom-tab-title">ที่ต้องได้รับ</b>}>
                        {
                            myOrder.map((item, index) => {
                                if (item.statusOrder !== "รับออเดอร์แล้ว") {
                                    return (<React.Fragment key={index}>
                                        <Card className="mb-4" >
                                            <Card.Body>
                                                <h6> หมายเลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                    {moment(item.Date_times).format('YYYY-MM-DD')}
                                                    &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.

                                                </h6>
                                                <hr />
                                                <br />
                                                <b>รายการสั่งซื้อ</b>
                                                <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                <h6 style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</h6>
                                                <h6 style={{ fontSize: '18px' }}>การรับอาหาร - {item.ordertype === "สั่งกลับบ้าน" ? "จัดส่งที่ " + item.address : item.ordertype}
                                                </h6>

                                                <Row>
                                                    <Stepper activeStep={item.step} orientation={isMobile ? 'vertical' : 'horizontal'}>
                                                        {steps.map((label) => {
                                                            return (
                                                                <Step key={label}>
                                                                    <StepLabel>{label}</StepLabel>
                                                                </Step>
                                                            );
                                                        })}
                                                    </Stepper>
                                                </Row>
                                            </Card.Body>

                                        </Card>
                                    </React.Fragment>)
                                }
                            })
                        }
                    </Tab>

                </Tabs>


                {myOrder.length === 0 && (

                    <Alert variant="danger text-center">ยังไม่มีคำสั่งซื้อ</Alert>
                )}
            </Card.Body>
        </Card>
    </>)
}

export default Myorder;