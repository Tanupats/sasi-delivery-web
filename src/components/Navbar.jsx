import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthData } from "../ContextData";
import FoodMenu from './FoodMenu';
const NavbarMenu = () => {
   
    const { toTal, cart, sumPrice, removeCart } = useContext(AuthData);
    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {

    }, [])
    return (
    <Router >
        
            <Navbar bg="light" data-bs-theme="light">
                <Container fluid>
                    <Navbar.Brand href="#home">SASI Delivery</Navbar.Brand>
                    <Nav className="me-auto">

                        <Nav.Link onClick={handleShow}><LocalMallIcon /> {toTal}</Nav.Link>
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
                                        <Card style={{ height: '130px', marginBottom: '10px',padding:'10px' }}>
                                            <Card.Body className='p-0'>
                                                <Row>
                                                    <Col md={5}
                                                        xs={5}
                                                    >
                                                        <Image style={{ width: "100%", height: '100px', objectFit: 'cover' }} src={item?.photo} />
                                                    </Col>
                                                    <Col md={5} xs={5}>
                                                        <h6>{item?.name}</h6>
                                                        <h6>{item?.price}฿</h6>
                                                        <Row>
                                                            <Form>

                                                                <Form.Control type="text" placeholder='หมายเหตุเพิ่มเติม' />
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
                                    <span>    รวมทั้งหมด {sumPrice} บาท</span>
                                    <span>    จำนวน {toTal} รายการ</span>
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
                            <Button variant="success" onClick={handleClose}>
                                ยืนยันสั่งออเดอร์
                            </Button>
                            <Button variant="danger" onClick={handleClose}>
                                ยกเลิก
                            </Button>
                        </Modal.Footer>
                    </>)
                }

            </Modal>
            <Routes>
          <Route path="/" Component={FoodMenu}></Route>
          <Route path="/:userid/:username" Component={FoodMenu}></Route>
       
        </Routes>
            </Router>
        
    );
}

export default NavbarMenu;