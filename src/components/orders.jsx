import React, { useEffect, useState } from "react";
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from "axios";
import Details from "./Details";
import moment from "moment/moment";

const Orders = () => {
    const token = localStorage.getItem("token");
    const [report, setReport] = useState([]);

    const getMenuReport = async (status) => {

        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills?status=${status}`, { headers: { 'apikey': token }})
            .then(res => { setReport(res.data) })

    }

    const UpdateStatus = async (id, status) => {
        const body = {
            statusOrder: status
        }
        await axios.put(`${import.meta.env.VITE_BAKUP_URL}/bills/${id}`, body)
            .then((data) => {
                if (data) {
                    getMenuReport("รับออเดอร์แล้ว");
                }
            })
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
                        จัดการออเดอร์ Delivery</Card.Title>
                    <Form>
                        {/* <Form.Label>
                                ค้นหาด้วยวันที่
                            </Form.Label>
                            <Form.Control type="date"/> */}
                        <Row className="when-print">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="primary" onClick={() => { getMenuReport("รับออเดอร์แล้ว") }}>ออเดอร์ใหม่</Button>
                                <Button variant="success" onClick={() => { getMenuReport("ทำเสร็จแล้ว") }}>ทำเสร็จแล้ว</Button>

                            </ButtonGroup>
                        </Row>

                        <Row>


                            {
                                report.map(item => {
                                    return (<>
                                        <Col md={4}>
                                            <Card className="mb-4 mt-4">
                                                <Card.Body>
                                                    <b>  ลูกค้า {item.customerName}</b>
                                                    <p>รหัสคำสั่งซื้อ  {item.bill_ID.substr(0, 5)} <br />
                                                        เวลาสั่งซื้อ{moment(item.timeOrder).format('HH:mm')}
                                                    </p>
                                                    <p> รวมทั้งหมด {item.amount}</p>
                                                    <p> คิวที่ {item.queueNumber}</p>
                                                    <Alert className="when-print bg-white"> <b> สถานะ : {item.statusOrder} </b></Alert>

                                                    <Details bill_ID={item.bill_ID} 
                                                    status={item.statusOrder} />
                                                    <Row>

                                                        {
                                                            item.statusOrder === "รับออเดอร์แล้ว" && (<>
                                                                <Col md={6}>
                                                                    <Button className="when-print"
                                                                        onClick={() => window.print()}
                                                                        variant="primary w-100" >พิมพ์</Button>
                                                                </Col>

                                                          </>  )
                                                        }


                                                        <Col md={6}>
                                                            <Button className="when-print"
                                                                onClick={() => UpdateStatus(item.id, "ทำเสร็จแล้ว")}
                                                                variant="success w-100" >ออเดอร์พร้อมส่ง</Button>
                                                        </Col>


                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </>)



                                })
                            }
                        </Row>
                    </Form>
                    {
                        report.length === 0 && (
                            <Alert className="mt-4 text-center"> ยังไม่มีรายการ </Alert>

                        )
                    }
                </Card>
            </Col>
        </Row>
    </>)
}
export default Orders;