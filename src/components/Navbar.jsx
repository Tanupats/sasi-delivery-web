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
import Pos from './Pos';
import Report from './report';
import Login from './Login';
import Admin from './admin';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import Register from './Register';
const NavbarMenu = () => {
  const { toTal,
    cart,
    sumPrice,
    removeCart,
    saveOrder,
    updateNote,
    messangerId,
    queue,
    role,
    auth,
    staffName
  } =
    useContext(AuthData);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSave = () => {
    saveOrder()
    handleClose()
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/';
  }


  useEffect(() => {
    console.log(auth)
  }, [auth, staffName])

  return (
    <Router>

      {
        auth === 'authenticated' && (

          <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top' expand="lg">
            <Container fluid>
              {
                role === 'admin' || 'manager' && (<Navbar.Brand href="#home">SASI POS</Navbar.Brand>)
              }
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto text-center">
                  {role === 'user' && (
                    <>
                      <Nav.Link>
                        <Link style={{ textDecoration: 'none', color: '#000' }} to={`/foodMenu/${messangerId}/${name}`}>
                          <RestaurantMenuIcon /> เมนูอาหาร
                        </Link>
                      </Nav.Link>
                      <Nav.Link onClick={handleShow}>
                        <LocalMallIcon /> {toTal}
                      </Nav.Link>
                      <Nav.Link>
                        <Link style={{ textDecoration: 'none', color: '#000' }} to={'/Myorder'}>
                          <AccountBoxIcon /> คำสั่งซื้อ
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link style={{ textDecoration: 'none', color: '#000' }} to={'/queueNumber'}>
                          <AddToQueueIcon /> คิวตอนนี้ {queue}
                        </Link>
                      </Nav.Link>
                    </>
                  )}
                  {role === 'admin' || 'manager' && (
                    <>
                      <Nav.Link>
                        <Link to={'/pos'} style={{ textDecoration: 'none', color: '#000' }}>
                          <ListAltIcon /> ขายอาหาร
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link to={'/report'} style={{ textDecoration: 'none', color: '#000' }}>
                          <CurrencyBitcoinIcon /> ยอดขาย
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link to={'/orders'} style={{ textDecoration: 'none', color: '#000' }}>
                          <DeliveryDiningIcon /> การจัดส่ง
                        </Link>
                      </Nav.Link>
                      <Nav.Link>
                        <Link to={'/admin'} style={{ textDecoration: 'none', color: '#000' }}>
                          <StoreIcon /> จัดการร้านค้า
                        </Link>
                      </Nav.Link>
                    </>
                  )}
                </Nav>
                {role === 'admin' || 'manager' && (
                  <Nav className="ml-auto">
                    <Nav.Link >
                      {staffName}
                    </Nav.Link>
                    <Nav.Link onClick={logout}>
                      <LogoutIcon />  ออกจากระบบ
                    </Nav.Link>
                  </Nav>
                )}
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}

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
                              src={`${import.meta.env.VITE_BASE_URL}/img/${item.photo}`} />
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
      <Routes>
        <Route path="/" Component={Login}></Route>
        <Route path="/orders" Component={Orders}></Route>
        <Route path="/foodMenu/:userid/:username" Component={FoodMenu}></Route>
        <Route path="/Myorder" Component={Myorder}></Route>
        <Route path="/queueNumber" Component={GetQueu}></Route>
        <Route path="/pos" Component={Pos}></Route>
        <Route path="/report" Component={Report}></Route>
        <Route path="/admin" Component={Admin}></Route>
        <Route path="/register" Component={Register}></Route>
      </Routes>
    </Router>
  );

}

export default NavbarMenu;