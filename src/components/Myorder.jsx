import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, Alert } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import Details from "./Details";
import moment from "moment";
const Myorder = () => {

    let messengerId = localStorage.getItem("messangerId");
    const [myOrder, setMyorder] = useState([]);
    const getMyorder = () => {

        axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills/myorder?messengerId=${messengerId}`)
            .then(res => {
                if (res.status===200) {
                    setMyorder(res.data);
                }

            })
    }

    useEffect(() => {
        getMyorder();
    }, [])


    useEffect(() => {

        const interval = setInterval(() => {
            getMyorder();
        }, 5000); // ดึงข้อมูลจาก API ทุกๆ 5 วินาที

        return () => clearInterval(interval);
    }, [])
    return (<>
        <Card>

            <Card.Body>
                <Card.Title className="text-center mb-3">
                    คำสั่งซื้อของฉัน
                </Card.Title>
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="ใหม่">
                        {
                            myOrder?.map(item => {
                                if (item.statusOrder === "รับออเดอร์แล้ว") {

                                    return (

                                        <>
                                            <Card className="mb-4">
                                                <Card.Body>
                                                    <p>รหัสออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                        {moment(item.Date_times).format('YYYY-MM-DD')}
                                                      &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.
                                                    </p>
                                                    <Card.Title> รายการอาหาร</Card.Title>
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <p style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</p>
                                                    <Alert> <h5> {item.statusOrder}</h5></Alert>
                                                </Card.Body>

                                            </Card>
                                        </>)
                                }

                            })
                        }
                    </Tab>
                    <Tab eventKey="profile" title="การจัดส่ง">
                        {
                            myOrder.map(item => {
                                if (item.statusOrder !== "รับออเดอร์แล้ว") {
                                    return (<>
                                          <Card className="mb-4">
                                                <Card.Body>
                                                    <p>รหัสออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                        {moment(item.Date_times).format('YYYY-MM-DD')}
                                                      &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.
                                                    </p>
                                                  
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <p style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</p>
                                                    <Alert> <h5> {item.statusOrder}</h5></Alert>
                                                </Card.Body>

                                            </Card>
                                    </>)
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