import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button, Navbar, Nav, Card } from 'react-bootstrap'
import { httpDelete, httpGet, httpPost } from "../../http";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const ReportProduct = () => {

    const [data, setData] = useState([]);
    const getData = async () => {
        await httpGet('/account/report')
            .then((data) => {
                if (data) {
                    setData(data.data);
                }
            })
    }

    useEffect(() => {
        getData();

    }
        , [])

    return (<>

        <TableContainer component={Paper} className="mt-3">
                <div className="text-center">
                    <h6>สรุปรายการสั่งซื้อ เดือนปัจจุบัน</h6>
                </div>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        
                        <TableCell align="left">ลำดับ</TableCell>
                        <TableCell align="left">รายการ</TableCell>
                        <TableCell align="left">จำนวน</TableCell>


                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.length > 0 && data?.map((row, index) => (
                        <TableRow
                            key={row.account_id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >

                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">{row.listname}</TableCell>
                            <TableCell align="left">{row.count}</TableCell>


                        </TableRow>

                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>)
}
export default ReportProduct;