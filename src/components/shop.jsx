import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const ShopData = () => {
    const { userid, name } = useParams();
    const router = useNavigate();
    const [data, setData] = useState([]);
    useEffect(() => {
        if (userid && name) {
            localStorage.setItem("messangerId", userid);
            localStorage.setItem("name", name);
        }
        axios.get(`${import.meta.env.VITE_BAKUP_URL}/shop`).then((res) => {
            if (res.status === 200) {
                setData(res.data);
            }
        })
    }, [])

    return (<>
        <Card style={{ marginBottom: '120px', border: 'none' }}>
            <Card.Body>
                <Row>
                    {
                        data

                            .map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Col
                                            style={{ cursor: 'pointer' }}
                                            md={4}
                                            xs={12}
                                            className="mt-2"

                                        >
                                            <Card>
                                                <Card.Body style={{ padding: 10 }}>

                                                    <Card.Title>{item.name}</Card.Title>
                                                    <div className="mb-2">

                                                        <h4>
                                                            {
                                                                item.is_open ? (<Badge bg="success" style={{ fontWeight: 500 }}>
                                                                    เปิด <AccessTimeIcon />  10:00 น - 22:00 น
                                                                </Badge>) : (

                                                                    <Badge bg="danger">ร้านปิด</Badge>
                                                                )
                                                            }
                                                        </h4>
                                                    </div>

                                                    <Image
                                                        style={{
                                                            width: "100%",
                                                            height: "360px",
                                                            objectFit: "cover",
                                                            cursor: item.is_open ? "pointer" : "not-allowed",
                                                            opacity: item.is_open ? 1 : 0.5, // ถ้าปิดร้านให้ดูจางลง
                                                        }}
                                                        src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.photo}`}
                                                        onClick={() => {
                                                            if (item.is_open) {
                                                                router(`/foodmenu/${item.shop_id}`);
                                                            }
                                                        }}
                                                    />






                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </React.Fragment>
                                );
                            })
                    }

                </Row>

            </Card.Body>


        </Card >
    </>)
}

export default ShopData;