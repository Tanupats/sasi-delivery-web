import { useState, useEffect, useContext } from "react";
import { Badge } from 'react-bootstrap'
import { httpGet } from "../../http";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from "moment";

const ReportProduct = () => {
    const [data, setData] = useState([]);
    //const { shop } = useContext(AuthData);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    useEffect(() => {
        const getData = async () => {
            await httpGet(`/group?startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`)
                .then((data) => {
                    if (data) {
                        setData(data.data);
                    }
                })
        }
        getData();
    }
        , [startDate, endDate]);

    return (<>

        <TableContainer component={Paper} className="mt-3">
            <div className="text-center mt-4">
                <h6>สรุปรายการสั่งซื้อ เดือนปัจจุบัน</h6>
            </div>
            <div className="row">
                <div className="col-md-3 text-left ms-3">
                    <h6>วันที่เริ่มต้น</h6>  <input className="form-control mb-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="col-md-3 text-left me-3">
                    <h6>วันที่สิ้นสุด</h6>  <input className="form-control mb-2" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
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
                            <TableCell align="left">{row.foodname}</TableCell>
                            <TableCell align="left"> <Badge pill>   {row._sum.quantity}</Badge></TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>)
}
export default ReportProduct;