import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Alert, Form, Badge } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Details from "./Details";
import moment from "moment/moment";
import { http } from "../http";
import Swal from "sweetalert2";
import { AuthData } from "../ContextData";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SendIcon from "@mui/icons-material/Send";

const Orders = () => {
  const { shop, sendMessageToPage,orderState } = useContext(AuthData);
  const token = localStorage.getItem("token");
  const [report, setReport] = useState([]);
  const [statusOrder, setStatusOrder] = useState([]);
  const [statusActive, setStatusActive] = useState("ใหม่");

  const getMenuReport = async (status) => {
    setReport([]);
    if (shop?.shop_id) {
      await http
        .get(`/bills?status=${status}&shop_id=${shop?.shop_id}`, {
          headers: { apikey: token },
        })
        .then((res) => {
          setReport(res.data);
        });
    }
  };

  const getOrderStatus = async () => {
    if (shop?.shop_id) {
      await http
        .get(`/bills/counter-order-status/${shop?.shop_id}`, {
          headers: { apikey: token },
        })
        .then((res) => {
          setStatusOrder([]);
          setStatusOrder(res.data);
        });
    }
  };

  const handlePrint = async (billId, id) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      await Swal.fire(
        "ไม่สามารถเปิดหน้าพิมพ์ได้",
        "กรุณาอนุญาตให้เว็บไซต์เปิดหน้าต่างใหม่",
        "error",
      );
      return;
    }
    printWindow.document.title = "กำลังเตรียมใบเสร็จ";
    printWindow.document.body.textContent = "กำลังเตรียมใบเสร็จสำหรับพิมพ์...";

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const body = {
      printStatus: `พิมพ์เวลา ${hours}:${minutes}`,
    };

    try {
      await http.put(`/bills/${id}`, body);
      const orderElement = document.getElementById(id);
      if (!orderElement) {
        throw new Error(`Could not find order ${id} to print`);
      }

      const printDocument = printWindow.document;
      printDocument.open();
      printDocument.write("<!doctype html><html><head></head><body></body></html>");
      printDocument.close();

      const stylesheetLoads = [];
      document
        .querySelectorAll('link[rel="stylesheet"], style')
        .forEach((styleElement) => {
          const styleCopy = styleElement.cloneNode(true);
          if (styleElement instanceof HTMLLinkElement) {
            styleCopy.href = styleElement.href;
            stylesheetLoads.push(
              new Promise((resolve) => {
                styleCopy.addEventListener("load", resolve, { once: true });
                styleCopy.addEventListener("error", resolve, { once: true });
              }),
            );
          }
          printDocument.head.appendChild(styleCopy);
        });

      const printStyles = printDocument.createElement("style");
      printStyles.textContent = `
        .print-order {
          width: 80mm;
          margin: 0 auto;
        }
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
          }
        }
      `;
      printDocument.head.appendChild(printStyles);

      const orderCopy = orderElement.cloneNode(true);
      orderCopy.querySelectorAll(".when-print").forEach((element) => {
        element.remove();
      });

      const printContainer = printDocument.createElement("main");
      printContainer.className = "print-order";
      printContainer.appendChild(orderCopy);
      printDocument.body.appendChild(printContainer);
      printDocument.title = `ใบเสร็จ ${billId}`;

      await Promise.all(stylesheetLoads);
      await printDocument.fonts.ready;
      printWindow.requestAnimationFrame(() => {
        printWindow.requestAnimationFrame(() => {
          printWindow.focus();
          printWindow.print();
        });
      });
    } catch (error) {
      printWindow.close();
      console.error("Failed to prepare order for printing", error);
      await Swal.fire(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถเตรียมใบเสร็จสำหรับพิมพ์ได้",
        "error",
      );
    }
  };

  const CancelOrder = async (id, bid) => {
    await http.delete(`/bills/${id}`);
    await http.delete(`/billsdetails/${bid}`);
    await getMenuReport("รับออเดอร์แล้ว");
  };

  const reset = async () => {
    setStatusActive("ใหม่");
    await setReport([]);
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
          statusOrder:
            ordertype === "เสิร์ฟในร้าน" || ordertype === "รับเอง"
              ? "ส่งสำเร็จ"
              : status,

          step:
            ordertype === "เสิร์ฟในร้าน" || ordertype === "รับเอง" ? 4 : step,
        };

        http.put(`/bills/${id}`, body).then((res) => {
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
          }
          getMenuReport("รับออเดอร์แล้ว");
          getOrderStatus();
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
  }, [shop, orderState]);

  return (
    <>
      <Row className="mt-3">
        <Col md={12}>
          <Card className="order-page-card">
            <Form>
              <Row className="order-status-tabs-row when-print">
                <ButtonGroup
                  className="order-status-tabs"
                  aria-label="กรองออเดอร์ตามสถานะ"
                >
                  <Button
                    className={statusActive === "ใหม่" ? "active" : ""}
                    aria-pressed={statusActive === "ใหม่"}
                    style={{
                      fontSize: "18px",
                      borderColor: "#ff7a00",
                      color: statusActive === "ใหม่" ? "#fff" : "#ff7a00",
                      backgroundColor:
                        statusActive === "ใหม่" ? "#ff7a00" : "transparent",
                    }}
                    onClick={() => {
                      reset();
                    }}
                  >
                    <span>ใหม่</span>
                    <Badge bg="light" text="dark">
                      {statusOrder[0]?.total ?? 0}
                    </Badge>
                  </Button>

                  <Button
                    className={statusActive === "เสร็จแล้ว" ? "active" : ""}
                    aria-pressed={statusActive === "เสร็จแล้ว"}
                    style={{
                      fontSize: "18px",
                      borderColor: "#ff7a00",
                      color: statusActive === "เสร็จแล้ว" ? "#fff" : "#ff7a00",
                      backgroundColor:
                        statusActive === "เสร็จแล้ว"
                          ? "#ff7a00"
                          : "transparent",
                    }}
                    onClick={() => {
                      setReport([]);
                      setStatusActive("เสร็จแล้ว");
                      getMenuReport("ทำเสร็จแล้ว");
                    }}
                  >
                    <span>เสร็จแล้ว</span>
                    <Badge bg="light" text="dark">
                      {statusOrder[2]?.total ?? 0}
                    </Badge>
                  </Button>

                  <Button
                    className={statusActive === "รอดดำเนินการ" ? "active" : ""}
                    aria-pressed={statusActive === "รอดำเนินการ"}
                    style={{
                      fontSize: "18px",
                      borderColor: "#ff7a00",
                      color:
                        statusActive === "รอดำเนินการ" ? "#fff" : "#ff7a00",
                      backgroundColor:
                        statusActive === "รอดำเนินการ"
                          ? "#ff7a00"
                          : "transparent",
                    }}
                    onClick={() => {
                      setReport([]);
                      setStatusActive("รอดำเนินการ");
                      getMenuReport("กำลังส่ง");
                    }}
                  >
                    <span>รอดำเนินการ</span>
                    <Badge bg="light" text="dark">
                      {statusOrder[1]?.total ?? 0}
                    </Badge>
                  </Button>

                  <Button
                    className={statusActive === "สำเร็จ" ? "active" : ""}
                    aria-pressed={statusActive === "สำเร็จ"}
                    style={{
                      fontSize: "18px",
                      borderColor: "#ff7a00",
                      color: statusActive === "สำเร็จ" ? "#fff" : "#ff7a00",
                      backgroundColor:
                        statusActive === "สำเร็จ" ? "#ff7a00" : "transparent",
                    }}
                    onClick={() => {
                      setReport([]);
                      setStatusActive("สำเร็จ");
                      getMenuReport("ส่งสำเร็จ");
                    }}
                  >
                    <span>สำเร็จ</span>
                    <Badge bg="light" text="dark">
                      {statusOrder[3]?.total ?? 0}
                    </Badge>
                  </Button>
                </ButtonGroup>
              </Row>

              <Row>
                {report.map((item, index) => (
                  <React.Fragment key={index}>
                      <Col md={6} lg={4} className="order-card-column">
                        <Card className="order-item-card mb-4 mt-4 bd-printer" id={item.id}>
                          <Card.Body className="order-item-body">
                            <div className="text-center show-header">
                              <div className="receipt-brand">SASI FOOD</div>
                              <div className="receipt-shop-name">{shop?.name}</div>
                              <div className="receipt-title">ใบเสร็จรับเงิน</div>
                            </div>

                            <Card.Header className="order-card-header border-0 p-0 mb-3">
                              <div className="text-start">
                                <span className="order-queue-badge">
                                  <strong>     NO-{item.queueNumber}</strong>
                                </span>
                              </div>
                            </Card.Header>

                            <div className="order-card-meta">
                              <div className="order-date">
                                <span>สั่งเวลา</span>
                                <strong>{moment(item.timeOrder).format("HH:mm")} น.</strong>
                                <small>{moment(item.timeOrder).format("DD-MM-YYYY")}</small>
                              </div>
                              <div className="order-card-tags when-print">
                                {item?.printStatus ? (
                                  <span className="order-tag order-tag-printed">
                                    {item.printStatus}
                                  </span>
                                ) : (
                                  <span
                                    className={`order-tag ${
                                      item.delivery_date
                                        ? "order-tag-preorder"
                                        : "order-tag-today"
                                    }`}
                                  >
                                    {item.delivery_date ? "พรีออเดอร์" : "จัดส่งวันนี้"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Row className="mt-2">
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
                                      <LocalPrintshopIcon /> พิมพ์
                                    </Button>
                                  </Col>
                                  
                                </>
                              )}
                              <Col md={6} xs={6}>
                                <div className="when-print mb-2">
                                  {item.messengerId !== "pos" &&
                                    item.statusOrder === "รับออเดอร์แล้ว" && (
                                      <Button
                                        onClick={async () => {
                                          const result = await Swal.fire({
                                            title: "ส่งข้อความไปยังลูกค้า",
                                            input: "textarea",
                                            inputValue:
                                              "",
                                            inputPlaceholder: "กรอกข้อความที่ต้องการส่ง",
                                            inputAttributes: {
                                              "aria-label": "กรอกข้อความที่ต้องการส่ง",
                                            },
                                            icon: "question",
                                            showCancelButton: true,
                                            confirmButtonText: "ส่งข้อความ",
                                            cancelButtonText: "ยกเลิก",
                                          });
                                          if (result.isConfirmed) {
                                            sendMessageToPage(
                                              item.messengerId,
                                              result.value,
                                            );
                                          }
                                        }}
                                        variant="outline-secondary  w-100"
                                      >
                                        <SendIcon /> ส่งข้อความ
                                      </Button>
                                    )}
                                </div>
                              </Col>
                            
                            </Row>

                            <div className="order-details-list">
                              <Details
                                reset={reset}
                                id={item.id}
                                bill_ID={item.bill_ID}
                                status={item.statusOrder}
                                userId={item.messengerId}
                              />
                            </div>
                            <Alert className="when-print order-status-alert">
                              <span>{item.statusOrder}</span>
                            </Alert>
                            <div className="order-customer-info">
                              {item.delivery_fee !== 0 && (
                                <p>
                                  ค่าจัดส่ง <strong>{item.delivery_fee} บาท</strong>
                                </p>
                              )}
                              <p className="order-total">
                                รวมทั้งหมด <strong>{item.amount} บาท</strong>
                              </p>
                              <p><strong>{item.customerName}</strong></p>
                              {item.address && <p>จัดส่งที่ {item.address}</p>}
                              {item.ordertype !== "สั่งกลับบ้าน" && (
                                <p>การรับอาหาร {item.ordertype}</p>
                              )}
                            </div>

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
                                    ทำเสร็จแล้ว
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
                                      รอดำเนินการ
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
                                      สำเร็จ
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
                                      สำเร็จ
                                    </Button>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
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
