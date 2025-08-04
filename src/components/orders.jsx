import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Modal, Form, Alert } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Details from "./Details";
import moment from "moment/moment";
import { httpDelete, httpGet, httpPut, sendNotificationBot } from "../http";
import Swal from 'sweetalert2';
import { AuthData } from "../ContextData";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
const Orders = () => {
    const { shop } = useContext(AuthData);
    const token = localStorage.getItem("token");
    const [report, setReport] = useState([]);
    const [show, setShow] = useState(false);
    const [price, setPrice] = useState(0);
    const [printBillId, setPrintBillId] = useState(null);
    const [id, setId] = useState(null);

    const [Delivered, setDelivered] = useState(0);
    const [OrderNew, setOrderNew] = useState(0);
    const [OrderCooking, setOrderCooking] = useState(0);
    const [OrderCookingFinish, setOrderCookingFinish] = useState(0);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const getMenuReport = async (status) => {

        if (shop?.shop_id) {

            await httpGet(`/bills?status=${status}&shop_id=${shop?.shop_id}`, { headers: { 'apikey': token } })
                .then(res => { setReport(res.data) });
        }
    }

    const getOrderDelivery = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=ส่งสำเร็จ`, { headers: { 'apikey': token } })
                .then(res => {
                    setDelivered(res.data.count);
                })
        }
    }

    const getOrderNew = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=รับออเดอร์แล้ว`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderNew(res.data.count);
                })
        }
    }

    const getOrderCooking = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=กำลังส่ง`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderCooking(res.data.count);
                })
        }
    }

    const getOrderCookingFinish = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=ทำเสร็จแล้ว`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderCookingFinish(res.data.count);
                })
        }
    }


    const handlePrint = async (billId, id) => {
        setAutoRefresh(false);
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const body = {
            printStatus: `พิมพ์เวลา ${hours}:${minutes}`
        }
        await httpPut(`/bills/${id}`, body)
        setPrintBillId(billId);
        setTimeout(() => {
            window.print();

        }, 2000);
        setAutoRefresh(true);
    };

    const CancelOrder = async (id, bid) => {
        await httpDelete(`/bills/${id}`)
        await httpDelete(`/billsdetails/${bid}`)
        await getMenuReport("รับออเดอร์แล้ว")
    }

    const handleClose = () => setShow(false);

    const reset = async () => {
        await setReport([]);
        setPrintBillId(null);
        getMenuReport("รับออเดอร์แล้ว");
        getOrderDelivery();
        getOrderNew();
        getOrderCooking();
        getOrderCookingFinish();
    }

    const UpdateStatus = async (id, status, messageid, step) => {
        Swal.fire({
            title: 'คุณต้องการอัพเดต หรือไม่ ?',
            text: "กดยืนยันเพื่ออัพเดตสถานะ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยันรายการ',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const body = {
                    statusOrder: status,
                    step: step
                }
                httpPut(`/bills/${id}`, body).then((res) => {
                    if (res) {
                        if (status === "ทำเสร็จแล้ว") {
                            if (messageid !== "pos") {
                                sendNotificationBot(messageid);
                            }
                        }
                        setReport([]);
                        getMenuReport("รับออเดอร์แล้ว");
                    }

                })


            }
        });

        getOrderDelivery();
        getOrderNew();
        getOrderCooking();
        getOrderCookingFinish();
    }


    const PAGE_ACCESS_TOKEN = 'EAAkMtjSMoDoBOZCGYSt499z6jgiiAjAicsajaOWhjqIxmHsl0asrAm61k6LgD1ifGXHzbDsHrJFCZASriCSyoPDpeqFh3ZBTrWC4ymdZCZBwcioKueKj31QK6w6GFHILPiJaZA8hgNHXtW5OqkRTZBzI0VFvIOoVhGdGq28DvOHGVSNEmPMJjkAOikE1thOaF3mzDg6dnjSyZBGpIY6mMZA1rWaIx';
    const sendMessageToPage = (userid, messageText) => {
        axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            recipient: {
                id: userid
            },
            message: {
                text: messageText
            }
        }).then(response => {
            if (response) {
                Swal.fire({
                    title: 'ส่งข้อความรับออเดอร์สำเร็จแล้ว',
                    icon: 'success',
                })

            }
        }).catch(error => {
            if (error) {
                Swal.fire({
                    title: 'ส่งข้อความไปยังลูกไม่สำเร็จ',
                    icon: 'error',
                })

            }

        });
    }


    const UpdatePrice = async () => {
        const body = {
            amount: parseInt(price)
        }
        await httpPut(`/bills/${id}`, body)
        setReport([]);
        await getMenuReport("รับออเดอร์แล้ว");
        handleClose();
    }

    const deleteBill = async (id, bid) => {
        Swal.fire({
            title: 'คุณต้องการยกเลิกออเดอร์หรือไม่ ?',
            text: "กดยืนยันเพื่อยกเลิก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยันรายการ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                CancelOrder(id, bid)
            }

        });

    }



    useEffect(() => {
        getMenuReport("รับออเดอร์แล้ว");
        getOrderDelivery();
        getOrderNew();
        getOrderCooking();
        getOrderCookingFinish();
    }, [shop])



    return (<>
        <Row className="mt-3">
            <Col md={12}>

                <Card style={{ border: 'none', marginTop: '12px' }}  >

                    <Form>

                        <Row className="when-print">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="btn btn-outline-primary" style={{ fontSize: '18px' }} onClick={() => { setReport([]), getMenuReport("รับออเดอร์แล้ว") }}>ออเดอร์ใหม่ {OrderNew}</Button>
                                <Button variant="btn btn-outline-success" style={{ fontSize: '18px' }} onClick={() => { setReport([]), getMenuReport("ทำเสร็จแล้ว") }}>ทำเสร็จแล้ว {OrderCookingFinish}</Button>
                                <Button variant="btn btn-outline-danger" style={{ fontSize: '18px' }} onClick={() => { setReport([]), getMenuReport("กำลังส่ง") }}>กำลังส่ง  {OrderCooking}</Button>
                                <Button variant="btn btn-outline-primary" style={{ fontSize: '18px' }} onClick={() => { setReport([]), getMenuReport("ส่งสำเร็จ") }}>ส่งสำเร็จ {Delivered} </Button>

                            </ButtonGroup>
                        </Row>
                        <Row className="mt-4 when-print">
                            <Col md={2} xs={6}><Button
                                onClick={() => { reset() }}
                            > < RestartAltIcon /> REFRESH </Button></Col>


                        </Row>

                        <Row>
                            {report.map((item, index) => (
                                <React.Fragment key={index}>
                                    {(printBillId === null || printBillId === item.bill_ID) && (
                                        <Col md={4}>
                                            <Card className="mb-4 mt-4" id={item.id}>
                                                <Card.Body style={{ padding: '12px' }}>
                                                    <div className="text-center show-header">
                                                        <h5> {shop?.name} </h5>
                                                        <h5>ใบเสร็จรับเงิน</h5>
                                                    </div>
                                                    <b> คิวที่ {item.queueNumber} <br /> เลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()}</b>
                                                    <p>
                                                        เวลาสั่งซื้อ {moment(item.timeOrder).format('HH:mm')} น. &nbsp; <br />
                                                        วันที่ {moment(item.timeOrder).format('YYYY-MM-DD')}<br />
                                                        {item?.printStatus !== null ? item?.printStatus : "ออเดอร์ใหม่"}
                                                    </p>
                                                    <Row>
                                                        <Col md={6} xs={6}>
                                                            <div className="when-print mb-2">
                                                                {

                                                                    item.messengerId !== "pos" && (

                                                                        <Button
                                                                            onClick={() => sendMessageToPage(item.messengerId, "ร้านรับออเดอร์แล้วครับ  ยอดรวม" + item.amount + "บาทครับ")}
                                                                            variant="light w-100">
                                                                            <SendIcon />  ส่งข้อความอีกครั้ง</Button>
                                                                    )

                                                                }

                                                                <b> {item.messengerId === 'pos' ? " Admin" : "Page"} </b> <br />

                                                            </div>
                                                        </Col>
                                                        {

                                                            item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                                <Col md={6} xs={6} className="mb-2">
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => handlePrint(item.bill_ID, item.id)}
                                                                        variant="primary w-100"
                                                                    >
                                                                        <LocalPrintshopIcon />  พิมพ์ใบเสร็จ
                                                                    </Button>
                                                                </Col>

                                                            )
                                                        }

                                                    </Row>
                                                    <Alert className="when-print bg-white">
                                                        <b>สถานะ : {item.statusOrder}</b>
                                                    </Alert>
                                                    <Details
                                                        reset={reset}
                                                        id={item.id}
                                                        bill_ID={item.bill_ID}
                                                        status={item.statusOrder}
                                                        userId={item.messengerId}
                                                        updateData={sendMessageToPage}
                                                        />

                                                    <Row>
                                                        <Col md={8}>
                                                            <h5>รวมทั้งหมด {item.amount} บาท</h5>
                                                            <h5>ลูกค้า-{item.customerName}</h5>
                                                            {item.address ? <h5>จัดส่งที่-{item.address}</h5> : " "}
                                                            <h5>วิธีการรับอาหาร-{item.ordertype}</h5>
                                                        </Col>
                                                        {/* {
                                                            item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                                <Col md={4}>
                                                                    <Button className="when-print" variant="warning" onClick={() => { setPrice(item.amount), setShow(true), setId(item.id) }} > แก้ไขราคารวม </Button>

                                                                </Col>
                                                            )
                                                        } */}

                                                    </Row>

                                                    <Row className="mt-2">

                                                        {
                                                            item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                                <Col md={6} xs={6} className="mb-2">
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {

                                                                            UpdateStatus(item.id, 'ทำเสร็จแล้ว', item.messengerId, 2);

                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        ทำอาหารเสร็จแล้ว
                                                                    </Button>
                                                                </Col>
                                                            )
                                                        }
                                                        {item.statusOrder === 'รับออเดอร์แล้ว' && (<>

                                                            <Col md={6} xs={6} className="mb-2">
                                                                <Button
                                                                    className="when-print"
                                                                    onClick={() => deleteBill(item.id, item.bill_ID)}
                                                                    variant="danger w-100"
                                                                >
                                                                    ยกเลิกออเดอร์
                                                                </Button>
                                                            </Col></>
                                                        )}
                                                        {
                                                            item.statusOrder === 'ทำเสร็จแล้ว' && (<>
                                                                <Col md={6} xs={6}>
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {

                                                                            UpdateStatus(item.id, 'กำลังส่ง', item.messengerId, 3);


                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        กำลังส่ง
                                                                    </Button>

                                                                </Col>
                                                                <Col md={6} xs={6}>
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {
                                                                            UpdateStatus(item.id, 'ส่งสำเร็จ', item.messengerId, 4);

                                                                        }}
                                                                        variant="primary w-100"
                                                                    >
                                                                        ส่งสำเร็จ
                                                                    </Button>

                                                                </Col>
                                                            </>)
                                                        }
                                                        {
                                                            item.statusOrder === 'กำลังส่ง' && (<>
                                                                <Col md={12}>
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {
                                                                            UpdateStatus(item.id, 'ส่งสำเร็จ', item.messengerId, 4);

                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        ส่งสำเร็จ
                                                                    </Button>

                                                                </Col>

                                                            </>)
                                                        }

                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </React.Fragment>
                            ))}
                        </Row>
                    </Form>

                </Card>
            </Col>
        </Row>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> แก้ไขราคา  </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>

                    <Row>
                        <Col md={12} xs={12}>

                            <Form.Group>

                                <Form.Label>ราคา</Form.Label>
                                <Form.Control type="text"
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder='ราคา'
                                    defaultValue={price} />

                            </Form.Group>

                        </Col>
                        <Row>

                            <Col md={6} xs={6} className="text-center">
                                <Button
                                    className="mt-3 w-100"
                                    onClick={() => UpdatePrice()}
                                    style={{ float: 'left' }}
                                    variant="success">
                                    บึนทึก
                                </Button>
                            </Col>
                            <Col md={6} xs={6}>
                                <Button
                                    className="mt-3 w-100"
                                    onClick={handleClose}
                                    style={{ float: 'left' }}
                                    variant="danger">
                                    ยกเลิก
                                </Button>
                            </Col>
                        </Row>

                    </Row>
                </Form>








            </Modal.Body>

        </Modal>
    </>)
}
export default Orders;