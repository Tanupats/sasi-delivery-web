import React, { useEffect, useState } from "react";
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from "axios";
import Details from "./Details";
import moment from "moment/moment";
import { httpDelete } from "../http";
import Swal from 'sweetalert2';
const Orders = () => {
    const token = localStorage.getItem("token");
    const [report, setReport] = useState([]);

    const getMenuReport = async (status) => {

        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills?status=${status}`, { headers: { 'apikey': token } })
            .then(res => { setReport(res.data) })

    }

    const getMenuFinish = async (status) => {

        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills?status=${status}&sortBy=queueNumber&sortOrder=desc`, { headers: { 'apikey': token } })
            .then(res => { setReport(res.data) })

    }

    const [printBillId, setPrintBillId] = useState(null);

    const handlePrint = (billId) => {
        setPrintBillId(billId);
        setTimeout(() => {
            window.print();
            setPrintBillId(null); 
        }, 3000); 
    };

    const CancelOrder = async (id,bid) => {
        await httpDelete(`/bills/${id}`)
        await httpDelete(`/billsdetails/${bid}`)
        await getMenuReport("รับออเดอร์แล้ว")
    }

    const UpdateStatus = async (id, status) => {
        const body = {
            statusOrder: status
        }
        await axios.put(`${import.meta.env.VITE_BAKUP_URL}/bills/${id}`, body)
            .then((data) => {
                if (data) {
                    getMenuReport("รับออเดอร์แล้ว");
                    if (status === 'ส่งสำเร็จ') {
                        getMenuFinish("ทำเสร็จแล้ว")
                    }
                }
            })

    }
    const deleteBill = async (id,bid) => {
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
                CancelOrder(id,bid)
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
                        {/* <Form.Label>
                                ค้นหาด้วยวันที่
                            </Form.Label>
                            <Form.Control type="date"/> */}
                        <Row className="when-print">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="primary" onClick={() => { getMenuReport("รับออเดอร์แล้ว") }}>ออเดอร์ใหม่</Button>
                                <Button variant="success" onClick={() => { getMenuFinish("ทำเสร็จแล้ว") }}>ทำเสร็จแล้ว</Button>
                                <Button variant="primary" onClick={() => { getMenuReport("ส่งสำเร็จ") }}>ส่งสำเร็จ</Button>

                            </ButtonGroup>
                        </Row>

                        <Row>
                            {report.map((item, index) => (
                                <React.Fragment key={index}>
                                    {(printBillId === null || printBillId === item.bill_ID) && (
                                        <Col md={4}>
                                            <Card className="mb-4 mt-4" id={item.id}>
                                                <Card.Body>
                                                    
                                                            <b>ลูกค้า {item.customerName}</b>
                                                     

                                                    <p>
                                                        รหัสคำสั่งซื้อ {item.bill_ID.substr(0, 5)} <br />
                                                        คิวที่ {item.queueNumber} <br />
                                                        เวลาสั่งซื้อ {moment(item.timeOrder).format('HH:mm')} &nbsp;
                                                        วันที่สั่งซื้อ {moment(item.timeOrder).format('YYYY-MM-DD')}<br />

                                                    </p>
                                                    <Alert className="when-print bg-white">
                                                        <b>สถานะ : {item.statusOrder}</b>
                                                    </Alert>
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <b>รวมทั้งหมด {item.amount} บาท</b>
                                                    <Row className="mt-2">
                                                        {item.statusOrder === 'รับออเดอร์แล้ว' && (<>
                                                            <Col md={6}>
                                                                <Button
                                                                    className="when-print"
                                                                    onClick={() => handlePrint(item.bill_ID)}
                                                                    variant="primary w-100"
                                                                >
                                                                    พิมพ์
                                                                </Button>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button
                                                                    className="when-print"
                                                                    onClick={() => deleteBill(item.id,item.bill_ID)}
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
                                                                        onClick={() => UpdateStatus(item.id, 'ทำเสร็จแล้ว')}
                                                                        variant="success w-100"
                                                                    >
                                                                        ทำอาหารเสร็จแล้ว
                                                                    </Button>
                                                                </Col>
                                                            )
                                                        }

                                                        {
                                                            item.statusOrder === 'ทำเสร็จแล้ว' && (
                                                                <Col md={6}>
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => UpdateStatus(item.id, 'ส่งสำเร็จ')}
                                                                        variant="success w-100"
                                                                    >
                                                                        เปลี่ยนเป็นจัดส่งแล้ว
                                                                    </Button>
                                                                </Col>
                                                            )
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
    </>)
}
export default Orders;