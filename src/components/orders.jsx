import React, { useEffect, useState } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from "axios";
import Details from "./Details";

const Orders = () => {

    const [report, setReport] = useState([]);
    const [date, setDate] = useState("2024-03-29");
    const getMenuReport = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/report?Date_times=${date}`)
            .then(res => {
                setReport(res.data);
            })
    }

    const OnPrint =()=>{
        window.print();
    }
    useEffect(() => {
        getMenuReport();
    }, [])
    return (<>
        <Row>
            <Col md={12}>



                <Card>
                    <Card.Body>


                        <Card.Title className="text-center title">ออเดอร์สั่งอาหาร</Card.Title>
                        <Form>
                            {/* <Form.Label>
                                ค้นหาด้วยวันที่
                            </Form.Label>
                            <Form.Control type="date"/> */}
                            <Row className="when-print">

                                <ButtonGroup aria-label="Basic example">
                                    <Button variant="primary">รับออเดอร์</Button>
                                    <Button variant="primary">กำลังทำ</Button>
                                    <Button variant="primary">ส่งสำเร็จ</Button>
                                </ButtonGroup>
                            </Row>

                                {
                                    report.map(item=>{
                                        return (<>
                                                <Card>
                                                    <Card.Body>
                                                        <p>รหัสคำสั่งซื้อ  {item.bill_ID} เวลา{item.timeOrder}</p>
                                                        
                                                        <p>ลูกค้า {item.customerName}</p>
                                                       
                                                         <Details bill_ID={item.bill_ID}/>
                                                         <br />
                                                         <p>รวมทั้งหมด {item.amount} บาท</p>
                                                         <Row>
                                                            <Col>
                                                            <Button onClick={()=>OnPrint()}>พิมพ์</Button>
                                                            </Col>
                                                            <Col>
                                                            <Button onClick={()=>updateStatus("กำลังทำอาหาร")}>กำลังทำ</Button>
                                                            </Col>
                                                            <Col>
                                                            <Button >แก้ไข</Button>
                                                            </Col>
                                                         </Row>
                                                    </Card.Body>
                                                </Card>
                                        </>)
                                    })
                                }

                        </Form>
                    </Card.Body>

                </Card>
            </Col> </Row>
    </>)
}
export default Orders;