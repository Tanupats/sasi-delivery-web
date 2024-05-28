
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
import { Card, Row, Col, Button } from "react-bootstrap"
const Report = () => {
    const [totalToday, setTotalToday] = useState(0)
    const [totalMounth, settotalMounth] = useState(0)
    const [data, setData] = useState([])
    const [counter, setCounter] = useState([]);
    const getOrderFood = async () => {
        let sumToday = 0;
        await axios.get(`${import.meta.env.VITE_API_URL}/orderFood.php`)
            .then(res => {
                setData(res.data)
                res?.data?.map(item => {
                    sumToday += (Number(item?.amount))
                })
                setTotalToday(sumToday)
            })
    }

    const getOrderFoodMounth = async () => {
        await axios.get('https://api.sasirestuarant.com/orderFood.php?Dateinput=mounth')
            .then(res => {
                settotalMounth(res.data[0].total)
            })
    }

    const geCountorder = async () => {
        await axios.get('https://api.sasirestuarant.com/orderFood.php?countOrder')
            .then(res => {
                setCounter(res.data)
            })
    }

    const deleteBill = async (id) => {
         axios.delete('https://api.sasirestuarant.com/orderFood.php?billId='+id)
    
    }


    useEffect(() => {
        getOrderFood()
        geCountorder()
        getOrderFoodMounth()
    }, [])

    useEffect(() => {


    }, [totalMounth])

    useEffect(() => {

    }, [data])

    return (<>
        <Card>
            <Card.Body>
                <Row className="mt-4">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center" style={{ color: 'green' }}> ยอดขายวันนี้   {new Intl.NumberFormat().format(totalToday)} บาท</Card.Title>
                                {counter.length > 0 && counter?.map(item => {

                                    return (<>
                                        <Card className="mt-2">
                                            <Card.Body>
                                                <div className="text-center"> {item?.ordertype === 'สั่งกลับบ้าน' && <DeliveryDiningIcon style={{ fontSize: '30px' }} />}
                                                </div>
                                                <div className="text-center"> {item?.ordertype === 'เสิร์ฟในร้าน' && <RoomServiceIcon style={{ fontSize: '30px' }} />}
                                                </div>
                                                <h5 className="text-center">    {item?.ordertype} {item?.total_bill} </h5>


                                            </Card.Body>
                                        </Card> </>)
                                })}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center" style={{ color: 'blue' }} > ยอดขายเดือนนี้  {new Intl.NumberFormat().format(totalMounth)} บาท</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={12} >
                        <TableContainer component={Paper} className="mt-3">
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>หมายเลขคำสั่งซื้อ</TableCell>
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
                                            key={row.bill_ID}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.bill_ID}
                                            </TableCell>
                                            <TableCell align="right">{row.ordertype}</TableCell>
                                            <TableCell align="right">{row.amount}</TableCell>
                                            <TableCell align="right">{row.customerName}</TableCell>
                                            <TableCell align="right">{row.timeOrder}</TableCell>
                                            <TableCell align="right">
                                                <Detail id={row.bill_ID} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="danger" onClick={()=>deleteBill(row.bill_ID)}> delete  </Button>
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