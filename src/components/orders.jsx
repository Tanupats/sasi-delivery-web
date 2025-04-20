import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Modal, Form, Alert } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Details from "./Details";
import moment, { updateLocale } from "moment/moment";
import { httpDelete, httpGet, httpPut, sendDelivery, sendNotificationBot } from "../http";
import Swal from 'sweetalert2';
import { AuthData } from "../ContextData";
const Orders = () => {
    const { shop } = useContext(AuthData);
    const token = localStorage.getItem("token");
    const [report, setReport] = useState([]);
    const [show, setShow] = useState(false);
    const [price, setPrice] = useState(0);
    const [printBillId, setPrintBillId] = useState(null);
    const [id, setId] = useState(null);
  

    const getMenuReport = async (status) => {
        setReport([]);
        await httpGet(`/bills?status=${status}&shop_id=${shop?.shop_id}`, { headers: { 'apikey': token } })
            .then(res => { setReport(res.data) })
    }

    const getMenuFinish = async (status) => {
        setReport([]);
        await httpGet(`/bills?status=${status}`, { headers: { 'apikey': token } })
            .then(res => { setReport(res.data) })
    }



    const handlePrint = async (billId, id) => {
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
    };

    const CancelOrder = async (id, bid) => {
        await httpDelete(`/bills/${id}`)
        await httpDelete(`/billsdetails/${bid}`)
        await getMenuReport("รับออเดอร์แล้ว")
    }

    const handleClose = () => setShow(false);

    const UpdateStatus = async (id, status, messageid,step) => {
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
                await httpPut(`/bills/${id}`, body)

                setReport([]);
                await getMenuReport("รับออเดอร์แล้ว");
                if (status === "ทำเสร็จแล้ว") {
                    if (messageid !== "pos") {
                        sendNotificationBot(messageid)
                    }

                }
                if (status === "กำลังส่ง") {
                    if (messageid !== "pos") {
                        sendDelivery(messageid)
                    }

                }


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
        getMenuReport("รับออเดอร์แล้ว")
    }, [])

    useEffect(() => {

    }, [report])



    return (<>
        <Row className="mt-3">
            <Col md={12}>

                <Card style={{ border: 'none', marginTop: '12px' }}  >


                    <Card.Title className="text-center when-print" as={'h5'}>
                        จัดการออเดอร์</Card.Title>
                    <Form>

                        <Row className="when-print">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="primary" onClick={() => { getMenuReport("รับออเดอร์แล้ว") }}>ออเดอร์ใหม่</Button>
                                <Button variant="success" onClick={() => { getMenuReport("ทำเสร็จแล้ว") }}>ทำเสร็จแล้ว</Button>
                                <Button variant="warning" onClick={() => { getMenuReport("กำลังส่ง") }}>กำลังส่ง</Button>
                                <Button variant="primary" onClick={() => { getMenuReport("ส่งสำเร็จ") }}>ส่งสำเร็จ</Button>

                            </ButtonGroup>
                        </Row>
                        <Row className="mt-4 when-print"> <Col><Button onClick={() => { setPrintBillId(null), getMenuReport("รับออเดอร์แล้ว") }} >  REFRESH</Button></Col></Row>
                        <Row>
                            {report.map((item, index) => (
                                <React.Fragment key={index}>
                                    {(printBillId === null || printBillId === item.bill_ID) && (
                                        <Col md={4}>
                                            <Card className="mb-4 mt-4" id={item.id}>
                                                <Card.Body style={{ padding: '12px' }}>

                                                    <div className="text-center">
                                                        <h5> {shop?.name} </h5>
                                                        <h5>ใบเสร็จรับเงิน</h5>

                                                    </div>
                                                    <b> คิวที่ {item.queueNumber} <br /> เลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()}</b>
                                                    <p>


                                                        เวลาสั่งซื้อ {moment(item.timeOrder).format('HH:mm')} น. &nbsp;<br />
                                                        วันที่ {moment(item.timeOrder).format('YYYY-MM-DD')}<br />
                                                        {item?.printStatus !== null ? item?.printStatus : " "}
                                                    </p>
                                                    <div className="when-print mb-2">


                                                        <b  > สั่งจาก {item.messengerId === 'pos' ? 'Admin' : 'Page'} </b> <br />
                                                    </div>
                                                    <Alert className="when-print bg-white">
                                                        <b>สถานะ : {item.statusOrder}</b>
                                                    </Alert>
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <Row>
                                                        <Col md={8}>
                                                            <h5>รวมทั้งหมด {item.amount} บาท</h5>
                                                            <h5>ลูกค้า-{item.customerName}</h5>
                                                            {item.address ? <h5>จัดส่งที่-{item.address}</h5> : " "}
                                                        </Col>
                                                        <Col md={4}>
                                                            <Button className="when-print" variant="warning" onClick={() => { setPrice(item.amount), setShow(true), setId(item.id) }} > แก้ไขราคา </Button>

                                                        </Col>
                                                    </Row>

                                                    <Row className="mt-2">
                                                        {item.statusOrder === 'รับออเดอร์แล้ว' && (<>
                                                            <Col md={6}>
                                                                <Button
                                                                    className="when-print"
                                                                    onClick={() => handlePrint(item.bill_ID, item.id)}
                                                                    variant="primary w-100"
                                                                >
                                                                    พิมพ์
                                                                </Button>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button
                                                                    className="when-print"
                                                                    onClick={() => deleteBill(item.id, item.bill_ID)}
                                                                    variant="danger w-100"
                                                                >
                                                                    ยกเลิก
                                                                </Button>
                                                            </Col></>
                                                        )}
                                                        {
                                                            item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                                <Col md={12}>
                                                                    <Button
                                                                        className="when-print mt-4"
                                                                        onClick={() => {
                                                                           
                                                                            UpdateStatus(item.id, 'ทำเสร็จแล้ว', item.messengerId,2);

                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        ทำอาหารเสร็จแล้ว
                                                                    </Button>
                                                                </Col>
                                                            )
                                                        }

                                                        {
                                                            item.statusOrder === 'ทำเสร็จแล้ว' && (<>
                                                                <Col md={12}>
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {

                                                                            UpdateStatus(item.id, 'กำลังส่ง', item.messengerId,3);
                                                                          

                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        กำลังส่ง
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
                                                                            UpdateStatus(item.id, 'ส่งสำเร็จ',item.messengerId,4);
                                                                            
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

                            <Col md={6} className="text-center">
                                <Button
                                    className="mt-3"
                                    onClick={() => UpdatePrice()}
                                    style={{ float: 'left' }}
                                    variant="success">
                                    แก้ไข
                                </Button>
                            </Col>
                            <Col md={6}>
                                <Button
                                    className="mt-3"
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