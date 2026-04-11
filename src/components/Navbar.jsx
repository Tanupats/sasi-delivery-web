import { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { AuthData } from "../ContextData";

import FoodMenu from "./FoodMenu";
import Orders from "./orders";
import GetQueu from "./GetQueu";
import Pos from "./Pos";
import Report from "./report";
import Login from "./Login";
import Admin from "./admin";
import Profile from "./profile";
import Register from "./Register";

import Swal from "sweetalert2";

import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import AssessmentIcon from "@mui/icons-material/Assessment";

const NavbarMenu = () => {
  const { staffName, shop } = useContext(AuthData);
  const [openMenu, setOpenMenu] = useState(false);

  const logout = () => {
    Swal.fire({
      title: "ต้องการออกจากระบบหรือไม่ ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "/";
      }
    });
  };

  return (
    <Router>
      {staffName && (
        <Navbar style={{ background: "#FD720D" }} sticky="top">
          <Container fluid className="px-2">

            {/* MOBILE MENU */}
            <div className="d-lg-none">
              <MenuIcon
                style={{ color: "#fff", cursor: "pointer", marginRight: 8 }}
                onClick={() => setOpenMenu(true)}
              />
            </div>

            <Navbar.Brand style={{ color: "#fff", marginRight: 10 }}>
              SASI POS
            </Navbar.Brand>

            {/* DESKTOP MENU */}
            <Nav className="d-none d-lg-flex">

              <Nav.Link as={Link} to="/pos" style={{ color: "#fff" }}>
                <ListAltIcon style={{ marginRight: 4 }} /> ขายสินค้า
              </Nav.Link>

              <Nav.Link as={Link} to="/orders" style={{ color: "#fff" }}>
                <ViewQuiltIcon style={{ marginRight: 4 }} /> ออเดอร์
              </Nav.Link>

              <Nav.Link as={Link} to="/report" style={{ color: "#fff" }}>
                <AssessmentIcon style={{ marginRight: 4 }} /> สรุปยอดขาย
              </Nav.Link>

              <Nav.Link as={Link} to="/admin" style={{ color: "#fff" }}>
                <StoreIcon style={{ marginRight: 4 }} /> จัดการ{shop?.name}
              </Nav.Link>

              <Nav.Link as={Link} to="/profile" style={{ color: "#fff" }}>
                <AccountCircleIcon style={{ marginRight: 4 }} /> {staffName}
              </Nav.Link>

              <Nav.Link onClick={logout} style={{ color: "#fff" }}>
                <LogoutIcon style={{ marginRight: 4 }} /> ออกจากระบบ
              </Nav.Link>

            </Nav>
          </Container>
        </Navbar>
      )}

      {/* MOBILE OVERLAY */}
      {openMenu && (
        <div
          className="overlay d-lg-none"
          onClick={() => setOpenMenu(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div className={`sidebar d-lg-none ${openMenu ? "show" : ""}`}>
        <Nav className="flex-column">

          <Nav.Link as={Link} to="/pos" onClick={() => setOpenMenu(false)}>
            <ListAltIcon /> ขายสินค้า
          </Nav.Link>

          <Nav.Link as={Link} to="/orders" onClick={() => setOpenMenu(false)}>
            <ViewQuiltIcon /> จัดการออเดอร์
          </Nav.Link>

          <Nav.Link as={Link} to="/report" onClick={() => setOpenMenu(false)}>
            <AssessmentIcon /> สรุปยอดขาย
          </Nav.Link>

          <Nav.Link as={Link} to="/admin" onClick={() => setOpenMenu(false)}>
            <StoreIcon /> จัดการข้อมูล
          </Nav.Link>

          <Nav.Link as={Link} to="/profile" onClick={() => setOpenMenu(false)}>
            <AccountCircleIcon /> {staffName}
          </Nav.Link>

          <Nav.Link onClick={logout}>
            <LogoutIcon /> ออกจากระบบ
          </Nav.Link>

        </Nav>
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/queueNumber" element={<GetQueu />} />
        <Route path="/foodMenu/:userid/:username" element={<FoodMenu />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/report" element={<Report />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default NavbarMenu;