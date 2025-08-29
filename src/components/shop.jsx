import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image} from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QueueComponent from "./queueComponent";
const ShopData = () => {
    const { userid, name } = useParams();
 
    localStorage.setItem("messangerId", userid);
    localStorage.setItem("name", name);
    const router = useNavigate();
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BAKUP_URL}/shop`).then((res) => {

            if (res.status === 200) {
                setData(res.data);
            }
        })
    }, [])


    return (<>
        <Card style={{ marginBottom: '120px' }}>
            <Card.Body>
                <Row>
                    {
                        data
                            .filter(item => item.is_open)
                            .map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Col
                                            style={{ cursor: 'pointer' }}
                                            md={4}
                                            xs={12}
                                            className="mt-2"
                                            onClick={() => router(`/foodmenu/${item.shop_id}`)}
                                        >
                                            <Card>
                                                <Card.Body>

                                                    <Card.Title>{item.name}</Card.Title>
                                                    <div className="mb-2">
                                                        <b> <AccessTimeIcon />  10:00 น - 22:00 น.</b>
                                                    </div>
                                                    <Image
                                                        style={{ width: "100%", height: "360px", objectFit: "cover" }}
                                                        src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.photo}`}
                                                    />
                                                    <div className="row mt-3">
                                                        
                                                        <h4>
                                                            <Badge bg="success" style={{ fontWeight: 500 }}>
                                                                เปิดอยู่ตอนนี้  
                                                            </Badge>
                                                           
                                                        </h4>
                                                                <QueueComponent shop_id={item.shop_id} />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </React.Fragment>
                                );
                            })
                    }

                </Row>

            </Card.Body>


        </Card>
    </>)
}

export default ShopData;