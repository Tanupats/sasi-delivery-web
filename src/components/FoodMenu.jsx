import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
const FoodMenu = () => {
    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);
    const getMenuType = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menuType`)
            .then(res => {
                setMenuType(res.data);
            })
    }

    const getMenuBytypeId = async (id) => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/${id}`)
            .then(res => {
                setFoods(res.data);
            })
    }

    const getFoodMenu = () => {
        fetch(import.meta.env.VITE_BAKUP_URL + '/foodmenu')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setFoods(data);
                }

            })
    }

    useEffect(() => {
        getMenuType();
        getFoodMenu();
    }, [])
    return (
        <>
            <Card>
                <Card.Title className="text-center mt-3">  รายการอาหาร</Card.Title>
                <Card.Body>

                    <Row>

                        <Col md={12} className="mb-4">

                            {
                                menuType.length > 0 && menuType?.map((item, index) => {

                                    return (


                                        <Badge
                                            key={index}
                                            style={{
                                                marginRight: '12px',
                                                fontSize: '18px',
                                                backgroundColor: '#FD720D', marginBottom: '12px'
                                            }}
                                            onClick={() => getMenuBytypeId(item.id)}
                                            pill bg="">
                                            {item.name}
                                        </Badge>

                                    )
                                })
                            }

                        </Col>
                        {
                            foods?.map((item, index) => {
                                return (<>


                                    <Col md={6} xs={12} key={index}>
                                        <Card style={{ height: '180px', marginBottom: '12px', padding: 0 }}>
                                            <Card.Body style={{ padding: '10px' }}>
                                                <Row>
                                                    <Col
                                                        md={5}
                                                        xs={5}
                                                        sm={5}
                                                    >
                                                        <Image style={{ width: "100%", height: '160px', objectFit: 'cover' }}
                                                            src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.img}`} />
                                                    </Col>
                                                    <Col
                                                        md={7}
                                                        sm={7}
                                                        xs={7}>
                                                        <h5>{item.foodname}</h5>
                                                        <h5 style={{

                                                            color: '#FD720D'
                                                        }}>{item.Price}฿</h5>
                                                        {item.status === 0 ? 'ของหมด' : ' '}
                                                    </Col>

                                                </Row>

                                            </Card.Body>


                                        </Card>

                                    </Col>
                                </>)
                            })
                        }
                    </Row>


                </Card.Body>
            </Card>

        </>)
}

export default FoodMenu;