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
import { Card, Row, Col, Button, Form, Modal, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import moment from "moment";
import { AuthData } from "../ContextData";
import { httpDelete, httpGet, httpPost, httpPut } from "../http";
import PaidIcon from "@mui/icons-material/Paid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import PaymentIcon from "@mui/icons-material/Payment";
import DiningIcon from "@mui/icons-material/Dining";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Spinner from 'react-bootstrap/Spinner';
const Report = () => {
  const { shop, sendMessageToPage } = useContext(AuthData);
  const shopID = shop?.shop_id;

  const [totalToday, setTotalToday] = useState(0);
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState({});

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

      await httpGet(`/bills?shop_id=${shop?.shop_id}`, {
        headers: { apikey: token },
      }).then((res) => {
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

    await httpPut(`/bills/${row.id}`, body, {
      headers: { apikey: token },
    });

    await searchOrder();
  };

  const handleChangePayment = async (payment, id, messengerId) => {
    if (messengerId !== "pos") {
      sendMessageToPage(messengerId, "ขอบคุณครับ");
    }

    const body = { payment_status: payment };

    await httpPut(`/bills/${id}`, body, {
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

      await httpPost(`/bills/searchByDate`, body, {
        headers: { apikey: token },
      }).then((res) => {
        setData(res.data.data);

        res?.data.data?.map((item) => {
          if (item.payment_type === "bank_transfer") {
            bank += Number(item?.amount);
          } else {
            cashIn += Number(item?.amount);
          }
        });

        setBank_transfer(bank);
        setCash(cashIn);
        setTotalToday(res.data.total);
      });
    }
    setLoading(false);
  };

  const geReport = async () => {
    if (shop?.shop_id) {
      await httpGet(
        `/report/count-order-type?startDate=${getApiDate()}&shop_id=${shop.shop_id}`,
      ).then((res) => {
        setCounter(res.data);
      });
    }
  };

  const RemoveDetailsId = async (id) => {
    await httpDelete(`/bills/${id}`);
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
    searchOrder();
    geReport();
  }, [startDate, shopID]);

  return (
    <>
      <Card style={{ borderRadius: 0 }}>
        <Card.Body>
          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Form>
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Label>
                          <b>แสดงยอดขาย</b>
                        </Form.Label>

                        <Form.Control
                          
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

                  <Card.Title
                    className="text-center"
                    style={{ color: "green", marginBottom: "20px" }}
                  >
                    วันที่ {startDate}
                    <br />
                    ยอดขาย {formatMoney(totalToday)} บาท
                  </Card.Title>

                  <Row>
                    <Col md={6} xs={6}>
                      <Alert variant="primary" className="d-flex p-4">
                        <PaymentIcon className="me-2" />
                        <h5>เงินโอน {formatMoney(bank_transfer)} บาท</h5>
                      </Alert>
                    </Col>

                    <Col md={6} xs={6}>
                      <Alert variant="secondary" className="d-flex p-4">
                        <PaidIcon className="me-2" />
                        <h5>เงินสด {formatMoney(cash)} บาท</h5>
                      </Alert>
                    </Col>
                  </Row>

                  <Card className="mt-2">
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          <div className="text-center card-report-1 mb-2">
                            <DeliveryDiningIcon style={{ fontSize: 30 }} />
                            <br />
                            เดลิเวอรี่
                            <br />
                            จำนวน {counter.takeawayCount} บิล
                            <p>
                              ยอดขาย{" "}
                              {formatMoney(counter.takeawayTotalAmount || 0)}{" "}
                              บาท
                            </p>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="text-center card-report-2 mb-2">
                            <DiningIcon style={{ fontSize: 30 }} />
                            <br />
                            ทานที่ร้าน
                            <br />
                            จำนวน {counter.dineInCount} บิล
                            <p>
                              ยอดขาย{" "}
                              {formatMoney(counter.dineInTotalAmount || 0)} บาท
                            </p>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="text-center card-report-3 mb-2">
                            <StorefrontIcon style={{ fontSize: 30 }} />
                            <br />
                            รับเองหน้าร้าน
                            <br />
                            จำนวน {counter.pickupCount} บิล
                            <p>
                              ยอดขาย{" "}
                              {formatMoney(counter.pickupTotalAmount || 0)} บาท
                            </p>
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
                           { loading && (
                <Col md={12} className="text-center mt-2 mb-2">
                  <Spinner animation="border" variant="primary" />
                </Col>
              ) }
            <Col md={12}> 
           
              <TableContainer component={Paper} className="mt-3">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ลำดับ</TableCell>
                      <TableCell>ประเภทการรับ</TableCell>
                      <TableCell>ประเภทการชำระเงิน</TableCell>
                      <TableCell>สถานะการชำระเงิน</TableCell>
                      <TableCell>ยอดรวม</TableCell>
                      <TableCell>ลูกค้า</TableCell>
                      <TableCell>เวลา</TableCell>
                      <TableCell>รายการ</TableCell>
                      <TableCell>จัดการ</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data?.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.ordertype}</TableCell>

                        <TableCell>
                          <FormControlLabel
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
                              variant="success"
                              onClick={() =>
                                handleChangePayment("ยังไม่ชำระ", row.id)
                              }
                            >
                              ชำระเงินแล้ว
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
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
                            variant="primary"
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
                            variant="danger"
                            onClick={() => deleteBill(row.id)}
                          >
                            ยกเลิก
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                  {data.length===0  && (

                    <TableBody>
                      
                     <TableRow> 
                       <TableCell   className="text-center fw-bold" colSpan={9}> 
                      <Alert variant="danger">ไม่มีข้อมูลยอดขาย </Alert>  
                        </TableCell>   
                        </TableRow> 
                        </TableBody>
                  ) }
                </Table>
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
