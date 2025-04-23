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
    queue
  } =
    useContext(AuthData);


  return (
    <Router>
      <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top'>
        <Container fluid>
          <Navbar.Brand href="#home">SASI MENU  คิวทั้งหมด {queue}</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">



          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Routes>
        <Route path="/" Component={FoodMenu}></Route>
      </Routes>
    </Router>
  );

}

export default NavbarMenu;