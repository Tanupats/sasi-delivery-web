import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FoodMenu from './FoodMenu';

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const NavbarMenu = () => {

  return (
    <Router>

      <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top' expand="lg">
        <Container fluid>
          
          <Navbar.Brand href="#home">SASI </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto text-center">
          
                <>
                  <Nav.Link>
                    <Link style={{ textDecoration: 'none', color: '#000' }} to={`/`}>
                      <RestaurantMenuIcon /> เมนูอาหาร
                    </Link>
                  </Nav.Link>
                </>
             

            </Nav>
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