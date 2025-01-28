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
import Swal from 'sweetalert2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const NavbarMenu = () => {
  const {
    staffName,
    user,
    shop
  } =
    useContext(AuthData);


  const logout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = '/';
      }
    });
  };



  return (
    <Router>



      {

        staffName !== null && (



          <Navbar style={{ backgroundColor: '#FD720D' }} className='when-print ' sticky='top'>
            <Container fluid>
              <Navbar.Brand href="/pos" style={{color:'#fff'}}>SASI POS</Navbar.Brand>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto text-center">
                  <>
                    <Link to={'/pos'} style={{ textDecoration: 'none', color: '#fff' }}>
                      &nbsp;  <ListAltIcon /> ขายอาหาร
                    </Link>

                    <Link to={'/report'} style={{ textDecoration: 'none', color: '#fff' }}>
                      &nbsp;  <CurrencyBitcoinIcon /> ยอดขาย
                    </Link>


                    <Link to={'/orders'} style={{ textDecoration: 'none', color: '#fff' }}>
                      &nbsp;   <DeliveryDiningIcon />  ออเดอร์
                    </Link>


                    <Link to={'/admin'} style={{ textDecoration: 'none', color: '#fff' }}>
                      &nbsp; <StoreIcon />  {shop?.name}
                    </Link>
                    {/* <Link to={'/admin'} style={{ textDecoration: 'none', color: '#fff' }}>
                      &nbsp; <StoreIcon />  FaceBookPage
                    </Link> */}

                  </>

                </Nav>

                <Nav className="ml-auto" >
                  <Nav.Link style={{ textDecoration: 'none', color: '#fff' }}>
                    < AccountCircleIcon />  {staffName}
                  </Nav.Link>
                  <Nav.Link onClick={logout} style={{ textDecoration: 'none', color: '#fff' }}>
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