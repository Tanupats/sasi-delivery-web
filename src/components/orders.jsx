import React, { useEffect, useState } from "react";
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from "axios";
import Details from "./Details";
import moment from "moment/moment";

const Orders = () => {

    const [report, setReport] = useState([]);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [status, setStatus] = useState("");

    const getMenuReport = async (status) => {
       
        await axios.get(`${import.meta.env.VITE_API_URL}/report.php?Date_times=${date}&statusOrder=${status}`)
            .then(res => {
                setReport(res.data);
            }) 
            setStatus(status)
    }

    const UpdateStatus = async (Bill_id, status) => {
        setStatus(status)
        let body = {
            status: status,

        }
        await fetch(`${import.meta.env.VITE_API_URL}/updateStatusOrder.php?id=${Bill_id}`, { method: 'PUT', body: JSON.stringify(body) })
            .then((res) =>
                res.json()
            ).then((data) => {
                if (data) {
                    getMenuReport(status);
                }
            })
    }

    const OnPrint = () => {
        window.print();
    }

    useEffect(() => {

        getMenuReport("รับออเดอร์แล้ว")
    }, [])

    useEffect(() => {

    }, [report])
  

    return (<>
        <Row>
            <Col md={12}>

                <Card style={{ border: 'none', marginTop: '12px' }}  >


                    <Card.Title className="text-center title" as={'h6'}>
                        SASI Restuarant หนองคาย <br />
                        รายการสั่งอาหาาร</Card.Title>
                    <Form>
                        {/* <Form.Label>
                                ค้นหาด้วยวันที่
                            </Form.Label>
                            <Form.Control type="date"/> */}
                        <Row className="when-print">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="primary" onClick={() => { getMenuReport("รับออเดอร์แล้ว") }}>รับออเดอร์</Button>
                                <Button variant="danger" onClick={() => { getMenuReport("กำลังทำอาหาร") }}>กำลังทำ</Button>
                                <Button variant="success" onClick={() => { getMenuReport("ออเดอร์พร้อมส่ง") }}>รอส่ง</Button>
                                <Button variant="primary" onClick={() => { getMenuReport("ส่งแล้ว") }}>ส่งแล้ว</Button>
                            </ButtonGroup>
                        </Row>

                        {
                            report.map(item => {
                                return (<>
                                    <Card className="mb-4 mt-4">
                                        <Card.Body>
                                            <p>รหัสคำสั่งซื้อ  {item.bill_ID} เวลา{item.timeOrder}<br />
                                                ลูกค้า {item.customerName}</p>
                                               <p> รวมทั้งหมด {item.amount}</p>
                                            <Alert className="when-print bg-white"> <b> สถานะ : {item.statusOrder} </b></Alert>
                                            
                                            {/* <Details bill_ID={item.bill_ID} status={item.statusOrder} /> */}
                                            <Row>
                                                {/* {

                                                    item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                        <Col md={2}>
                                                            <Button className="w-100 when-print" onClick={() => OnPrint()}>พิมพ์ใบเสร็จ</Button>
                                                        </Col>
                                                    )
                                                } */}

                                                {
                                                    item.statusOrder === "รับออเดอร์แล้ว" && (
                                                        <Col md={4}>
                                                            <Button
                                                                className="when-print"
                                                                variant="danger w-100"
                                                                onClick={() => UpdateStatus(item.bill_ID, "กำลังทำอาหาร")}>กำลังทำ</Button>
                                                        </Col>
                                                    )
                                                }
                                                {
                                                    item.statusOrder === "กำลังทำอาหาร" && (
                                                        <Col md={4}>
                                                            <Button className="when-print"
                                                                onClick={() => UpdateStatus(item.bill_ID, "ออเดอร์พร้อมส่ง")}
                                                                variant="success w-100" >พร้อมส่ง</Button>
                                                        </Col>
                                                    )
                                                }
                                                {
                                                    item.statusOrder === "ออเดอร์พร้อมส่ง" && (
                                                        <Col md={4}>
                                                            <Button className="when-print"
                                                                onClick={() => UpdateStatus(item.bill_ID, "ส่งแล้ว")}
                                                                variant="success w-100" >เปลี่ยนสถาน่ะเป็นส่งแล้ว</Button>
                                                        </Col>
                                                    )
                                                }
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </>)
                            })
                        }

                    </Form>
                    {
                        report.length === 0 && (
                            <Alert className="mt-4 text-center">  ยังไม่มีรายการ {status} </Alert>

                        )
                    }
                </Card>
            </Col>
        </Row>
    </>)
}
export default Orders;