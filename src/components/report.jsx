
import React, { useState, useEffect } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap"
const Report = () => {
    const [totalToday, setTotalToday] = useState(0)
    const [totalMounth, settotalMounth] = useState(0)
    const [data, setData] = useState([])
    const getOrderFood = async () => {

        await fetch('https://www.sasirestuarant.com/api/orderFood.php').then((res) => res.json())
            .then((res) => {
                setData(res)
                let total = 0;
                res.map(item => {
                    total += (Number(item.amount))
                })
                setTotalToday(total)
                console.log(total)
            })

    }


    const getOrderFoodMounth = async () => {

        await axios.get('https://sasirestuarant.com/api/orderFoodMounth.php')
            .then((res) => {

                let totalm = 0;
                res.map(item => {
                    totalm += (Number(item.amount))
                })
                settotalMounth(totalm)
                console.log(totalm)
            })

    }


    useEffect(() => {

        getOrderFoodMounth()

    }, [])
    useEffect(() => {


        getOrderFood()
    }, [])

    useEffect(() => {

    }, [totalToday])
    return (<>
        <Card>
            <Card.Body>
                <Row className="mt-4">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center"> ยอดขายวันนี้   {new Intl.NumberFormat().format(totalToday)} บาท</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center"> ยอดขายเดือนนี้  {totalMounth}</Card.Title>
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
                                            <TableCell align="right"> <p>ข้าวผัดไก่</p><p>ยำไก่ทอด</p></TableCell>
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