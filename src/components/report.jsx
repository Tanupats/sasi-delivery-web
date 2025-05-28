import { useState, useEffect, useContext } from "react"
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
import { Card, Row, Col, Button, Form, Modal, Alert } from "react-bootstrap"
import Swal from 'sweetalert2';
import moment from "moment/moment";
import { AuthData } from "../ContextData";
import { httpDelete, httpGet, httpPost, httpPut } from "../http";
import PaidIcon from '@mui/icons-material/Paid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import PaymentIcon from '@mui/icons-material/Payment';
const Report = () => {
    const { shop } = useContext(AuthData)
    const [totalToday, setTotalToday] = useState(0)
    const [data, setData] = useState([])
    const [counter, setCounter] = useState({});
    const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const token = localStorage.getItem("token");
    const [show, setShow] = useState(false);
    const [id, setId] = useState("");
    const [bank_transfer, setBank_transfer] = useState(0);
    const [cash, setCash] = useState(0);
    const handleClose = () => setShow(false);

    const getOrderFood = async () => {
        if (shop) {
            let sumToday = 0;
            let bank = 0;
            let cashIn = 0;
            await httpGet(`/bills?shop_id=${shop?.shop_id}`, { headers: { 'apikey': token } })
                .then(res => {
                    setData(res.data)
                    res?.data?.map(item => {
                        sumToday += (Number(item?.amount));
                        if (item.payment_type === "bank_transfer") {

                            bank += (Number(item?.amount));

                        } else {
                            cashIn += (Number(item?.amount));
                        }
                    })
                    setBank_transfer(bank);
                    setCash(cashIn);
                    setTotalToday(sumToday);
                })
        }
    }

    const handleSwitchChange = async (row) => {
        const body = { payment_type: row.payment_type === 'bank_transfer' ? 'cash' : 'bank_transfer' }
        await httpPut(`/bills/${row.id}`, body, { headers: { 'apikey': token } })
        await searchOrder();
    };

    const searchOrder = async () => {
        if (shop) {
            const body = { startDate: startDate, shop_id: shop?.shop_id }
            await httpPost(`/bills/searchByDate`,
                body, { headers: { 'apikey': token } })
                .then((res) => {
                    setData(res.data.data);
                    setTotalToday(res.data.total);
                })
        }
    }

    const RemoveDetailsId = async (id) => {
        await httpDelete(`/bills/${id}`);
        await getOrderFood();
    }

    const geReport = async () => {
        await httpGet(`/report/count-order-type?startDate=${startDate}&shop_id=${shop.shop_id}`)
            .then(res => {
                setCounter(res.data);
            });
    }

    const formatMoney = (val) => {
        return new Intl.NumberFormat().format(val)
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
                RemoveDetailsId(id);
            }
        });
    }

    useEffect(() => {

        getOrderFood()

    }, [shop])

    useEffect(() => {
        searchOrder();
        geReport();
    }, [startDate, shop])

    return (<>
        <Card style={{borderRadius:0}}>
            <Card.Body>
                <Row className="mt-4">
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Row className="mb-3">

                                        <Col md={6}>
                                            <Form.Label>
                                                แสดงยอดขาย
                                            </Form.Label>
                                            <Form.Control
                                                onChange={(e) => setStartDate(e.target.value)}
                                                value={startDate}
                                                type="date" />
                                        </Col>


                                    </Row>


                                </Form>
                                <Card.Title className="text-center" style={{ color: 'green' }}>  ยอดขายวันนี้   {formatMoney(totalToday)} บาท

                                </Card.Title>
                                <Row mt={4}>
                                    <Col md={6} xs={6}>
                                        <Alert variant="primary" className="d-flex">
                                            <PaymentIcon /> {' '} <h5> โอนจ่าย {formatMoney(bank_transfer)}</h5>
                                        </Alert>
                                    </Col>
                                    <Col md={6} xs={6}>
                                        <Alert variant="success" className="d-flex">
                                            <PaidIcon />  {' '}   <h5 style={{ color: '#000' }}> เงินสด {formatMoney(cash)}</h5>
                                        </Alert>
                                    </Col>
                                </Row>

                                <Card className="mt-2">
                                    <Card.Body>

                                        <Row>
                                            <Col md={4}>

                                                <div className="text-center card-report-1 mb-2">  <DeliveryDiningIcon style={{ fontSize: '30px' }} /> <br />
                                                    เดลิเวอรี่ จำนวน {counter.takeawayCount} บิล
                                                    <p> ยอดขาย = {new Intl.NumberFormat().format(counter.takeawayTotalAmount || 0)} บาท</p>
                                                    <p> {counter.takeawayCount > 0 ? (counter.takeawayCount / counter.totalCount * 100).toFixed(2) : 0} %</p>

                                                </div> </Col>
                                            <Col md={4}>
                                                <div className="text-center card-report-2 mb-2">
                                                    <RoomServiceIcon style={{ fontSize: '30px' }} />
                                                    <br /> ทานที่ร้าน จำนวน {counter.dineInCount} บิล
                                                    <p> ยอดขาย = {new Intl.NumberFormat().format(counter.dineInTotalAmount || 0)} บาท</p>
                                                    <p> {counter.dineInCount > 0 ? ((counter?.dineInCount / counter.totalCount) * 100).toFixed(2) : 0} %</p>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="text-center card-report-3 mb-2">
                                                    <RoomServiceIcon style={{ fontSize: '30px' }} />  <br /> รับเองหน้าร้าน จำนวน {counter.pickupCount} บิล
                                                    <p> ยอดขาย = {new Intl.NumberFormat().format(counter.pickupTotalAmount || 0)} บาท</p>
                                                    <p>{counter.pickupCount > 0 ? ((counter?.pickupCount / counter.totalCount) * 100).toFixed(2) : 0} %</p>
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
                                        <TableCell align="left">ประเภทการรับ</TableCell>
                                        <TableCell align="left">ประเภทการชำระเงิน</TableCell>
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
                                            <TableCell align="left">
                                                <FormControlLabel
                                                    control={
                                                        <Switch checked={row.payment_type === "bank_transfer" ? true : false} onChange={() => handleSwitchChange(row)} />
                                                    }
                                                    label={row.payment_type === "bank_transfer" ? 'โอนจ่าย' : 'เงินสด'}
                                                /></TableCell>
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