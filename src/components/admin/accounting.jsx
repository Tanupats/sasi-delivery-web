import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap'
import { httpDelete, httpGet, httpPost, httpPut } from "../../http";
import { AuthData } from "../../ContextData";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from "moment";
import Swal from 'sweetalert2';
const Accounting = () => {
    const { shop } = useContext(AuthData);
    const [data, setData] = useState([]);
    const [outcome, setOutcome] = useState(0);
    const token = localStorage.getItem("token");
    const [listname, setListName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [Price, setPrice] = useState(0.0);
    const [weight, setWeight] = useState(0.0);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const { shop_id } = shop;

    const saveOutcome = async (e) => {
        e.preventDefault();
        // แปลง quantity และ Price เป็นตัวเลขทศนิยม
        const quantityValue = parseFloat(quantity);
        const priceValue = parseFloat(Price);
        // คำนวณผลรวมที่มีทศนิยม
        const sum = quantityValue * priceValue;
        // สร้าง body ที่จะส่งไปยัง API
        const body = {
            date_account: new Date(date).toISOString(),
            listname: listname,
            quantity: quantityValue,
            Price: parseFloat(priceValue),
            shop_id: shop_id,
            total: parseFloat(sum),
        };
        // ส่งข้อมูลไปยัง endpoint
        await httpPost('/account', body)
        await getData();
    };

    const getData = async () => {
        await httpGet(`/account?date=${date}&shop_id=${shop_id}`)
            .then((data) => {
                if (data) {
                    setData(data.data);
                }
            })
    }

    const deleteOutcome = async (id) => {
        try {
            // แสดง Swal เพื่อยืนยันการลบ
            const result = await Swal.fire({
                title: 'ยืนยันการลบ?',
                text: 'คุณต้องการลบข้อมูลนี้หรือไม่!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ใช่, ลบเลย!',
                cancelButtonText: 'ยกเลิก',
            });

            if (result.isConfirmed) {
                // หากผู้ใช้กดยืนยัน
                await httpDelete(`/account/${id}`);
                await getData();
                Swal.fire({
                    title: 'ลบข้อมูลสำเร็จ!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error('Error deleting the record:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบข้อมูลได้',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    const geOutcome = async () => {
        await httpGet(`/account/outcome?shop_id=${shop_id}`)
            .then(res => {
                if (res.data._sum.total !== null) {
                    setOutcome(res.data._sum.total)
                }
            })
    }

    const updateAccountId = async (id, value) => {
        await httpPut(`/account/${id}`, { listname: value })
            .then(res => {
                if (res.status === 200) {
                    getData()
                }
            })
    }

    useEffect(() => {
        getData();
    }
        , [date])

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
                <Col md={3}>
                    <Form.Label> วันที่ </Form.Label>  <Form.Control
                        value={date}
                        type="date" onChange={(e) => setDate(e.target.value)} />
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-2 mt-2">
                        <Form.Label> รายการ </Form.Label>
                        <Form.Control type="text" placeholder="รายการ" onChange={(e) => setListName(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-2 mt-2">
                        <Form.Label> จำนวน </Form.Label>
                        <Form.Control
                            value={quantity}
                            type="number"
                            placeholder="1" onChange={(e) => setQuantity(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-2 mt-2">
                        <Form.Label> ราคาต่อหน่วย </Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            pattern="^\d*\.?\d*$" 
                            placeholder="00.00"
                            onChange={(e) => {
                                const value = e.target.value;                             
                                const numericValue = parseFloat(value);
                                if (!isNaN(numericValue)) {
                                    setPrice(numericValue);
                                } else {
                                    setPrice(0);
                                }
                            }}
                        />
                    </Form.Group>

                </Col>
                <Col md={3}>   <Button type="submit" variant="primary mt-4 w-50"> บันทึก </Button></Col>
            </Row>

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
                            <TableCell align="right"> <Form.Control
                                onChange={(e) => updateAccountId(row.account_id, e.target.value)}
                                value={row.listname} />  </TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.Price}</TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right"><Button variant="danger" onClick={() => deleteOutcome(row.account_id)}> ลบ </Button></TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 p-2">
                <h5>รวมค่าใช้จ่ายทั้งหมด {outcome} บาท</h5>
            </div>

        </TableContainer>
    </>)
}
export default Accounting;