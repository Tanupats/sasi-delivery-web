import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthData } from "../ContextData";
import FoodMenu from './FoodMenu';
import Myorder from './Myorder';
import GetQueu from './GetQueu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { ShoppingCart, Receipt, AccountCircle } from "@mui/icons-material";
import Cart from './Cart';

const NavbarMenu = () => {
  const { toTal,
    queue,
  } =
    useContext(AuthData);

  const [value, setValue] = useState(0);
  const id = localStorage.getItem("messangerId")
  const name = localStorage.getItem("name")
  const shop_id = localStorage.getItem("shop_id")

  return (
    <Router>
      <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top' expand="lg">
        <Container fluid>
          <Navbar.Brand href="#home" style={{ color: '#FD720D', fontWeight: 500 }}>SASI Delivery</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto text-center">
              <Nav.Link>
                <Link style={{ textDecoration: 'none', color: '#000' }} to={`/foodmenu/${id}/${name}/${shop_id}`}>
                  <RestaurantMenuIcon style={{ color: '#FD720D' }} /> เมนู
                </Link>
              </Nav.Link>
              <Nav.Link >
                <Link style={{ textDecoration: 'none', color: '#000', }} to={'/cart'}>
                  ตะกร้า  <LocalMallIcon style={{ color: '#FD720D' }} /> {toTal}  </Link>
              </Nav.Link>
              <Nav.Link>
                <Link style={{ textDecoration: 'none', color: '#000' }} to={'/Myorder'}>
                  <AccountBoxIcon style={{ color: '#FD720D' }} /> คำสั่งซื้อ
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link style={{ textDecoration: 'none', color: '#000' }} to={'/queueNumber'}>
                  <AddToQueueIcon style={{ color: '#FD720D' }} /> คิวทั้งหมด {queue}
                </Link>
              </Nav.Link>
            </Nav>
            {
              name !== null && (
                <Nav className="ml-auto">
                  <Nav.Link >
                    {name}
                  </Nav.Link>
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
        zIndex: 1000,
      }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
        >
          <BottomNavigation showLabels value={value}>
            <BottomNavigationAction
              onClick={() => setValue(0)}
              label="เมนู" icon={<MenuBookIcon />}
              component={Link} to={`/foodmenu/${id}/${name}/${shop_id}`} />
            <BottomNavigationAction onClick={() => setValue(1)} label="คำสั่งซื้อ" icon={<Receipt />} component={Link} to="/Myorder" />
            <BottomNavigationAction onClick={() => setValue(2)} label={"ตะกร้า " + toTal} icon={<ShoppingCart />} component={Link} to="/cart" />
            <BottomNavigationAction onClick={() => setValue(3)} label="โปรไฟล์" icon={<AccountCircle />} component={Link} to="/profile" />
          </BottomNavigation>
        </BottomNavigation>
      </Paper>

      <Routes>
        <Route path="/foodmenu/:userid/:name/:shop_id" Component={FoodMenu}></Route>
        <Route path="/Myorder" Component={Myorder}></Route>
        <Route path="/queueNumber" Component={GetQueu}></Route>
        <Route path="/cart" Component={Cart}></Route>
      </Routes>
    </Router>
  );

}

export default NavbarMenu;