import { useContext, useState, useEffect } from "react";
import { AuthData } from "../ContextData";
import {
  Row,
  Col,
  Card,
  Image,
  Button,
  Form,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import { showConfirmation } from "../utils/notification";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
const Cart = () => {
  const router = useNavigate();
  const {
    toTal,
    cart,
    sumPrice,
    removeCart,
    saveOrder,
    updateNote,
    setMenuPichet,
    setMenuNormal,
    updateQuantity,
    resetCart,
    Address,
    setAddress,
    paymentType,
    setPaymentType,
    setOrderType,
    orderType,
    api_url,
    messengerId,
    setName,
    name,
    deliveryFee,
    setDeliveryFee,
  } = useContext(AuthData);

  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    const res = await axios
      .get(`${api_url}/bills/profile/${messengerId}`)
      .then((data) => data);
    if (res.status === 200) {
      const name = res.data?.customerName;
      setName(name);
      localStorage.setItem("name", name);
      setAddress(res.data?.address);
    } else {
      setName("");
    }
  };

  const onSave = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ยืนยันการสั่งซื้อ",
      text: "คุณต้องการยืนยันการสั่งซื้อใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#198754", // สีเขียว Bootstrap
      cancelButtonColor: "#dc3545", // สีแดง Bootstrap
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await saveOrder();

      await Swal.fire({
        icon: "success",
        title: "สั่งซื้อสำเร็จ",
        text: "ระบบได้บันทึกคำสั่งซื้อเรียบร้อยแล้ว",
        confirmButtonColor: "#198754",
        timer: 1800,
        showConfirmButton: false,
      });

      router("/Myorder");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกคำสั่งซื้อได้",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    getProfile();
  }, [cart]);

  return (
    <>
      <Card style={{ height: "100%", marginBottom: "120px" }}>
        <Card.Body style={{ height: "100%" }}>
          <Card.Title as={"h6"} className="mb-2 text-center">
            รายการสั่งซื้อ
          </Card.Title>
          <Button
            className="mb-2"
            variant="outline-secondary"
            size="sm"
            onClick={() => router(-1)}
          >
            <ArrowLeft size={20} /> ย้อนกลับ
          </Button>

          <Row>
            {cart.length !== 0 &&
              cart?.map((item) => {
                return (
                  <Col
                    md={4}
                    xs={12}
                    key={item.id}
                    style={{ marginBottom: "10px" }}
                  >
                    <Card style={{ borderRadius: "12px", padding: "8px" }}>
                      <Card.Body className="p-0">
                        <Row className="align-items-center">
                          {/* รูป */}
                          <Col xs={4}>
                            <Image
                              title={item.name}
                              style={{
                                width: "100%",
                                height: "90px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              src={`${api_url}/images/${item.photo}`}
                            />
                          </Col>

                          {/* รายการ */}
                          <Col xs={6} md={6}>
                            <h6 style={{ marginBottom: "4px" }}>
                              {item.name}{" "}
                            </h6>

                            <b>{item.price} ฿</b>

                            {/* จำนวน */}
                            <div className="d-flex align-items-center mt-2">
                              <Button
                                size="sm"
                                style={{
                                  background: "#FD720D",
                                  border: "none",
                                }}
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity(item.id, item.quantity - 1);
                                  }
                                }}
                              >
                                -
                              </Button>

                              <span style={{ margin: "0 10px" }}>
                                {item.quantity}
                              </span>

                              <Button
                                size="sm"
                                style={{
                                  background: "#FD720D",
                                  border: "none",
                                }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </Col>

                          {/* ลบ */}
                          <Col xs={2} className="text-end">
                            <Button
                              onClick={() => removeCart(item.id)}
                              variant="gray"
                            >
                              <RemoveCircleOutlineIcon />
                            </Button>
                          </Col>

                          {item.option_menu === "Y" && (
                            <>
                              <Col xs={12} className="mt-2">
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => setMenuNormal(item.id)}
                                  >
                                    ธรรมดา
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => setMenuPichet(item.id, item)}
                                  >
                                    พิเศษ
                                  </Button>
                                </div>
                              </Col>
                            </>
                          )}

                          {/* หมายเหตุ */}
                          <Col xs={12}>
                            <Form.Control
                              className="mt-2"
                              type="text"
                              placeholder="หมายเหตุ"
                              onChange={(e) =>
                                updateNote(item.id, e.target.value)
                              }
                              defaultValue={item.note}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            {cart.length > 0 ? (
              <>
                <Col md={12} xs={12}>
                  <Form
                    id="save"
                    onSubmit={(e) => {
                      onSave(e);
                    }}
                  >
                    <div className="order-type when-print p-3">
                      <Form.Label style={{ fontWeight: 500 }}>
                        {" "}
                        เลือกวิธีรับอาหาร
                      </Form.Label>
                      <Row className="mb-2">
                        <Col md={4} xs={12} className="mb-2">
                          <Button
                            className="w-100"
                            style={{
                              backgroundColor:
                                orderType === "สั่งกลับบ้าน"
                                  ? "#FD720D"
                                  : "white",
                              color:
                                orderType === "สั่งกลับบ้าน"
                                  ? "white"
                                  : "#FD720D",
                              border: "1px solid #FD720D",
                            }}
                            onClick={() => {
                              setOrderType("สั่งกลับบ้าน");
                              getProfile();
                              setDeliveryFee(5);
                            }}
                          >
                            {" "}
                            <DeliveryDiningIcon /> จัดส่ง
                          </Button>
                        </Col>
                        <Col md={4} xs={12} className="mb-2">
                          <Button
                            variant={
                              orderType === "เสิร์ฟในร้าน"
                                ? "danger w-100"
                                : "outline-danger w-100"
                            }
                            onClick={() => {
                              setOrderType("เสิร์ฟในร้าน");
                              setAddress("");
                              setDeliveryFee(0);
                            }}
                          >
                            {" "}
                            <LocalDiningIcon /> ทานที่ร้าน
                          </Button>
                        </Col>
                        <Col md={4} xs={12} className="mb-2">
                          <Button
                            variant={
                              orderType === "รับเอง"
                                ? "primary w-100"
                                : "outline-primary w-100"
                            }
                            onClick={() => {
                              setOrderType("รับเอง");
                              setAddress("");
                              setDeliveryFee(0);
                            }}
                          >
                            {" "}
                            <ShoppingBagIcon /> รับหน้าร้าน
                          </Button>
                        </Col>
                      </Row>
                      {orderType === "สั่งกลับบ้าน" && (
                        <Form.Group className="mt-2">
                          <Form.Label style={{ fontWeight: 500 }}>
                            ผู้รับ (สามารถแก้ไขได้){" "}
                          </Form.Label>
                          <Form.Control
                            title="กรอกชื่อ facebook"
                            type="text"
                            value={name}
                            className="mb-2 mt-1"
                            onChange={(e) => {
                              localStorage.setItem("name", e.target.value);
                              setName(e.target.value);
                            }}
                            placeholder="กรอกชื่อ facebook ร้านจะติดต่อกลับทาง messenger"
                            required
                          />
                          <Form.Label style={{ fontWeight: 500 }}>
                            {" "}
                            ที่อยู่จัดส่ง / ข้อมูลติดต่อ{" "}
                          </Form.Label>{" "}
                          <br />
                          <Form.Control
                            value={Address}
                            type="text"
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="ระบุที่อยู่จัดส่ง และ เบอร์โทรติดต่อถ้ามี"
                            className="mb-2 mt-1"
                          />
                        </Form.Group>
                      )}
                    </div>

                    <Form.Group>
                      <div className="p-3">
                        <h6>ยอดรวม {sumPrice} บาท</h6>
                        {orderType === "สั่งกลับบ้าน" && (
                          <>
                            <h6>ค่าจัดส่ง : {deliveryFee} บาท </h6>
                            <p>* ค่าจัดส่งนี้เฉพาะพื้นที่หนองเดิ่น มข.</p>
                          </>
                        )}
                        <h6>จำนวน {toTal} รายการ</h6>
                        <h6>รวมทั้งหมด : {sumPrice + deliveryFee} บาท</h6>

                        <Form.Label style={{ fontWeight: 500 }}>
                          {" "}
                          เลือกวิธีชำระเงิน{" "}
                        </Form.Label>
                      </div>
                      <Row>
                        <Col md={2} xs={6}>
                          <Button
                            variant={
                              paymentType === "bank_transfer"
                                ? "primary"
                                : "outline-primary"
                            }
                            className="w-100"
                            onClick={() => setPaymentType("bank_transfer")}
                          >
                            {" "}
                            <AccountBalanceIcon /> โอนจ่าย{" "}
                          </Button>
                        </Col>
                        <Col md={2} xs={6}>
                          <Button
                            variant={
                              paymentType === "cash"
                                ? "success"
                                : "outline-success"
                            }
                            onClick={() => setPaymentType("cash")}
                            className="w-100"
                          >
                            {" "}
                            <PaymentsIcon /> ชำระเงินสด{" "}
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                </Col>

                <Col className="mt-3">
                  <Button
                    className="w-100"
                    form="save"
                    type="submit"
                    variant="success"
                    disabled={loading}
                  >
                    {loading ? (
                      "กำลังบันทึก..."
                    ) : (
                      <>
                        {" "}
                        <CheckCircleIcon /> ยืนยัน
                      </>
                    )}
                  </Button>
                </Col>
                <Col className="mt-3">
                  <Button
                    className="w-100"
                    onClick={() => resetCart()}
                    variant="danger"
                  >
                    <CancelIcon /> ยกเลิกทั้งหมด
                  </Button>
                </Col>
              </>
            ) : (
              <Col>
                <Alert
                  variant="danger"
                  className="pd-3 text-center text-bold mt-3"
                >
                  <b>ไม่มีรายการอาหาร</b>
                </Alert>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default Cart;
