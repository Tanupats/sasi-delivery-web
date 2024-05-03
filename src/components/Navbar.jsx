import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthData } from "../ContextData";
import FoodMenu from './FoodMenu';
import Myorder from './Myorder';
import Orders from './orders';
import GetQueu from './GetQueu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
const NavbarMenu = () => {

    const { toTal, cart, sumPrice, removeCart, saveOrder, updateNote, name, messangerId } = useContext(AuthData);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSave = () => {
        saveOrder()
        handleClose()
    }
    useEffect(() => {

    }, [
        
    ])
    return (
        <Router>

            <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top'>
                <Container fluid>
                    {/* <Navbar.Brand href="#home">SASI Delivery</Navbar.Brand> */}
                    <Nav className="me-auto">
                        <Nav.Link  ><RestaurantMenuIcon /> <Link  style={{textDecoration:'none'}}  to={`/${messangerId}/${name}`}>  เมนูอาหาร</Link> </Nav.Link>
                        <Nav.Link onClick={handleShow}><LocalMallIcon />   {toTal}</Nav.Link>
                        <Nav.Link  ><AccountBoxIcon /> <Link  style={{textDecoration:'none'}}  to={'/Myorder'}>  คำสั่งซื้อ </Link> </Nav.Link>
                        <Nav.Link  ><AddToQueueIcon /> <Link  style={{textDecoration:'none'}}   to={'/queueNumber'}>  คิวทั้งหมด </Link> </Nav.Link>

                        {sessionStorage.getItem("name") === "" && (
                            <Nav.Link  ><AccountBoxIcon /> <Link to={'/orders'}>  ออเดอร์</Link> </Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>รายการสั่งอาหาร</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {
                            cart.length !== 0 && cart?.map(item => {
                                return (<>


                                    <Col md={12} xs={12}>
                                        <Card style={{ height: '130px', marginBottom: '10px', padding: '10px' }}>
                                            <Card.Body className='p-0'>
                                                <Row>
                                                    <Col md={5}
                                                        xs={5}
                                                    >
                                                        <Image style={{ width: "100%", height: '100px', objectFit: 'cover' }}
                                                            src={`${import.meta.env.VITE_API_URL}/files/${item.photo}`} />
                                                    </Col>
                                                    <Col md={5} xs={5}>
                                                        <h6>{item?.name}</h6>
                                                        <h6>{item?.price}฿</h6>
                                                        <Row>
                                                            <Form>

                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder='หมายเหตุเพิ่มเติม'
                                                                    onChange={(e) => updateNote(item.id, e.target.value)}
                                                                    defaultValue={item.note}
                                                                />
                                                            </Form>
                                                        </Row>
                                                    </Col>
                                                    <Col md={2} xs={2} className="text-center">
                                                        <Button
                                                            onClick={() => removeCart(item.id)}
                                                            style={{ float: 'right' }}

                                                            variant="danger">
                                                            <RemoveCircleOutlineIcon />
                                                        </Button>
                                                    </Col>
                                                </Row>

                                            </Card.Body>


                                        </Card>

                                    </Col>
                                </>)
                            })
                        }
                        {
                            cart.length > 0 ? (
                                <>
                                    <span>รวมทั้งหมด {sumPrice} บาท</span>
                                    <span>จำนวน {toTal} รายการ</span>
                                </>
                            ) : (
                                <Alert variant='danger' className='pd-4'>
                                    ยังไม่มีรายการสั่งอาหาร

                                </Alert>)
                        }
                    </Row>
                </Modal.Body>
                {
                    cart.length > 0 && (<>
                        <Modal.Footer>
                            <Button variant="success" onClick={() => onSave()}>
                                ยืนยันสั่งออเดอร์
                            </Button>
                            <Button variant="danger" onClick={handleClose}>
                                ยกเลิก
                            </Button>
                        </Modal.Footer>
                    </>)
                }
            </Modal>
            <Routes basename="/var/www/html/sasi-delivery-web/dist">
                <Route path="/" Component={FoodMenu}></Route>
                <Route path="/orders" Component={Orders}></Route>
                <Route path="/:userid/:username" Component={FoodMenu}></Route>
                <Route path="/Myorder" Component={Myorder}></Route>
                <Route path="/queueNumber" Component={GetQueu}></Route>
            </Routes>
        </Router>
    );
    
}

export default NavbarMenu;