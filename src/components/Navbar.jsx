import  { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthData } from "../ContextData";
import Orders from './orders';
import Login from './Login';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const NavbarMenu = () => {
  const {
    staffName
  } =
    useContext(AuthData);
  const logout = () => {
    Swal.fire({
      title: 'ต้องการออกจากระบบหรือไม่ ?',
      text: 'จะลงชื่ออกจากระบบ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
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
          <Navbar expand="lg" style={{ backgroundColor: '#FD720D' }} className='when-print ' sticky='top'>
            <Container fluid>
              <Navbar.Brand href="/pos" style={{ color: '#fff' }}>SASI Delivery</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto text-center">
                  <>            
                    <Nav.Link as={Link} to={'/orders'} style={{ textDecoration: 'none', color: '#fff' }}>
                      <DeliveryDiningIcon />  ออเดอร์จัดส่ง
                    </Nav.Link>
                  </>
                </Nav>
                <Nav className="ml-auto" >
                  <Nav.Link as={Link} to={'/profile'} style={{ textDecoration: 'none', color: '#fff' }}>
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
      </Routes>
    </Router>
  );

}

export default NavbarMenu;