import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Navbar, Nav, } from 'react-bootstrap'
import axios from "axios";
import moment from "moment";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FoodMenuAdmin from "./FoodMenuAdmin";
const Admin = () => {

    const [listname, setListName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [Price, setPrice] = useState("");
    const [openMenu, setOpenMenu] = useState("เมนูอาหาร");
    const [data, setData] = useState([]);

    const getData = async () => {

        await fetch(`${import.meta.env.VITE_BAKUP_URL}/account`)
            .then((res) => res.json())
            .then((data) => {

                if (data) {

                    setData(data);
                }
            })
    }

    const saveOutcome = async (e) => {
        e.preventDefault();
        let sum = quantity * Price;

        const body = {
            date_account: new Date().toISOString(),
            listname: listname,
            quantity: parseInt(quantity),
            Price: Price,
            total: sum
        }

        await axios.post(`${import.meta.env.VITE_BAKUP_URL}/account`, body,)
        await getData()

    }
    const handleNavClick = (event) => {
        const menuText = event.currentTarget.textContent;
        setOpenMenu(menuText);
    };
    useEffect(() => {
        getData()
    }
        , [])
    useEffect(() => {

    }
        , [openMenu])

    return (
        <Row>

            <Col md={3}>
                <Navbar expand="lg" className="flex-column vh-100">
                    <Navbar.Brand href="#">จัดการร้านค้า</Navbar.Brand>
                    <Nav className="flex-column w-100">
                        <Nav.Link onClick={handleNavClick}>เมนูอาหาร</Nav.Link>
                        <Nav.Link onClick={handleNavClick}>บัญชี</Nav.Link>
                        <Nav.Link onClick={handleNavClick}>สรุปยอดขาย</Nav.Link>
                        <Nav.Link onClick={handleNavClick}>พนักงาน</Nav.Link>
                    </Nav>
                </Navbar>

            </Col>
            <Col md={8}>

                {
                    openMenu === "เมนูอาหาร" && (

                            <FoodMenuAdmin />
                    )
                }
                {
                    openMenu === "บัญชี" && (<>

                        <Form onSubmit={(e) => saveOutcome(e)}>

                            <Form.Group>
                                <Form.Label> รายการ </Form.Label>
                                <Form.Control type="text" placeholder="รายการ" onChange={(e) => setListName(e.target.value)} />

                            </Form.Group>
                            <Form.Group>
                                <Form.Label> จำนวน </Form.Label>
                                <Form.Control type="number" placeholder="จำนวน" onChange={(e) => setQuantity(e.target.value)} />

                            </Form.Group>
                            <Form.Group>
                                <Form.Label> ราคา </Form.Label>
                                <Form.Control type="text" placeholder="ราคา" onChange={(e) => setPrice(e.target.value)} />

                            </Form.Group>
                            <Button type="submit" variant="primary mt-4 w-50"> บันทึก </Button>
                        </Form>  <TableContainer component={Paper} className="mt-3">
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>รหัสรายการ</TableCell>
                                        <TableCell align="right">วันที่</TableCell>
                                        <TableCell align="right">รายการ</TableCell>
                                        <TableCell align="right">จำนวน</TableCell>
                                        <TableCell align="right">ราคา</TableCell>
                                        <TableCell align="right">รวมเป็นเงิน</TableCell>
                                        <TableCell align="right">จัดการ</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.length > 0 && data?.map((row) => (
                                        <TableRow
                                            key={row.account_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.account_id}
                                            </TableCell>
                                            <TableCell align="right">{row.date_account}</TableCell>
                                            <TableCell align="right">{row.listname}</TableCell>
                                            <TableCell align="right">{row.quantity}</TableCell>
                                            <TableCell align="right">{row.Price}</TableCell>
                                            <TableCell align="right">{row.total}</TableCell>


                                        </TableRow>

                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <h5>รวมทั้งหมด</h5>
                            </div>

                        </TableContainer>
                    </>)
                }





            </Col>

        </Row>)
}

export default Admin;