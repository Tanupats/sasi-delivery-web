import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LocalMallIcon from '@mui/icons-material/LocalMall';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthData } from "../ContextData";
import FoodMenu from './FoodMenu';
import Myorder from './Myorder';
import Orders from './orders';
import GetQueu from './GetQueu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import Report from './report';
import Login from './Login';
import Admin from './admin';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2'
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home, ShoppingCart, Receipt, AccountCircle } from "@mui/icons-material";
import Cart from './Cart';
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
    name
  } =
    useContext(AuthData);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [value, setValue] = useState(0);

  const logout = () => {
    localStorage.clear()
    window.location.href = '/';
  }


  useEffect(() => {
    console.log(name)
  }, [name])

  return (
    <Router>



      <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top' expand="lg">
        <Container fluid>
          <Navbar.Brand href="#home">SASI  คิวตอนนี้ {queue}</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto text-center">
              <Nav.Link>
                <Link style={{ textDecoration: 'none', color: '#000' }} to={`/foodmenu`}>
                  <RestaurantMenuIcon /> เมนูอาหาร
                </Link>
              </Nav.Link>
              <Nav.Link >
                <Link style={{ textDecoration: 'none', color: '#000' }} to={'/cart'}>
                  
                  ตะกร้า  <LocalMallIcon /> {toTal}  </Link>
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
            </Nav>

            {
              name !== null && (
                <Nav className="ml-auto">
                  <Nav.Link >
                    {name}
                  </Nav.Link>
                  {/* <Nav.Link onClick={logout}>
                    <LogoutIcon />  ออกจากระบบ
                  </Nav.Link> */}
                </Nav>

              )
            }

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Paper sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000, // ทำให้แน่ใจว่ามันอยู่บนสุด
      }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}

        >
          <BottomNavigation showLabels value={value}>
            <BottomNavigationAction label="เมนู" icon={<Home />} component={Link} to="/foodmenu" />
            <BottomNavigationAction label="คำสั่งซื้อ" icon={<Receipt />} component={Link} to="/Myorder" />
            <BottomNavigationAction label={"ตะกร้า "+toTal} icon={<ShoppingCart />} component={Link} to="/cart" />
            <BottomNavigationAction label="โปรไฟล์" icon={<AccountCircle />} component={Link} to="/profile" />
          </BottomNavigation>
        </BottomNavigation>
      </Paper>

      <Routes>
        <Route path="/" Component={Login}></Route>
        <Route path="/orders" Component={Orders}></Route>
        <Route path="/foodmenu/:userid/:name" Component={FoodMenu}></Route>
        <Route path="/Myorder" Component={Myorder}></Route>
        <Route path="/queueNumber" Component={GetQueu}></Route>
        <Route path="/report" Component={Report}></Route>
        <Route path="/admin" Component={Admin}></Route>
        <Route path="/register" Component={Register}></Route>
        <Route path="/cart" Component={Cart}></Route>
      </Routes>
    </Router>
  );

}

export default NavbarMenu;