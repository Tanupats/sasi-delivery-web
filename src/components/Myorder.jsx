import React, { useState, useEffect, useContext } from "react";
import { Row, Card, Alert, Col, Button, Form } from "react-bootstrap";
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
import GetQueueComponent from './queueComponent';


const Myorder = () => {
    const steps = ['รับออเดอร์แล้ว', 'กำลังทำอาหาร', 'กำลังจัดส่ง', 'จัดส่งสำเร็จ'];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { counterOrder, api_url } = useContext(AuthData)
    let messengerId = localStorage.getItem("messangerId");
    const [myOrder, setMyOrder] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [showQr, setShowQr] = useState(false);
    const [qrCode, setQrCode] = useState("sample");

    const getMyOrder = async () => {
        await axios.get(`${api_url}/bills/myorder?messengerId=${messengerId}`)
            .then(res => {
                if (res.status === 200) {
                    setMyOrder(res.data);
                }
            })
    }

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

    const getBillDetails = async (bill_ID) => {
        const res = await axios.get(`${api_url}/billsdetails/${bill_ID}`);
        console.log(res.data);
        }

    const getOrderHistoryByDate = async (date) => {
      await  axios.get(`${api_url}/bills/order-history?messengerId=${messengerId}&date_input=${date}`)
            .then(res => {
                if (res.status === 200) {
                    setOrderHistory(res.data);
                }
            })
    }

    return (<>
        <Card>
            <Card.Body>
                <Card.Title as={'h6'}
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

                        {myOrder.length === 0 && (

                            <Alert variant="danger text-center">ยังไม่มีคำสั่งซื้อ</Alert>
                        )}
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
                                                <GetQueueComponent rider_id={item.rider_id} />
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

                        {myOrder.length === 0 && (

                            <Alert variant="danger text-center">ยังไม่มีคำสั่งซื้อ</Alert>
                        )}
                    </Tab>
                    <Tab eventKey="order-history" title={<b className="custom-tab-title">ประวัติคำสั่งซื้อ</b>}>
                        <Form className="mb-2">

                            <Form.Label> ระบุวันที่สั่งซื้อ</Form.Label>
                            <Form.Control type="date" onChange={(e) => getOrderHistoryByDate(e.target.value)} />
                        </Form>

                        {
                            orderHistory.map((item, index) => {

                                return (<React.Fragment key={index}>
                                    <Card className="mb-4" >
                                        <Card.Body>
                                            <h6> หมายเลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                {moment(item.Date_times).format('YYYY-MM-DD')}
                                                &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.

                                            </h6>
                                            <hr />
                                            <b>รายการสั่งซื้อ</b>
                                            <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                            <h6 style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</h6>
                                            <h6 style={{ fontSize: '18px' }}>การรับอาหาร - {item.ordertype === "สั่งกลับบ้าน" ? "จัดส่งที่ " + item.address : item.ordertype}

                                            </h6>
                                            <Button variant="light" onClick={() => {getBillDetails(item.bill_ID) }}> สั่งซื้ออีกครั้ง</Button>


                                        </Card.Body>

                                    </Card>
                                </React.Fragment>)

                            })

                        }
                        {orderHistory.length === 0 && (

                            <Alert variant="danger text-center">ไม่พบคำสั่งซื้อที่ค้นหา</Alert>
                        )}

                    </Tab>

                </Tabs>


            </Card.Body>
        </Card>
    </>)
}

export default Myorder;