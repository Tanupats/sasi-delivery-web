import React, { useState, useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import Detail from "./DetailReport";
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap"
import Swal from 'sweetalert2';
import moment from "moment/moment";
import { httpDelete, httpGet, httpPost } from "../http";
const Report = () => {
    const [totalToday, setTotalToday] = useState(0)
    const [data, setData] = useState([])
    const [counter, setCounter] = useState({});
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const token = localStorage.getItem("token");
    const [show, setShow] = useState(false);
    const [id, setId] = useState("");
    const handleClose = () => setShow(false);

    const getOrderFood = async () => {
        let sumToday = 0;
        await httpGet(`/bills`, { headers: { 'apikey': token } })
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
        await httpPost(`/bills/searchByDate`, body, { headers: { 'apikey': token } })
            .then((res) => {
                setData(res.data.data);
                setTotalToday(res.data.total);
            })
    }


    const RemoveDetailsId = async (id) => {
        await httpDelete(`/bills/${id}`);
        await getOrderFood();
    }

    const geReportByorder = async () => {
        await httpGet(`/report/count-order-type?startDate=${startDate}`)
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

                                        <Row>
                                            <Col md={4}>

                                                <div className="text-center card-report-1">  <DeliveryDiningIcon style={{ fontSize: '30px' }} /> <br />
                                                    เดลิเวอรี่ จำนวน {counter.takeawayCount} บิล
                                                    <p> ยอด = {new Intl.NumberFormat().format(counter.takeawayTotalAmount)} บาท</p>
                                                    <p> {((counter.takeawayCount / counter.totalCount) * 100).toFixed(2)} %</p>

                                                </div> </Col>
                                            <Col md={4}>
                                                <div className="text-center card-report-2">
                                                    <RoomServiceIcon style={{ fontSize: '30px' }} />
                                                    <br /> ทานที่ร้าน จำนวน {counter.dineInCount} บิล
                                                    <p> ยอด = {new Intl.NumberFormat().format(counter.dineInTotalAmount)} บาท</p>
                                                    <p> {((counter.dineInCount / counter.totalCount) * 100).toFixed(2)} %</p>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="text-center card-report-3">
                                                    <RoomServiceIcon style={{ fontSize: '30px' }} />  <br />     รับเอง จำนวน {counter.pickupCount} บิล
                                                    <p> ยอด = {new Intl.NumberFormat().format(counter.pickupTotalAmount)} บาท</p>
                                                    <p>{((counter.pickupCount / counter.totalCount) * 100).toFixed(2)} %</p>
                                                </div>
                                            </Col>

                                        </Row>
                                        <div className="text-center mt-4">
                                            <b>รวมทั้งหมด {counter.totalCount} บิล</b>
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
                                        <TableCell align="left">ประเภท</TableCell>
                                        <TableCell align="left">ยอดรวม</TableCell>
                                        <TableCell align="left">ลูกค้า</TableCell>
                                        <TableCell align="left">เวลา</TableCell>
                                        <TableCell align="left">รายการ</TableCell>
                                        <TableCell align="left">จัดการ</TableCell>

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
                                            <TableCell align="left">{row.ordertype}</TableCell>

                                            <TableCell align="left">{row.amount}</TableCell>
                                            <TableCell align="left">{row.customerName}</TableCell>
                                            <TableCell align="left">{moment(row.timeOrder).format('HH:mm')} น.</TableCell>
                                            <TableCell align="left">

                                                <Button variant="primary" onClick={() => { setId(row.bill_ID), setShow(true) }}> ดูรายการ  </Button>
                                            </TableCell>
                                            <TableCell align="left">
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

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> รายการอาหาร  </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>

                    <Row>

                        <Col md={12}>
                            <Detail

                                id={id}

                            />
                        </Col>

                        <Col md={6}>
                            <Button
                                className="mt-3"
                                onClick={handleClose}
                                style={{ float: 'left' }}
                                variant="danger">
                                ปิด
                            </Button>
                        </Col>
                    </Row>

                </Form>








            </Modal.Body>

        </Modal>
    </>)
}

export default Report;