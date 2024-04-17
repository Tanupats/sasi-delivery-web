import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Details from "./Details";
import moment from "moment";
const Myorder = () => {
    let messengerId = sessionStorage.getItem("messangerId");
    const [myOrder, setMyorder] = useState([]);
    const [date,setDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const getMyorder = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/getMyorder?messengerId=${messengerId}&Date_times=${date}`)
            .then(res => {
                setMyorder(res.data);
            })
    }

    useEffect(() => {
        getMyorder();

    }, [])
    return (<>
        <Card>

            <Card.Body>
                <Card.Title className="text-center mb-3">
                    คำสั่งซื้อของฉัน
                </Card.Title>
                {
                    myOrder.map(item => {
                        
                        return (<>
                            <Card className="mb-4">
                                <Card.Body>
                                    <p>รหัสออเดอร์ {item.bill_ID}  วันที่
                                        { moment(item.Date_times).format('YYYY-MM-DD') }
                                    </p>

                                    <p>การรับสินค้า {item.ordertype}</p>

                                    <Card.Title> รายการอาหาร</Card.Title>
                                    <Details bill_ID={item.bill_ID} />
                                    <p>สถานะ {item.statusOrder}</p>
                                    <b>รวมทั้งหมด {item.amount} บาท</b>
                                </Card.Body>

                            </Card>
                        </>)
                    })
                }
            </Card.Body>
        </Card>
    </>)
}

export default Myorder;