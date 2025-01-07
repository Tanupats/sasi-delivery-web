import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button, Navbar, Nav, Card } from 'react-bootstrap'
import { httpDelete, httpGet, httpPost } from "../../http";
import { AuthData } from "../../ContextData";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from "moment";
const Accounting = () => {
    const { shop } = useContext(AuthData);
    const [data, setData] = useState([]);
    const [outcome, setOutcome] = useState(0);
    const token = localStorage.getItem("token");
    const [listname, setListName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [Price, setPrice] = useState(0.0);
    const [weight, setWeight] = useState(0.0);

    const saveOutcome = async (e) => {
        e.preventDefault();
        const { shop_id } = shop;

        // แปลง quantity และ Price เป็นตัวเลขทศนิยม
        const quantityValue = parseFloat(quantity);
        const priceValue = parseFloat(Price);

        // คำนวณผลรวมที่มีทศนิยม
        const sum = quantityValue * priceValue;

        // สร้าง body ที่จะส่งไปยัง API
        const body = {
            date_account: new Date().toISOString(),
            listname: listname,
            quantity: quantityValue,
            Price: parseFloat(priceValue),
            shop_id: shop_id,
            total:parseFloat(sum) ,
        };

        // ส่งข้อมูลไปยัง endpoint
        await httpPost('/account', body);
        await getData();
    };

    const getData = async () => {
        await httpGet('/account')
            .then((data) => {
                if (data) {
                    setData(data.data);
                }
            })
    }

    const deleteOutcome = async (id) => {
        try {
            await httpDelete(`/account/${id}`);
            await getData();
        } catch (error) {
            console.error("Error deleting the record:", error);
        }
    }

    const geOutcome = async () => {
        await httpGet(`/account/outcome`)
            .then(res => {
                setOutcome(res.data._sum.total)
            })
    }


    useEffect(() => {
        getData();
        geOutcome()
    }
        , [])
    useEffect(() => {
       
        geOutcome()
    }
        , [data])
    return (<>

        <Form onSubmit={(e) => saveOutcome(e)} className="mt-4">
            <Row>

                <Col>
                    <Form.Group className="mb-2">
                        <Form.Label> รายการ </Form.Label>
                        <Form.Control type="text" placeholder="รายการ" onChange={(e) => setListName(e.target.value)} />

                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-2">
                        <Form.Label> จำนวน </Form.Label>
                        <Form.Control
                            value={quantity}
                            type="number"
                            placeholder="1" onChange={(e) => setQuantity(e.target.value)} />


                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-2">
                        <Form.Label> ราคา </Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            pattern="^\d*\.?\d*$" // อนุญาตเฉพาะตัวเลขและจุดทศนิยม
                            placeholder="00.00 บาท"
                            onChange={(e) => {
                                const value = e.target.value;
                                // แปลงค่าเป็นตัวเลขแบบทศนิยม
                                const numericValue = parseFloat(value);
                                if (!isNaN(numericValue)) {
                                    setPrice(numericValue);
                                } else {
                                    setPrice(0); // กำหนดค่าเริ่มต้นหากป้อนไม่ถูกต้อง
                                }
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>



            <Button type="submit" variant="primary mt-4 w-50"> บันทึก </Button>
        </Form>

        <TableContainer component={Paper} className="mt-3">
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
                            <TableCell align="right">{moment(row.date_account).format('YYYY-MM-DD')}</TableCell>
                            <TableCell align="right">{row.listname}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.Price}</TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right"><Button variant="danger" onClick={() => deleteOutcome(row.account_id)}> ลบ </Button></TableCell>


                        </TableRow>

                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 p-2">
                <h5>รวมทั้งหมด {outcome}      บาท</h5>
            </div>

        </TableContainer>
    </>)
}
export default Accounting;