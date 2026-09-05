import { useState, useEffect, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import Detail from "./DetailReport";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Alert,
  Pagination,
} from "react-bootstrap";
import Swal from "sweetalert2";
import moment from "moment";
import { AuthData } from "../ContextData";
import { http } from "../http";
import PaidIcon from "@mui/icons-material/Paid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import PaymentIcon from "@mui/icons-material/Payment";
import DiningIcon from "@mui/icons-material/Dining";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Spinner from "react-bootstrap/Spinner";
const Report = () => {
  const { shop, sendMessageToPage } = useContext(AuthData);
  const shopID = shop?.shop_id;

  const [totalToday, setTotalToday] = useState(0);
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // เก็บวันที่ในรูปแบบ DD/MM/YYYY
  const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY"));

  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [bank_transfer, setBank_transfer] = useState(0);
  const [cash, setCash] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  const formatMoney = (val) => {
    return new Intl.NumberFormat().format(val);
  };

  const getApiDate = () => {
    return moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");
  };

  const getOrderFood = async () => {
    if (shop?.shop_id) {
      let sumToday = 0;
      let bank = 0;
      let cashIn = 0;

      await http
        .get(`/bills?shop_id=${shop?.shop_id}`, {
          headers: { apikey: token },
        })
        .then((res) => {
          setData(res.data);

          res?.data?.map((item) => {
            sumToday += Number(item?.amount);

            if (item.payment_type === "bank_transfer") {
              bank += Number(item?.amount);
            } else {
              cashIn += Number(item?.amount);
            }
          });

          setBank_transfer(bank);
          setCash(cashIn);
          setTotalToday(sumToday);
        });
    }
  };

  const handleSwitchChange = async (row) => {
    const body = {
      payment_type:
        row.payment_type === "bank_transfer" ? "cash" : "bank_transfer",
    };

    await http.put(`/bills/${row.id}`, body, {
      headers: { apikey: token },
    });

    await searchOrder();
  };

  const handleChangePayment = async (payment, id, messengerId) => {
    if (messengerId !== "pos") {
      sendMessageToPage(messengerId, "ชำระเงินสำเร็จ ขอบคุณครับ ");
    }
    const body = { payment_status: payment };
    await http.put(`/bills/${id}`, body, {
      headers: { apikey: token },
    });
    await searchOrder();
  };

  const searchOrder = async () => {
    setLoading(true);
    if (shopID && startDate) {
      let bank = 0;
      let cashIn = 0;
      const body = {
        startDate: getApiDate(),
        shop_id: shopID,
      };
      await http
        .post(`/bills/searchByDate`, body, {
          headers: { apikey: token },
        })
        .then((res) => {
          setData(res.data.data);
          setTotal(res.data.data?.length || 0);
          setPage(1);
          res?.data.data?.map((item) => {
            if (item.payment_type === "bank_transfer") {
              bank += Number(item?.amount);
            } else {
              cashIn += Number(item?.amount);
            }
          });
          setBank_transfer(bank);
          setCash(cashIn);

          const total = res.data.total;
          setTotalToday(total);
        });
    }
    setLoading(false);
  };

  const geReport = async () => {
    if (shop?.shop_id) {
      await http
        .get(
          `/report/count-order-type?startDate=${getApiDate()}&shop_id=${shop.shop_id}`,
        )
        .then((res) => {
          setCounter(res.data);
        });
    }
  };

  const RemoveDetailsId = async (id) => {
    await http.delete(`/bills/${id}`);
    await getOrderFood();
  };

  const deleteBill = async (id) => {
    Swal.fire({
      title: "คุณต้องการยกเลิกออเดอร์หรือไม่ ?",
      text: "กดยืนยันเพื่อยกเลิก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยันรายการ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        RemoveDetailsId(id);
      }
    });
  };

  useEffect(() => {
    geReport();
    searchOrder();
  }, [startDate, shopID]);

  return (
    <>
      <Card className="report-page-card" style={{ borderRadius: 0 }}>
        <Card.Body className="report-page-body">
          <Row className="mt-4 report-shell">
            <Col md={12}>
              <Card className="report-hero-panel">
                <Card.Body>
                  <Form>
                    <Row className="mb-3 align-items-end">
                      <Col md={3}>
                        <Form.Label className="report-label">เลือกวันที่แสดงยอดขาย</Form.Label>

                        <Form.Control
                          className="report-date-input"
                          type="date"
                          value={moment(startDate, "DD/MM/YYYY").format(
                            "YYYY-MM-DD",
                          )}
                          onChange={(e) =>
                            setStartDate(
                              moment(e.target.value).format("DD/MM/YYYY"),
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Form>

                  <div className="report-total-box text-center">
                    <span className="report-date-text">วันที่ {startDate}</span>
                   
                    <h3>
                      {totalToday &&
                        counter &&
                        formatMoney(totalToday - counter.takeawayCount * 5)}{" "}
                      บาท
                    </h3>
                  </div>

                  {/* <Row className="g-3 mt-1">
                    <Col md={6} xs={6}>
                      <Alert variant="primary" className="report-summary-box transfer-box d-flex p-4">
                        <PaymentIcon className="me-2" />
                        <div>
                          <small>เงินโอน</small>
                          <h5>{formatMoney(bank_transfer)} บาท</h5>
                        </div>
                      </Alert>
                    </Col>

                    <Col md={6} xs={6}>
                      <Alert variant="secondary" className="report-summary-box cash-box d-flex p-4">
                        <PaidIcon className="me-2" />
                        <div>
                          <small>เงินสด</small>
                          <h5>{formatMoney(cash)} บาท</h5>
                        </div>
                      </Alert>
                    </Col>
                  </Row> */}

                  <Card className="mt-3 report-stat-card">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={4}>
                          <div className="text-center report-stat-item card-report-1 mb-2">
                            <DeliveryDiningIcon style={{ fontSize: 30 }} />
                            
                            <strong>เดลิเวอรี่</strong>
                           
                            <span>จำนวน {counter.takeawayCount} </span>
                            {/* <p>
                              ยอดขาย{" "}
                              {formatMoney(
                                counter.takeawayTotalAmount -
                                  counter.takeawayCount * 5,
                              )}{" "}
                              บาท
                            </p> */}
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="text-center report-stat-item card-report-2 mb-2">
                            <DiningIcon style={{ fontSize: 30 }} />
                           
                            <strong>ทานที่ร้าน</strong>
                            
                            <span>จำนวน {counter.dineInCount} </span>
                            {/* <p>
                              ยอดขาย{" "}
                              {formatMoney(counter.dineInTotalAmount || 0)} บาท
                            </p> */}
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="text-center report-stat-item card-report-3 mb-2">
                            <StorefrontIcon style={{ fontSize: 30 }} />
                          
                            <strong>รับหน้าร้าน</strong>
                          
                            <span>จำนวน {counter.pickupCount} </span>
                            {/* <p>
                              ยอดขาย{" "}
                              {formatMoney(counter.pickupTotalAmount || 0)} บาท
                            </p> */}
                          </div>
                        </Col>
                      </Row>

                      {/* <div className="text-center mt-4 total-bill-chip">
                        <b>รวมทั้งหมด {counter.totalCount} บิล</b>
                      </div> */}
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
            {loading && (
              <Col md={12} className="text-center mt-2 mb-2">
                <Spinner animation="border" variant="primary" />
              </Col>
            )}
            <Col md={12}>
              <TableContainer component={Paper} className="mt-3 report-table-wrap">
                <Table>
                  <TableHead sx={{ backgroundColor: "#fff2e8" }}>
                    <TableRow sx={{ backgroundColor: "#fff2e8" }}>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        ลำดับ
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        ประเภทการรับ
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        ประเภทการชำระเงิน
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        สถานะการชำระเงิน
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        ยอดรวม
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        ลูกค้า
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        เวลา
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        รายการ
                      </TableCell>
                      <TableCell sx={{ color: "#333", fontWeight: 900 }}>
                        จัดการ
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data
                      ?.slice((page - 1) * perPage, page * perPage)
                      .map((row, index) => (
                        <TableRow key={row.id} className="report-row">
                          <TableCell>
                            {(page - 1) * perPage + index + 1}
                          </TableCell>
                          <TableCell>{row.ordertype}</TableCell>

                          <TableCell>
                            <FormControlLabel
                              className="payment-switch"
                              control={
                                <Switch
                                  checked={row.payment_type === "bank_transfer"}
                                  onChange={() => handleSwitchChange(row)}
                                />
                              }
                              label={
                                row.payment_type === "bank_transfer"
                                  ? "โอนจ่าย"
                                  : "เงินสด"
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {row.payment_status === "ชำระเงินแล้ว" ? (
                              <Button
                                className="payment-paid-btn"
                                onClick={() =>
                                  handleChangePayment("ยังไม่ชำระ", row.id)
                                }
                              >
                                ชำระเงินแล้ว
                              </Button>
                            ) : (
                              <Button
                                className="payment-unpaid-btn"
                                onClick={() =>
                                  handleChangePayment(
                                    "ชำระเงินแล้ว",
                                    row.id,
                                    row.messengerId,
                                  )
                                }
                              >
                                ยังไม่ชำระ
                              </Button>
                            )}
                          </TableCell>

                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.customerName}</TableCell>

                          <TableCell>
                            {moment(row.timeOrder).format("HH:mm")} น.
                          </TableCell>

                          <TableCell>
                            <Button
                              className="detail-btn"
                              onClick={() => {
                                setId(row.bill_ID);
                                setShow(true);
                              }}
                            >
                              ดูรายการ
                            </Button>
                          </TableCell>

                          <TableCell>
                            <Button
                              className="delete-btn"
                              onClick={() => deleteBill(row.id)}
                            >
                              ยกเลิก
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>

                  {data.length === 0 && (
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center fw-bold" colSpan={9}>
                          <Alert variant="danger">ไม่มีข้อมูลยอดขาย </Alert>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>

                {/* Pagination */}
                <div className="mt-3 d-flex justify-content-between align-items-center p-3">
                  <div>
                    <span>
                      แสดง {(page - 1) * perPage + 1} ถึง{" "}
                      {Math.min(page * perPage, total)} จากทั้งหมด {total}{" "}
                      รายการ
                    </span>
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
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>รายการอาหาร</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Detail getOrderFood={getOrderFood} id={id} />

          <Button className="mt-3" onClick={handleClose} variant="danger">
            ปิด
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Report;
