import React,{useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FoodMenu from './FoodMenu';
import { AuthData } from '../ContextData';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GetQueu from './GetQueu';

const NavbarMenu = () => {
  
  const {queue} =useContext(AuthData);
  return (
    <Router>

      <Navbar bg="light" data-bs-theme="light" className='when-print' sticky='top' expand="lg">
        <Container fluid>
          
          <Navbar.Brand href="#home">SASI  คิวตอนนี้ {queue}</Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto text-center">
          
                <>
                  <Nav.Link>
                    <Link style={{ textDecoration: 'none', color: '#000' }} to={`/`}>
                     คิวตอนนี้ {queue}
                    </Link>
                  </Nav.Link>
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
        <Route path="/queueNumber" Component={GetQueu}></Route>
      </Routes>
    </Router>
  );

}

export default NavbarMenu;