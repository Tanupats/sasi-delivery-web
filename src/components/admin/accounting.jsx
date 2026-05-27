import React, { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap'
import { http } from "../../http";
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
    const [Price, setPrice] = useState("");
    const [weight, setWeight] = useState(0.0);
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [tempItems, setTempItems] = useState([]);
    const { shop_id } = shop;
    const listnameInputRef = useRef(null);

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
                await http.post('/account', item);
            }
            Swal.fire({
                title: 'บันทึกข้อมูลสำเร็จ!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              
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
        await http.get(`/account?date=${date}&shop_id=${shop_id}`)
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
                await http.delete(`/account/${id}`);
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
        await http.get(`/account/outcome?shop_id=${shop_id}`)
            .then(res => {
                if (res.data._sum.total !== null) {
                    setOutcome(res.data._sum.total)
                }
            })
    }

    const updateAccountId = async (id, value) => {
        await http.put(`/account/${id}`, { listname: value })
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
    }, [date])

    useEffect(() => {
        if (listname === "" && listnameInputRef.current) {
            listnameInputRef.current.focus();
            listnameInputRef.current.select();
        }
    }, [listname])




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
                        <Form.Control 
                            ref={listnameInputRef}
                            type="text" 
                            value={listname} 
                            placeholder="รายการ" 
                            onChange={(e) => setListName(e.target.value)} 
                        />
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
            <TableContainer component={Paper} className="mt-3" sx={{ boxShadow: 3, borderRadius: 2 }}>
                <h6 className="p-3" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, backgroundColor: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
                    รายการที่เพิ่มเพื่อบันทึก ({tempItems.length} รายการ)
                </h6>
                <Table sx={{ minWidth: 650 }} aria-label="temp items table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>ลำดับ</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="left">รายการ</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="right">จำนวน</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="right">ราคา</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="right">รวมเป็นเงิน</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="center">ลบ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tempItems.map((item, index) => (
                            <TableRow 
                                key={index}
                                sx={{ 
                                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                    '&:hover': { backgroundColor: '#e3f2fd' },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <TableCell sx={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                                <TableCell align="left">{item.listname}</TableCell>
                                <TableCell align="right">{item.quantity.toLocaleString('th-TH')}</TableCell>
                                <TableCell align="right">{item.Price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{item.total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="error" size="small" onClick={() => removeTempItem(index)}>
                                        <DeleteIcon sx={{ fontSize: '16px' }} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {tempItems.length > 0 && (
                            <TableRow sx={{ backgroundColor: '#fff3e0', fontWeight: 'bold' }}>
                                <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>
                                    ยอดรวมทั้งหมด:
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '15px', color: '#d32f2f' }}>
                                    {tempItems.reduce((sum, item) => sum + item.total, 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="p-3" style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e0e0e0' }}>
                    <Button variant="contained" color="success" onClick={saveAllOutcome} sx={{ fontWeight: 'bold' }}>
                        บันทึกข้อมูล
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={() => setTempItems([])}>
                        ยกเลิก
                    </Button>
                </div>
            </TableContainer>
        )}


        <TableContainer component={Paper} className="mt-3 mb-5" sx={{ boxShadow: 3, borderRadius: 2 }}>
            <h6 className="p-3" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, backgroundColor: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
                ข้อมูลค่าใช้จ่าย
            </h6>
            <Table sx={{ minWidth: 650 }} aria-label="saved data table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#1976d2' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>ลำดับ</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="left">วันที่</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="left">รายการ</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="right">จำนวน</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="right">ราคา</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="right">รวมเป็นเงิน</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }} align="center">จัดการ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.length > 0 && data?.map((row, index) => (
                        <TableRow
                            key={row.account_id}
                            sx={{ 
                                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                '&:hover': { backgroundColor: '#e3f2fd' },
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <TableCell sx={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                            <TableCell align="left">{moment(row.date_account).format('YYYY-MM-DD')}</TableCell>
                            <TableCell align="left">{row.listname}</TableCell>
                            <TableCell align="right">{row.quantity?.toLocaleString('th-TH') || 0}</TableCell>
                            <TableCell align="right">{parseFloat(row.Price).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell align="right" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{parseFloat(row.total).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell align="center">
                                <Button variant="contained" color="error" size="small" onClick={() => deleteOutcome(row.account_id)}>
                                    <DeleteIcon sx={{ fontSize: '16px' }} />
                                </Button>
                            </TableCell>
                        </TableRow> 
                    ))}
                    {data?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ padding: '40px', color: '#999', fontSize: '16px' }}>
                                ไม่มีข้อมูล
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.length > 0 && (
                        <TableRow sx={{ backgroundColor: '#fff3e0', fontWeight: 'bold' }}>
                            <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>
                                ค่าใช้จ่ายทั้งหมด:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '15px', color: '#d32f2f' }}>
                                {outcome.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
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