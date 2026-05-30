import React, { useState, useEffect, useContext } from "react";
import { Badge, Pagination,Card } from "react-bootstrap";
import { http } from "../../http";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { AuthData } from "../../ContextData";
const ReportProduct = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const { shop } = useContext(AuthData);

  const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().endOf("month").format("YYYY-MM-DD"));

 // 🔥 แยก function
  const getData = async () => {
    if (!shop?.shop_id) return; // ❗กัน error ตอน shop ยังไม่มา

    try {
      const res = await http.get(
        `/group?startDate=${startDate}&endDate=${endDate}&shop_id=${shop.shop_id}`
      );

      if (res) {
        setData(res.data);
        setTotal(res.data?.length || 0);
        setPage(1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ โหลดครั้งแรก + โหลดใหม่เมื่อ shop มา
  useEffect(() => {
    getData();
  }, [shop]);

  // ✅ โหลดใหม่เมื่อ user เปลี่ยนวันที่
  useEffect(() => {
    if (shop?.shop_id) {
      getData();
    }
  }, [startDate, endDate]);


  return (<Card>
     
          <Card.Body>
  
            <div className="row">
          <div className="col-md-3 col-xs-6 text-left ms-3">
            <h6>วันที่เริ่มต้น</h6>
            <input
              className="form-control mb-2"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-3 col-xs-6 text-left me-3">
            <h6>วันที่สิ้นสุด</h6>
            <input
              className="form-control mb-2"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      <TableContainer component={Paper} className="mt-3 p-3">


        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: 900 }} align="left">ลำดับ</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 900 }} align="left">รายการ</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 900 }} align="left">จำนวน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 &&
              data
                ?.slice((page - 1) * perPage, page * perPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{(page - 1) * perPage + index + 1}</TableCell>
                    <TableCell align="left">{row.foodname}</TableCell>
                    <TableCell align="left">
                      {" "}
                      <Badge pill> {row._sum.quantity}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div>
            <span>แสดง {(page - 1) * perPage + 1} ถึง {Math.min(page * perPage, total)} จากทั้งหมด {total} รายการ</span>
          </div>
          {total > perPage && (
            <Pagination>
              <Pagination.First
                onClick={() => setPage(1)}
                disabled={page === 1}
              />
              <Pagination.Prev
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              />
              {[...Array(Math.ceil(total / perPage))].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setPage(page + 1)}
                disabled={page === Math.ceil(total / perPage)}
              />
              <Pagination.Last
                onClick={() => setPage(Math.ceil(total / perPage))}
                disabled={page === Math.ceil(total / perPage)}
              />
            </Pagination>
          )}
        </div>
      </TableContainer>
    
    </Card.Body>
  </Card>);
};
export default ReportProduct;
