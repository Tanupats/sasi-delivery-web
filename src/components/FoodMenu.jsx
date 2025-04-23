import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';


const FoodMenu = () => {

    const { userid, username } = useParams();

    localStorage.setItem("name", username)
    localStorage.setItem("messangerId", userid)
    localStorage.setItem("role", "user");
    localStorage.setItem("auth", "authenticated");

    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);

    const getMenuType = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menutype/shop/15b4e191-d125-4c18-bdd1-445091c349ff`)
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
        fetch(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/shop/15b4e191-d125-4c18-bdd1-445091c349ff`)
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

                                    return (<React.Fragment key={index}>




                                        <Badge

                                            style={{
                                                marginRight: '12px',
                                                fontSize: '18px',
                                                backgroundColor: '#FD720D', marginBottom: '12px'
                                            }}
                                            onClick={() => getMenuBytypeId(item.id)}
                                            pill bg="">
                                            {item.name}
                                        </Badge>
                                    </React.Fragment>
                                    )
                                })
                            }

                        </Col>
                        {
                            foods?.map((item, index) => {
                                return (<>


                                    <Col md={6} xs={12} key={index}>
                                        <Card style={{ height: 'auto', marginBottom: '12px',padding:0 }}>
                                            <Card.Body style={{padding:12 }}>
                                                <Row>
                                                    <Col md={4}
                                                        xs={12}
                                                    >
                                                        <Image style={{ width: "100%", height: '150px', objectFit: 'cover',marginBottom:'20px' }}
                                                            src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.img}`} />
                                                    </Col>
                                                    <Col md={4} xs={12}>

                                                        <h5>{item.foodname}</h5>
                                                        <h5>{item.Price}฿</h5>



                                                    </Col>
                                                    {/* <Col md={4} xs={4} className="text-center">
                                                        <Button
                                                            onClick={() => onSelectMenu(item)}
                                                            style={{ backgroundColor: '#FD720D', border: 'none' }}
                                                        >
                                                            <AddCircleIcon />
                                                        </Button>
                                                    </Col> */}
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