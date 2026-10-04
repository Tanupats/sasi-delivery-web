import  { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import Orders from './orders';
import Login from './Login';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { httpGet } from "../http";
const NavbarMenu = () => {
  const role = localStorage.getItem("role");
  const hasRiderSession = Boolean(localStorage.getItem("token")) && role?.trim().toLowerCase() === "rider";
  const shopId = localStorage.getItem("shopId");
  const [shopName, setShopName] = useState(localStorage.getItem("shopName") || "");
  const {
    staffName
  } =
    useContext(AuthData);

  useEffect(() => {
    if (!hasRiderSession || !shopId) return;

    httpGet(`/shop/${shopId}`)
      .then((res) => {
        const shop = Array.isArray(res.data) ? res.data[0] : res.data;
        const name = shop?.shop_name ?? shop?.shopname ?? shop?.shopName ?? shop?.name;
        if (name) {
          setShopName(name);
          localStorage.setItem("shopName", name);
        }
      })
      .catch(() => {});
  }, [hasRiderSession, shopId]);

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
        hasRiderSession && staffName !== null && (
          <Navbar expand="lg" style={{ backgroundColor: '#FD720D' }} className='when-print ' sticky='top'>
            <Container fluid>
              <Navbar.Brand href="/pos" style={{ color: '#fff' }}>SASI RIDER</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto text-center">
                  <>            
                    <Nav.Link as={Link} to={'/orders'} className="rider-orders-link" style={{ textDecoration: 'none', color: '#fff' }}>
                      <DeliveryDiningIcon />
                      <span className="rider-orders-label">
                        ออเดอร์จัดส่ง
                      
                      </span>
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
        <Route path="/orders" element={hasRiderSession ? <Orders /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );

}

export default NavbarMenu;