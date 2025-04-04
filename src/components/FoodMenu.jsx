import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../ContextData";
import { nanoid } from 'nanoid'
const FoodMenu = () => {

    const { userid, username } = useParams();

    localStorage.setItem("name", username)
    localStorage.setItem("messangerId", userid)
    localStorage.setItem("role", "user");
    localStorage.setItem("auth", "authenticated");

    const { addTocart } = useContext(AuthData)
    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);

    const onSelectMenu = (obj) => {
        let ID = nanoid(10)
        addTocart({ ...obj, id: ID,quantity:1 })
    }

    const getMenuType = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menutype`)
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
        fetch(`${import.meta.env.VITE_BAKUP_URL}/foodmenu`)
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

                                    return (<React.Fragment  key={index}>




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
                                        <Card style={{ height: '180px', marginBottom: '12px' }}>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={4}
                                                        xs={4}
                                                    >
                                                        <Image style={{ width: "100%", height: '150px', objectFit: 'cover' }}
                                                            src={`${import.meta.env.VITE_API_URL}/images/${item.img}`} />
                                                    </Col>
                                                    <Col md={4} xs={4}>

                                                        <h5>{item.foodname}</h5>
                                                        <h5>{item.Price}฿</h5>



                                                    </Col>
                                                    <Col md={4} xs={4} className="text-center">
                                                        <Button
                                                            onClick={() => onSelectMenu(item)}
                                                            style={{ backgroundColor: '#FD720D', border: 'none' }}
                                                        >
                                                            <AddCircleIcon />
                                                        </Button>
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