import React, { useEffect, useState } from "react";
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from "axios";
import Details from "./Details";

const Orders = () => {

    const [report, setReport] = useState([]);
    const [date, setDate] = useState("2024-04-9");
    const [statusOrder,setStatusOrder] = useState("รับออเดอร์แล้ว");
    const getMenuReport = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/report?Date_times=${date}&statusOrder=${statusOrder}`)
            .then(res => {
                setReport(res.data);
            })
    }

    const UpdateStatus = async (Bill_id, status) => {

        let body = {
            statusOrder: status,

        }
        await axios.put(`${import.meta.env.VITE_API_URL}/app/updateStatusOrder/${Bill_id}`, body)
            .then(res => {
                if (res.status === 200) {
                    getMenuReport();

                }
            })

        handleClose()
        //update total new after update foodmenu 
    }
    const OnPrint = () => {
        window.print();
    }
    useEffect(() => {
        getMenuReport();
    }, [])
    return (<>
        <Row>
            <Col md={12}>

                <Card style={{border:'none',marginTop:'12px'}}  >
                  

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
                                    <Button variant="primary">รับออเดอร์</Button>
                                    <Button variant="primary">กำลังทำ</Button>
                                    <Button variant="primary">ส่งสำเร็จ</Button>
                                </ButtonGroup>
                            </Row>

                            {
                                report.map(item => {
                                    return (<>
                                        <Card>
                                            <Card.Body>
                                                <p>รหัสคำสั่งซื้อ  {item.bill_ID} เวลา{item.timeOrder}<br /> 
                                                 ลูกค้า {item.customerName}</p>
                                                <Alert className="when-print"> สถานะ : {item.statusOrder} </Alert>

                                                

                                                <Details bill_ID={item.bill_ID} status={item.statusOrder}/>
                                              

                                                <Row>
                                                    <Col md={4}>
                                                        <Button className="w-100 when-print" onClick={() => OnPrint()}>พิมพ์</Button>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Button
                                                            className="when-print"
                                                            variant="danger w-100"
                                                            onClick={() => UpdateStatus( item.bill_ID,"กำลังทำอาหาร")}>กำลังทำ</Button>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Button className="when-print"    onClick={() => UpdateStatus(item.bill_ID,"ออเดอร์พร้อมส่ง")} variant="success w-100" >พร้อมส่ง</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </>)
                                })
                            }

                        </Form>
                 

                </Card>
            </Col> </Row>
    </>)
}
export default Orders;