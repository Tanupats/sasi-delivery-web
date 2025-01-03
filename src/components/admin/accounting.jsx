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
    const { user } = useContext(AuthData);
    const [data, setData] = useState([]);
    const [outcome, setOutcome] = useState(0);
    const token = localStorage.getItem("token");
    const [listname, setListName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [Price, setPrice] = useState(0.0);
    const [weight, setWeight] = useState(0.0);
    
    const saveOutcome = async (e) => {
        e.preventDefault();
        const { shop_id } = user?.shop;
        let sum = (quantity * Price);
        const body = {
            date_account: new Date().toISOString(),
            listname: listname,
            quantity: parseInt(quantity),
            Price: parseFloat(Price),
            shop_id: shop_id,
            total: sum
        }
        await httpPost('/account', body);
        await getData();
    }

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
                setOutcome(res._sum.total)
            })
    }

    useEffect(() => {
        geOutcome()
    }
        , [data])
    useEffect(() => {
        getData();

    }
        , [])
    return (<>

        <Form onSubmit={(e) => saveOutcome(e)}>

            <Form.Group className="mb-2">
                <Form.Label> รายการ </Form.Label>
                <Form.Control type="text" placeholder="รายการ" onChange={(e) => setListName(e.target.value)} />

            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label> จำนวน </Form.Label>
                <Form.Control type="number" placeholder="จำนวน" onChange={(e) => setQuantity(e.target.value)} />


            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label> ราคา </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ราคา"
                    onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
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