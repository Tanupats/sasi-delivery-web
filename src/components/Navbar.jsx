import React, { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthData } from "../ContextData";
import FoodMenu from './FoodMenu';
import Myorder from './Myorder';
import Orders from './orders';
import GetQueu from './GetQueu';
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
  const {
    auth,
    staffName,
    user
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



      {

        staffName !== "" && (



          <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top'>
            <Container fluid>
              <Navbar.Brand href="#home">SASI Delivery</Navbar.Brand>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto text-center">
                  <>
                    <Link to={'/foodMenu/123/music'} style={{ textDecoration: 'none', color: '#000' }}>
                      <ListAltIcon /> รายการ
                    </Link>

                    <Link to={'/report'} style={{ textDecoration: 'none', color: '#000' }}>
                      <CurrencyBitcoinIcon /> คำสั่งซื้อ
                    </Link>

                    <Link to={'/orders'} style={{ textDecoration: 'none', color: '#000' }}>
                      &nbsp; <DeliveryDiningIcon />  ออเดอร์ส่ง
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
        )
      }

      <Routes>
        <Route path="/" Component={Login}></Route>
        <Route path="/orders" Component={Orders}></Route>
        <Route path="/Myorder" Component={Myorder}></Route>
        <Route path="/queueNumber" Component={GetQueu}></Route>
        <Route path="/foodMenu/:userid/:username" Component={FoodMenu}></Route>
        <Route path="/pos" Component={Pos}></Route>
        <Route path="/report" Component={Report}></Route>
        <Route path="/admin" Component={Admin}></Route>
        <Route path="/register" Component={Register}></Route>
      </Routes>
    </Router>
  );

}

export default NavbarMenu;