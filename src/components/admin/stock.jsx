import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { httpDelete, httpGet, httpPost, httpPut } from "../../http";
import moment from "moment";
const Stock = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [item, setIem] = useState(1);

    const getData = async () => {
        await httpGet('/stock')
            .then((data) => {
                if (data) {
                    setData(data.data);
                }
            })
    }

    const postData = async () => {
        const body = {
            name: name,
            product_id: "",
            shop_id: "",
            stock_quantity: parseInt(item)
        }
        await httpPost('/stock', body)
            .then((res) => {
                if (res.status === 200) {
                    getData();
                }
            })
    }

    const updateData = async (quantity, id) => {
        const body = {
            stock_quantity: parseInt(quantity)
        }
        await httpPut('/stock/' + id, body)
            .then((res) => {
                if (res) {
                    getData();
                }
            })
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Card className="mt-4">


                <Card.Body>
                    <Card.Title> จัดการสต๊อกสินค้า</Card.Title>   <Form>
                        <Row>

                            <Col md={4}>
                                <Form.Label>
                                    รายการ
                                </Form.Label>
                                <Form.Control
                                    onChange={(e) => setName(e.target.value)}
                                    type="text" placeholder="ชื่อสินค้า" />



                            </Col>
                            <Col md={4}>
                                <Form.Label>
                                    จำนวน
                                </Form.Label>
                                <Form.Control
                                    onChange={(e) => setIem(e.target.value)}
                                    type="text"
                                    placeholder="จำนวนสต็อก" />



                            </Col>
                            <Col md={12} className="mt-3 ">
                                <Button onClick={() => postData()}> บันทึก </Button>
                            </Col>
                        </Row> </Form>
                    <TableContainer component={Paper} className="mt-3">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ลำดับ</TableCell>
                                    <TableCell align="center">รายการ</TableCell>
                                    <TableCell align="center">วันที่</TableCell>

                                    <TableCell align="center">จำนวน</TableCell>
                                    <TableCell align="center">จัดการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.length > 0 && data?.map((row) => (
                                    <TableRow
                                        key={row.account_id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>   <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{moment(row.created).format('YYYY-MM-DD')}</TableCell>

                                        <TableCell align="center">
                                            <Form.Control type="number"
                                                onChange={(e) => updateData(e.target.value, row.id)}
                                                value={row.stock_quantity} />
                                        </TableCell>
                                        <TableCell align="center"> <Button >ลบ</Button></TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>
                </Card.Body>
            </Card>


        </>
    )

}
export default Stock;