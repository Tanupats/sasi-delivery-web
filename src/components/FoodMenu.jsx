import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button } from "react-bootstrap";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../ContextData";
import { nanoid } from 'nanoid'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
const FoodMenu = () => {
    const { shop_id } = useParams();

    const { addToCart, dev } = useContext(AuthData)

    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loadings, setLoadings] = useState(false);

    const onSelectMenu = (obj) => {
        let ID = nanoid(10)
        addToCart({ ...obj, id: ID, quantity: 1 })
    }

    const getMenuType = async () => {
        await axios.get(`${dev}/menutype/shop/${shop_id}`)
            .then(res => {
                setMenuType(res.data);
            })
    }

    const getMenuByTypeId = async (id) => {
        setLoading(true)
        await axios.get(`${dev}/foodmenu/${id}`)
            .then(res => {
                setFoods(res.data);
                setLoading(false);
            })
    }

    const getFoodMenu = () => {
        setLoadings(true)
        fetch(`${dev}/foodmenu/shop/${shop_id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setFoods(data);
                    setLoadings(false);
                }
            })
    }

    useEffect(() => {
        if (shop_id) {
            localStorage.setItem('shop_id', shop_id);
            getMenuType();
            getFoodMenu();
        }
    }, [])

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Card style={{ border: 'none', marginTop: '12px', marginBottom: '60px' }}>
                {/* <Card.Title className="text-center mt-3">  รายการอาหาร</Card.Title> */}
                <Card.Body>
                    <Row>
                        <Col md={12} className="mb-4">
                            {
                                menuType.length > 0 && menuType?.map((item, index) => {
                                    return (<React.Fragment key={index}>
                                        <Badge
                                            style={{
                                                marginRight: '12px',
                                                fontSize: '17px',
                                                fontWeight: 'normal',
                                                cursor: 'pointer',
                                                backgroundColor: '#FD720D', marginBottom: '12px'
                                            }}
                                            onClick={() => getMenuByTypeId(item.id)}
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
                            loadings && (<Row>
                                <Col md={6} xs={12}>
                                    <Stack spacing={1}>
                                        <Skeleton variant="rectangular" width={160} height={130} />
                                        <Skeleton variant="rounded" width={160} height={130} />
                                    </Stack>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Stack spacing={1}>
                                        <Skeleton variant="rectangular" width={160} height={130} />
                                        <Skeleton variant="rounded" width={160} height={130} />
                                    </Stack>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Stack spacing={1}>
                                        <Skeleton variant="rectangular" width={160} height={130} />
                                        <Skeleton variant="rounded" width={160} height={130} />
                                    </Stack>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Stack spacing={1}>
                                        <Skeleton variant="rectangular" width={160} height={130} />
                                        <Skeleton variant="rounded" width={160} height={130} />
                                    </Stack>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Stack spacing={1}>
                                        <Skeleton variant="rectangular" width={160} height={130} />
                                        <Skeleton variant="rounded" width={160} height={130} />
                                    </Stack>
                                </Col>
                            </Row>)
                        }

                        {
                            foods?.map((item, index) => {
                                return (<React.Fragment key={index}>
                                    <Col className="mb-4"
                                        md={6}
                                        xs={12}   >
                                        <Card style={{ height: '173px', marginBottom: '12px', margin: 0, padding: 0, borderRadius: '2px' }}>
                                            <Card.Body style={{ margin: 0, padding: 0 }}>
                                                <Row>
                                                    <Col
                                                        md={3}
                                                        xs={5}
                                                    >
                                                        {

                                                            loading ? <Skeleton variant="rectangular" width={130} height={170} /> :
                                                                <Image style={{ width: "100%", height: '170px', objectFit: 'cover' }}
                                                                    src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.img}`} />
                                                        }
                                                    </Col>
                                                    {
                                                        loading ?
                                                            <Stack spacing={1}>
                                                                <Skeleton variant="rectangular" width={210} height={60} />
                                                                <Skeleton variant="rounded" width={210} height={60} /> </Stack> :
                                                            <Col md={9}
                                                                xs={7} className="p-2">
                                                                <h6>{item.foodname}</h6>
                                                                <h6>{item.Price} ฿</h6>
                                                                {

                                                                    item.notes ? (
                                                                        <b style={{ color: 'red' }}> หมายเหตุ :  {item.notes} </b>
                                                                    ) : ""
                                                                }
                                                                {
                                                                    item.status === 0 && (<h6 style={{ color: 'red' }}>  <Badge bg="danger">ของหมด</Badge>   </h6>)
                                                                }
                                                                <Button
                                                                    disabled={item.status === 0 ? true : false}
                                                                    onClick={() => onSelectMenu(item)}
                                                                    style={{ backgroundColor: '#FD720D', border: 'none' }}
                                                                >
                                                                    <AddCircleIcon />
                                                                </Button>
                                                            </Col>
                                                    }
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </React.Fragment>)
                            })
                        }
                        <button
                            style={{ backgroundColor: '#FD720D' }}
                            onClick={() => scrollToTop()}
                            className={`scroll-to-top ${isVisible ? "show" : ""}`}
                        >
                            <KeyboardArrowUpIcon />
                        </button>
                    </Row>
                </Card.Body>
            </Card>
        </>)
}

export default FoodMenu;