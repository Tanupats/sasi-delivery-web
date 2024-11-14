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
    messangerId,
    role,
    auth,
    staffName
  } =
    useContext(AuthData);

  const logout = () => {
    localStorage.clear()
    window.location.href = '/';
  }

  useEffect(() => {
    console.log(auth)
  }, [auth, staffName])

  return (
    <Router>


      <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top'>
        <Container fluid>
          <Navbar.Brand href="#home">SASI POS</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto text-center">
              <>
                <Link to={'/pos'} style={{ textDecoration: 'none', color: '#000' }}>
                  <ListAltIcon /> ขายอาหาร
                </Link>

                <Link to={'/report'} style={{ textDecoration: 'none', color: '#000' }}>
                  <CurrencyBitcoinIcon /> ยอดขาย
                </Link>


                <Link to={'/orders'} style={{ textDecoration: 'none', color: '#000' }}>
                  <DeliveryDiningIcon /> ออเดอร์
                </Link>


                <Link to={'/admin'} style={{ textDecoration: 'none', color: '#000' }}>
                  <StoreIcon /> จัดการร้านค้า
                </Link>

              </>

            </Nav>

            <Nav className="ml-auto">
              <Nav.Link >
                {staffName}
              </Nav.Link>
              <Nav.Link onClick={logout}>
                <LogoutIcon />  ออกจากระบบ
              </Nav.Link>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

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