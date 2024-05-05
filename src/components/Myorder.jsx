import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, Alert } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import Details from "./Details";
import moment from "moment";
const Myorder = () => {

    let messengerId = sessionStorage.getItem("messangerId");
    const [myOrder, setMyorder] = useState([]);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const getMyorder =  () => {

         axios.get(`${import.meta.env.VITE_API_URL}/app/getMyorder?messengerId=${messengerId}&Date_times=${date}`)
            .then(res => {
                setMyorder(res.data);
            })
    }
 
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
                            myOrder.map(item => {
                                if (item.statusOrder !== "ออเดอร์พร้อมส่ง") {

                                    return (

                                        <>
                                            <Card className="mb-4">
                                                <Card.Body>
                                                    <p>รหัสออเดอร์ {item.bill_ID}  วันที่สั่งซื้อ { }
                                                        {moment(item.Date_times).format('YYYY-MM-DD')}
                                                    </p>
                                                    <Card.Title> รายการอาหาร</Card.Title>
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <h5>สถานะ {item.statusOrder}</h5>
                                                    <h5>การรับสินค้า - {item.ordertype}</h5>
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
                                if (item.statusOrder === "ออเดอร์พร้อมส่ง") {
                                    return (<>
                                        <Card className="mb-4">
                                            <Card.Body>
                                                <p>รหัสออเดอร์ {item.bill_ID}  วันที่สั่งซื้อ { }
                                                    {moment(item.Date_times).format('YYYY-MM-DD')}
                                                </p>
                                                <Card.Title> รายการอาหาร</Card.Title>
                                                <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                <h5>สถานะ {item.statusOrder}</h5>
                                                <h5>การรับสินค้า - {item.ordertype}</h5>
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