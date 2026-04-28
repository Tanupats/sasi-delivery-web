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
import DeleteIcon from '@mui/icons-material/Delete';
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
    const [tempItems, setTempItems] = useState([]);
    const { shop_id } = shop;

    const addItem = (e) => {
        e.preventDefault();
        if (!listname || quantity <= 0 || Price <= 0) {
            Swal.fire({
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกรายการ จำนวน และราคาให้ครบถ้วน',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
            });
            return;
        }
        const quantityValue = parseFloat(quantity);
        const priceValue = parseFloat(Price);
        const sum = quantityValue * priceValue;
        
        const newItem = {
            listname: listname,
            quantity: quantityValue,
            Price: priceValue,
            total: sum,
            date_account: new Date(date).toISOString(),
            shop_id: shop_id,
        };
        
        setTempItems([...tempItems, newItem]);
        setListName("");
        setQuantity(1);
        setPrice(0);
    };

    const removeTempItem = (index) => {
        const updated = tempItems.filter((_, i) => i !== index);
        setTempItems(updated);
    };

    const saveAllOutcome = async () => {
        if (tempItems.length === 0) {
            Swal.fire({
                title: 'ไม่มีรายการ',
                text: 'กรุณาเพิ่มรายการก่อน',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
            });
            return;
        }

        try {
            for (const item of tempItems) {
                await httpPost('/account', item);
            }
            Swal.fire({
                title: 'บันทึกข้อมูลสำเร็จ!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
            setTempItems([]);
            await getData();
        } catch (error) {
            console.error('Error saving records:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    const getData = async () => {
        let total = 0;
        await httpGet(`/account?date=${date}&shop_id=${shop_id}`)
            .then((data) => {
                if (data) {
                    setData(data.data);
                    data.data.map((item) => {

                        total += parseFloat(item.total);
                    })
                    setOutcome(total);
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
    }, [])

    useEffect(() => {
        getData();
    }
        , [date])




    return (<>
        <div className="container" >

        <Form onSubmit={(e) => addItem(e)} className="mt-4">
            <Row>
                <Col md={3}>
                    <Form.Label> วันที่ </Form.Label>  <Form.Control
                        value={date}
                        type="date" onChange={(e) => setDate(e.target.value)} />
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-2 mt-2">
                        <Form.Label> รายการ </Form.Label>
                        <Form.Control type="text" value={listname} placeholder="รายการ" onChange={(e) => setListName(e.target.value)} />
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
                            value={Price}
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
                <Col md={6}>   <Button type="submit" variant="primary mt-4 w-50"> เพิ่มรายการ </Button></Col>
            </Row>

        </Form>

        {tempItems.length > 0 && (
            <TableContainer component={Paper} className="mt-3">
                <h6 className="p-3">รายการที่เพิ่มเพื่อบันทึก ({tempItems.length} รายการ)</h6>
                <Table sx={{ minWidth: 650, "& td, & th": { border: "1px solid #999" } }} aria-label="temp items table">
                    <TableHead sx={{ backgroundColor: '#707070' }}>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }}>ลำดับ</TableCell>
                            <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">รายการ</TableCell>
                            <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">จำนวน</TableCell>
                            <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">ราคา</TableCell>
                            <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">รวมเป็นเงิน</TableCell>
                            <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tempItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell align="left">{item.listname}</TableCell>
                                <TableCell align="left">{item.quantity}</TableCell>
                                <TableCell align="left">{item.Price}</TableCell>
                                <TableCell align="left">{item.total}</TableCell>
                                <TableCell align="left">
                                    <Button variant="danger" size="sm" onClick={() => removeTempItem(index)}>
                                        <DeleteIcon sx={{ fontSize: '18px' }} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {tempItems.length > 0 && (
                            <TableRow sx={{ backgroundColor: '#e8e8e8' }}>
                                <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#303030' }}>
                                    ยอดรวมทั้งหมด:
                                </TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#ff6b6b' }}>
                                    {tempItems.reduce((sum, item) => sum + item.total, 0)} บาท
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="p-3">
                    <Button variant="success" onClick={saveAllOutcome} className="me-2">
                        บันทึกข้อมูล
                    </Button>
                    <Button variant="secondary" onClick={() => setTempItems([])}>
                        ยกเลิก
                    </Button>
                </div>
            </TableContainer>
        )}


        <TableContainer component={Paper} className="mt-3 mb-5">
            <h6 className="p-3  text-center">ข้อมูลค่าใช้จ่าย</h6>
            <Table sx={{ minWidth: 650, "& td, & th": { border: "1px solid #999" } }} aria-label="saved data table">
                <TableHead sx={{ backgroundColor: '#cacaca' }}>
                    <TableRow className="text-left">
                        <TableCell  colSpan={1}  sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }}>ลำดับ</TableCell>
                        <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">วันที่</TableCell>
                        <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">รายการ</TableCell>
                        <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">จำนวน</TableCell>
                        <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">ราคา</TableCell>
                        <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">รวมเป็นเงิน</TableCell>
                        <TableCell sx={{ backgroundColor: '#d6d6d6', color: '#303030', fontSize: '16px', fontWeight: 'bold' }} align="left">จัดการ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.length > 0 && data?.map((row, index) => (
                        <TableRow
                            key={row.account_id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" colSpan={1}  sx={{ backgroundColor: '#f0f0f0', color: '#202020', fontSize: '14px' }}>
                                {index + 1}
                            </TableCell>
                            <TableCell align="left">{moment(row.date_account).format('YYYY-MM-DD')}</TableCell>
                            <TableCell align="left">
                               {row.listname} </TableCell>
                            <TableCell align="left">{row.quantity}</TableCell>
                            <TableCell align="left">{row.Price}</TableCell>
                            <TableCell align="left">{row.total}</TableCell>
                            <TableCell align="left"><Button variant="danger" onClick={() => deleteOutcome(row.account_id)}><DeleteIcon sx={{ fontSize: '18px' }} /></Button></TableCell>
                        </TableRow> 


                    ))}
                    {data?.length > 0 && (
                        <TableRow sx={{ backgroundColor: '#e8e8e8' }}>
                            <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#303030' }}>
                                ค่าใช้จ่ายทั้งหมด:
                            </TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#ff6b6b' }}>
                                {outcome} บาท
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </TableContainer>
        </div>
    </>)
}
export default Accounting;