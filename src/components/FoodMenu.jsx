import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../ContextData";
import { nanoid } from 'nanoid'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const FoodMenu = () => {

    const { userid, name } = useParams();
    localStorage.setItem("messangerId", userid);
    localStorage.setItem("name", name);
    const { addTocart } = useContext(AuthData)

    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);
    const [loading, setLoading] = useState(false);

    const onSelectMenu = (obj) => {
        let ID = nanoid(10)
        addTocart({ ...obj, id: ID, quantity: 1 })
    }

    const getMenuType = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menutype`)
            .then(res => {
                setMenuType(res.data);
            })
    }

    const getMenuBytypeId = async (id) => {
        setLoading(true)
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/${id}`)
            .then(res => {
                setFoods(res.data);
                setLoading(false)
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

                                    return (<React.Fragment key={index}>




                                        <Badge

                                            style={{
                                                marginRight: '12px',
                                                fontSize: '18px',
                                                cursor: 'pointer',
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

                        {loading === true && (
                            <Box sx={{ width: '100%', marginBottom: '12px' }}>
                                <LinearProgress />
                            </Box>
                        )
                        }
                        {
                            foods?.map((item, index) => {
                                return (<React.Fragment key={index}>


                                    <Col className="mb-2"
                                        md={6}
                                        xs={12}   >
                                        <Card style={{ height: '183px', marginBottom: '12px', margin: 0, padding: 5 }}>
                                            <Card.Body style={{ margin: 0, padding: 0 }}>
                                                <Row >
                                                    <Col
                                                        md={3}
                                                        xs={5}
                                                    >
                                                        <Image style={{ width: "100%", height: '170px', objectFit: 'cover' }}
                                                            src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.img}`} />
                                                    </Col>
                                                    <Col md={9}
                                                        xs={7}>
                                                        <h5>{item.foodname}</h5>
                                                        <h5>{item.Price}฿</h5>

                                                        {
                                                            item.status === 0 && (<p style={{ color: 'red' }}> ** ของหมด   </p>)
                                                        }
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
                                </React.Fragment>)
                            })
                        }

                    </Row>


                </Card.Body>
            </Card>

        </>)
}

export default FoodMenu;