
import React, { useState, useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import Detail from "./DetailReport";
import { Card, Row, Col, Button, Form } from "react-bootstrap"
import Swal from 'sweetalert2';
import moment from "moment/moment";
const Report = () => {
    const [totalToday, setTotalToday] = useState(0)
    const [data, setData] = useState([])
    const [counter, setCounter] = useState({});
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const token = localStorage.getItem("token");

    const getOrderFood = async () => {
        let sumToday = 0;
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills`, { headers: { 'apikey': token } })
            .then(res => {
                setData(res.data)
                res?.data?.map(item => {
                    sumToday += (Number(item?.amount))
                })
                setTotalToday(sumToday)
            })
    }

    const searchOrder = async () => {
        const body = { startDate: startDate }
        await axios.post(`${import.meta.env.VITE_BAKUP_URL}/bills/searchByDate`, body, { headers: { 'apikey': token } })
            .then((res) => {
                setData(res.data.data);
                setTotalToday(res.data.total);
            })
    }


    const RemoveDetailsId = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BAKUP_URL}/bills/${id}`)
        //await axios.delete(`${import.meta.env.VITE_BAKUP_URL}/billsdetails/${id}`)

        await getOrderFood()
    }

    const geReportByorder = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/report/count-order-type?startDate=${startDate}`)
            .then(res => {
                setCounter(res.data)
            })
    }

    const deleteBill = async (id) => {
        Swal.fire({
            title: 'คุณต้องการยกเลิกออเดอร์หรือไม่ ?',
            text: "กดยืนยันเพื่อยกเลิก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยันรายการ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                RemoveDetailsId(id)
            }

        });

    }



    useEffect(() => {
        searchOrder()
        geReportByorder();
    }, [startDate])




    return (<>
        <Card>
            <Card.Body>
                <Row className="mt-4">
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Row className="mb-3">

                                        <Col md={6}>
                                            <Form.Label>
                                               ค้นหาจากวันที่ 
                                            </Form.Label>
                                            <Form.Control
                                                onChange={(e) => setStartDate(e.target.value)}
                                                value={startDate}
                                                type="date" />
                                        </Col>


                                    </Row>


                                </Form>
                                <Card.Title className="text-center" style={{ color: 'green' }}> ยอดขายวันนี้   {new Intl.NumberFormat().format(totalToday)} บาท
                                </Card.Title>
                                <Card className="mt-2">
                                    <Card.Body>

                                        <div className="text-center">
                                            <DeliveryDiningIcon style={{ fontSize: '30px' }} />เดลิเวอรี่ จำนวน {counter.takeawayCount} บิล
                                            <p> ยอด = {counter.takeawayTotalAmount} บาท</p>
                                            <p> {((counter.takeawayCount / counter.totalCount) * 100).toFixed(2)} %</p>

                                        </div>
                                        <div className="text-center">
                                            <RoomServiceIcon style={{ fontSize: '30px' }} />ทานที่ร้าน จำนวน {counter.dineInCount} บิล  <p> ยอด = {counter.dineInTotalAmount} บาท</p>
                                            <p> {((counter.dineInCount / counter.totalCount) * 100).toFixed(2)} %</p>
                                        </div>

                                        <div className="text-center">
                                            <RoomServiceIcon style={{ fontSize: '30px' }} />รับเอง จำนวน {counter.pickupCount} บิล
                                            <p> ยอด = {counter.pickupTotalAmount} บาท</p>
                                            <p>{((counter.pickupCount / counter.totalCount) * 100).toFixed(2)} %</p>
                                        </div>
                                        <div className="text-center">
                                            <p>รวมทั้งหมด {counter.totalCount} บิล</p>
                                        </div>



                                    </Card.Body>
                                </Card>

                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={12} >
                        <TableContainer component={Paper} className="mt-3">
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ลำดับ</TableCell>
                                        <TableCell align="right">ประเภท</TableCell>
                                        <TableCell align="right">ยอดรวม</TableCell>
                                        <TableCell align="right">ชื่อลูกค้า</TableCell>
                                        <TableCell align="right">เวลา</TableCell>
                                        <TableCell align="right">รายการ</TableCell>
                                        <TableCell align="right">จัดการ</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row) => (
                                        <TableRow
                                            key={row.queueNumber}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.queueNumber}
                                            </TableCell>
                                            <TableCell align="right">{row.ordertype}</TableCell>
                                            <TableCell align="right">{row.amount}</TableCell>
                                            <TableCell align="right">{row.customerName}</TableCell>
                                            <TableCell align="right">{moment(row.timeOrder).format('HH:mm')} น.</TableCell>
                                            <TableCell align="right">
                                                <Detail

                                                    id={row.bill_ID}

                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="danger" onClick={() => deleteBill(row.id)}> ยกเลิก  </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    </>)
}

export default Report;