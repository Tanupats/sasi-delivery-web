import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Details from "./Details";
import moment from "moment/moment";
import { httpDelete, httpGet, httpPut } from "../http";
import Swal from "sweetalert2";
import { AuthData } from "../ContextData";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SendIcon from "@mui/icons-material/Send";

const Orders = () => {
  const { shop, sendMessageToPage } = useContext(AuthData);
  const token = localStorage.getItem("token");
  const [report, setReport] = useState([]);
  const [printBillId, setPrintBillId] = useState(null);
  const [statusOrder, setStatusOrder] = useState([]);
  const [statusActive, setStatusActive] = useState("ใหม่");

  const getMenuReport = async (status) => {
    setReport([]);
    if (shop?.shop_id) {
      await httpGet(`/bills?status=${status}&shop_id=${shop?.shop_id}`, {
        headers: { apikey: token },
      }).then((res) => {
        setReport(res.data);
      });
    }
  };

  const getOrderStatus = async () => {
    if (shop?.shop_id) {
      await httpGet(`/bills/counter-order-status/${shop?.shop_id}`, {
        headers: { apikey: token },
      }).then((res) => {
        setStatusOrder([]);
        setStatusOrder(res.data);
      });
    }
  };

  const handlePrint = async (billId, id) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const body = {
      printStatus: `พิมพ์เวลา ${hours}:${minutes}`,
    };
    await httpPut(`/bills/${id}`, body);
    setPrintBillId(billId);
    setTimeout(() => {
      window.print();
    }, 2000);
  };

  const CancelOrder = async (id, bid) => {
    await httpDelete(`/bills/${id}`);
    await httpDelete(`/billsdetails/${bid}`);
    await getMenuReport("รับออเดอร์แล้ว");
  };

  const reset = async () => {
    await setReport([]);
    setPrintBillId(null);
    getMenuReport("รับออเดอร์แล้ว");
    getOrderStatus();
  };

  const UpdateStatus = async (id, status, messageid, step, ordertype) => {
    Swal.fire({
      title: "คุณต้องการอัพเดต หรือไม่ ?",
      text: "กดยืนยันเพื่ออัพเดตสถานะ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันรายการ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const body = {
          statusOrder: status,
          step: step,
        };
        httpPut(`/bills/${id}`, body).then((res) => {
          if (res) {
            if (status === "ทำเสร็จแล้ว") {
              if (messageid !== "pos") {
                if (ordertype !== "สั่งกลับบ้าน") {
                  sendMessageToPage(
                    messageid,
                    "ออเดอร์ทำเสร็จแล้วครับเข้ามาที่ร้านได้เลยนะครับ",
                  );
                } else {
                  sendMessageToPage(
                    messageid,
                    "ออเดอร์ทำเสร็จแล้วครับ รอจัดส่งนะครับ",
                  );
                }
              }
            }
            getMenuReport("รับออเดอร์แล้ว");
            getOrderStatus();
          }
        });
      }
    });
  };

  const deleteBill = async (id, bid) => {
    Swal.fire({
      title: "คุณต้องการยกเลิกออเดอร์หรือไม่ ?",
      text: "กดยืนยันเพื่อยกเลิก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันรายการ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        CancelOrder(id, bid);
      }
    });
  };

  useEffect(() => {
    getMenuReport("รับออเดอร์แล้ว");
    getOrderStatus();
  }, [shop]);

  return (
    <>
      <Row className="mt-3">
        <Col md={12}>
          <Card style={{ border: "none", marginTop: "12px" }}>
            <Form>
    <Row className="when-print">
  <ButtonGroup aria-label="Basic example">
    <Button
      style={{
        fontSize: "18px",
        borderColor: "#ff7a00",
        color: statusActive === "ใหม่" ? "#fff" : "#ff7a00",
        backgroundColor: statusActive === "ใหม่" ? "#ff7a00" : "transparent",
      }}
      onClick={() => {
        setReport([]);
        setStatusActive("ใหม่");
        getMenuReport("รับออเดอร์แล้ว");
      }}
    >
      ใหม่ {statusOrder[0]?.total}
    </Button>

    <Button
      style={{
        fontSize: "18px",
        borderColor: "#ff7a00",
        color: statusActive === "เสร็จแล้ว" ? "#fff" : "#ff7a00",
        backgroundColor: statusActive === "เสร็จแล้ว" ? "#ff7a00" : "transparent",
      }}
      onClick={() => {
        setReport([]);
        setStatusActive("เสร็จแล้ว");
        getMenuReport("ทำเสร็จแล้ว");
      }}
    >
      เสร็จแล้ว {statusOrder[2]?.total}
    </Button>

    <Button
      style={{
        fontSize: "18px",
        borderColor: "#ff7a00",
        color: statusActive === "รอดำเนินการ" ? "#fff" : "#ff7a00",
        backgroundColor: statusActive === "รอดำเนินการ" ? "#ff7a00" : "transparent",
      }}
      onClick={() => {
        setReport([]);
        setStatusActive("รอดำเนินการ");
        getMenuReport("กำลังส่ง");
      }}
    >
      รอดำเนินการ {statusOrder[1]?.total}
    </Button>

    <Button
      style={{
        fontSize: "18px",
        borderColor: "#ff7a00",
        color: statusActive === "สำเร็จ" ? "#fff" : "#ff7a00",
        backgroundColor: statusActive === "สำเร็จ" ? "#ff7a00" : "transparent",
      }}
      onClick={() => {
        setReport([]);
        setStatusActive("สำเร็จ");
        getMenuReport("ส่งสำเร็จ");
      }}
    >
      สำเร็จ {statusOrder[3]?.total}
    </Button>
  </ButtonGroup>
</Row>      <Row className="mt-4 when-print">
                <Col md={3} xs={3}>
                  <Button
                    className="w-75"
                    onClick={() => {
                      reset();
                    }}
                  >
                    {" "}
                    <RestartAltIcon /> โหลดใหม่{" "}
                  </Button>
                </Col>
              </Row>

              <Row>
                {report.map((item, index) => (
                  <React.Fragment key={index}>
                    {(printBillId === null || printBillId === item.bill_ID) && (
                      <Col md={4}>
                        <Card className="mb-4 mt-4 bd-printer" id={item.id}>
                          <Card.Body style={{ padding: "8px" }}>
                            <Card.Header className="text-center">
                              <div className="text-center">
                                <h6> คิวที่ {item.queueNumber} </h6>
                              </div>
                            </Card.Header>

                            <div className="text-center show-header">
                              <h6> {shop?.name} </h6>
                              <h6>ใบเสร็จรับเงิน</h6>
                            </div>
                            <b>
                              {" "}
                              <br /> เลขออเดอร์{" "}
                              {item.bill_ID.slice(-5).toUpperCase()}
                            </b>
                            <p>
                              เวลา {moment(item.timeOrder).format("HH:mm")} น.
                              &nbsp; วันที่{" "}
                              {moment(item.timeOrder).format("YYYY-MM-DD")}
                              <br />
                              {item?.printStatus !== null ? (
                                item?.printStatus
                              ) : (
                                <p> ออเดอร์ใหม่ </p>
                              )}
                            </p>
                            <Row>
                              <Col md={6} xs={6}>
                                <div className="when-print mb-2">
                                  {item.messengerId !== "pos" &&
                                    item.statusOrder === "รับออเดอร์แล้ว" && (
                                      <Button
                                        onClick={async () => {
                                          const result = await Swal.fire({
                                            title: "ยืนยันการส่งข้อความ",
                                            text: "คุณต้องการส่งข้อความถึงลูกค้าหรือไม่?",
                                            icon: "question",
                                            showCancelButton: true,
                                            confirmButtonText: "ส่งข้อความ",
                                            cancelButtonText: "ยกเลิก",
                                          });
                                          if (result.isConfirmed) {
                                            sendMessageToPage(
                                              item.messengerId,
                                              "ร้านรับออเดอร์แล้วครับ  ยอดรวม" +
                                                item.amount +
                                                "บาทครับ",
                                            );
                                          }
                                        }}
                                        variant="outline-secondary  w-100"
                                      >
                                        <SendIcon /> ส่งข้อความอีกครั้ง
                                      </Button>
                                    )}
                                </div>
                              </Col>
                              {item.statusOrder === "รับออเดอร์แล้ว" && (
                                <>
                                  <Col md={6} xs={6} className="mb-2">
                                    <Button
                                      className="when-print"
                                      onClick={() =>
                                        handlePrint(item.bill_ID, item.id)
                                      }
                                      variant="primary w-100"
                                    >
                                      <LocalPrintshopIcon /> พิมพ์ใบเสร็จ
                                    </Button>
                                  </Col>
                                  <Col md={6} xs={6} className="mb-2"></Col>
                                </>
                              )}
                            </Row>
                            <Alert className="when-print bg-white text-center">
                              <b>{item.statusOrder}</b>
                            </Alert>
                            <Details
                              reset={reset}
                              id={item.id}
                              bill_ID={item.bill_ID}
                              status={item.statusOrder}
                              userId={item.messengerId}
                            />

                            <Row>
                              <Col md={8}>
                                {  item.delivery_fee !== 0 && <h6>ค่าจัดส่ง {item.delivery_fee} บาท</h6> }
                                <h6>รวมทั้งหมด {item.amount} บาท</h6>
                                 
                                <h6>{item.customerName}</h6>
                                {item.address ? (
                                  <h6>จัดส่งที่-{item.address}</h6>
                                ) : (
                                  " "
                                )}
                                <h6>การรับอาหาร-{item.ordertype}</h6>
                              </Col>
                            </Row>

                            <Row className="mt-2">
                              {item.statusOrder === "รับออเดอร์แล้ว" && (
                                <Col md={6} xs={6} className="mb-2">
                                  <Button
                                    className="when-print"
                                    onClick={() => {
                                      UpdateStatus(
                                        item.id,
                                        "ทำเสร็จแล้ว",
                                        item.messengerId,
                                        2,
                                        item.ordertype,
                                      );
                                    }}
                                    variant="success w-100"
                                  >
                                    อัพเดทเป็นทำเสร็จแล้ว
                                  </Button>
                                </Col>
                              )}
                              {item.statusOrder === "รับออเดอร์แล้ว" && (
                                <>
                                  <Col md={6} xs={6} className="mb-2">
                                    <Button
                                      className="when-print"
                                      onClick={() =>
                                        deleteBill(item.id, item.bill_ID)
                                      }
                                      variant="danger w-100"
                                    >
                                      ยกเลิกออเดอร์
                                    </Button>
                                  </Col>
                                </>
                              )}
                              {item.statusOrder === "ทำเสร็จแล้ว" && (
                                <>
                                  <Col md={6} xs={6}>
                                    <Button
                                      className="when-print"
                                      onClick={() => {
                                        UpdateStatus(
                                          item.id,
                                          "กำลังส่ง",
                                          item.messengerId,
                                          3,
                                        );
                                      }}
                                      variant="success w-100"
                                    >
                                      กำลังส่ง
                                    </Button>
                                  </Col>
                                  <Col md={6} xs={6}>
                                    <Button
                                      className="when-print"
                                      onClick={() => {
                                        UpdateStatus(
                                          item.id,
                                          "ส่งสำเร็จ",
                                          item.messengerId,
                                          4,
                                        );
                                      }}
                                      variant="primary w-100"
                                    >
                                      ส่งสำเร็จ
                                    </Button>
                                  </Col>
                                </>
                              )}
                              {item.statusOrder === "กำลังส่ง" && (
                                <>
                                  <Col md={12}>
                                    <Button
                                      className="when-print"
                                      onClick={() => {
                                        UpdateStatus(
                                          item.id,
                                          "ส่งสำเร็จ",
                                          item.messengerId,
                                          4,
                                        );
                                      }}
                                      variant="success w-100"
                                    >
                                      ส่งสำเร็จ
                                    </Button>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </React.Fragment>
                ))}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Orders;
