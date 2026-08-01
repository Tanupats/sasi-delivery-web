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
import Swal from "sweetalert2";
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
    deliveryDate,
    setDeliveryDate,
    deliverySlot,
    setDeliverySlot,
    isPreorder,
    setIsPreorder,
  } = useContext(AuthData);

  const [loading, setLoading] = useState(false);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const minDate = tomorrowDate.toISOString().slice(0, 10);

  const getProfile = async () => {
    const res = await axios
      .get(`${api_url}/bills/profile/${messengerId}`)
      .then((data) => data);
    if (res.status === 200) {
      const name = res.data?.customerName;
      setName(name);
      localStorage.setItem("name", name);
    } else {
      setName("");
    }
  };

  const onSave = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ยืนยันการสั่งซื้อ?",
      text: "เมื่อยืนยันแล้ว ระบบจะบันทึกคำสั่งซื้อ",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await saveOrder();

      await Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกคำสั่งซื้อเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
        timer: 1500,
        showConfirmButton: false,
      });

      router("/Myorder");
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกคำสั่งซื้อได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Card style={{ height: "100%", marginBottom: "120px" }}>
        <Card.Body style={{ height: "100%" }}>
          {" "}
          <Button
            className="mb-2"
            variant="outline-secondary"
            size="sm"
            onClick={() => router(-1)}
          >
            <ArrowLeft size={20} /> ย้อนกลับ
          </Button>
          <Card.Title as={"h6"} className="mb-2 text-left">
            รายการสั่งซื้อ
          </Card.Title>
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

                          <Row>
                            <Col md={6} xs={6} className="mt-2">
                              {item.option_menu === "Y" && (
                                <>
                                  <div className="d-flex gap-2">
                                    <Button
                                      size="md"
                                      variant="outline-primary"
                                      onClick={() => setMenuNormal(item.id)}
                                    >
                                      ธรรมดา
                                    </Button>

                                    <Button
                                      size="md"
                                      variant="outline-success"
                                      onClick={() =>
                                        setMenuPichet(item.id, item)
                                      }
                                    >
                                      พิเศษ
                                    </Button>
                                  </div>
                                </>
                              )}
                            </Col>
                            <Col md={6} xs={6}>
                              <Form.Control
                                className="mt-2 w-100"
                                type="text"
                                placeholder="*หมายเหตุเพิ่มเติม"
                                onChange={(e) =>
                                  updateNote(item.id, e.target.value)
                                }
                                defaultValue={item.note}
                              />
                            </Col>
                          </Row>
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
                      <Row>
                        <Col md={6} xs={12} className="mb-2">
                          <Button
                            className="w-100"
                            variant={isPreorder ? "outline-secondary" : "secondary"}
                            onClick={() => {
                              setIsPreorder(false);
                              setDeliveryDate(minDate);
                            }}
                          >
                            รับวันนี้
                          </Button>
                        </Col>
                        <Col md={6} xs={12} className="mb-2">
                          <Button
                            className="w-100"
                            variant={isPreorder ? "secondary" : "outline-secondary"}
                            onClick={() => {
                              setIsPreorder(true);
                              setOrderType("สั่งกลับบ้าน");
                              setDeliveryFee(5);
                              setDeliveryDate(minDate);
                            }}
                          >
                            พรีออเดอร์
                          </Button>
                        </Col>
                      </Row>
                      {isPreorder && (
                        <>
                          <Row className="mb-3">
                            <Col xs={12}>
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 500 }}>
                                  วันที่จัดส่ง
                                </Form.Label>
                                <Form.Control
                                  readOnly
                                  type="date"
                                  min={minDate}
                                  max={minDate}
                                  value={deliveryDate}
                                  onChange={(e) => setDeliveryDate(e.target.value)}
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col xs={12}>
                              <Form.Group>
                                <Form.Label style={{ fontWeight: 500 }}>
                                  เลือกรอบจัดส่ง
                                </Form.Label>
                                <ButtonGroup className="d-flex">
                                  <Button
                                    variant={
                                      deliverySlot === "รอบเช้า"
                                        ? "success"
                                        : "outline-success"
                                    }
                                    onClick={() => setDeliverySlot("รอบเช้า")}
                                  >
                                    รอบเช้า 10.00 - 12.00
                                  </Button>
                                  <Button
                                    variant={
                                      deliverySlot === "รอบบ่าย"
                                        ? "primary"
                                        : "outline-primary"
                                    }
                                    onClick={() => setDeliverySlot("รอบบ่าย")}
                                  >
                                    รอบบ่าย 13.00 - 15.00
                                  </Button>
                                </ButtonGroup>
                              </Form.Group>
                            </Col>
                          </Row>
                        </>
                      )}
                      {!isPreorder && (
                        <Row className="mb-2">
                        <Col md={4} xs={4} className="mb-2">
                          <Button
                            className="w-100"
                            style={{
                              backgroundColor:
                                orderType === "สั่งกลับบ้าน"
                                  ? "#dbd8d8"
                                  : "white",
                              color:
                                orderType === "สั่งกลับบ้าน"
                                  ? "#303030"
                                  : "#303030",
                              border: "1px solid #a3a2a2",
                            }}
                            onClick={() => {
                              setOrderType("สั่งกลับบ้าน");
                              getProfile();
                              setDeliveryFee(5);
                            }}
                          >
                            {" "}
                            <DeliveryDiningIcon /> <br /> จัดส่ง
                          </Button>
                        </Col>
                        <Col md={4} xs={4} className="mb-2">
                          <Button
                            className="w-100"
                            style={{
                              backgroundColor:
                                orderType === "เสิร์ฟในร้าน"
                                  ? "#dbd8d8"
                                  : "white",
                              color:
                                orderType === "เสิร์ฟในร้าน"
                                  ? "#303030"
                                  : "#303030",
                              border: "1px solid #a3a2a2",
                            }}
                            onClick={() => {
                              setOrderType("เสิร์ฟในร้าน");
                              setAddress("");
                              setDeliveryFee(0);
                            }}
                          >
                            {" "}
                            <LocalDiningIcon /> <br /> ทานร้าน
                          </Button>
                        </Col>
                        <Col md={4} xs={4} className="mb-2 d-flex">
                          <Button
                            className="w-100"
                            style={{
                              backgroundColor:
                                orderType === "รับเอง" ? "#dbd8d8" : "white",
                              color:
                                orderType === "รับเอง" ? "#303030" : "#303030",
                              border: "1px solid #a3a2a2",
                            }}
                            onClick={() => {
                              setOrderType("รับเอง");
                              setAddress("");
                              setDeliveryFee(0);
                            }}
                          >
                            {" "}
                            <ShoppingBagIcon /> <br /> รับเอง
                          </Button>
                        </Col>
                      </Row>
                      )}
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
                            ข้อมูลติดต่อ{" "}
                          </Form.Label>{" "}
                          <Form.Control
                            value={Address}
                            type="text"
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="ระบุที่อยู่จัดส่ง และเบอร์โทรติดต่อ"
                            className="mt-1"
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
                            <b style={{color:'red',marginBottom: '10px'}}>* ค่าจัดส่งนี้เฉพาะพื้นที่หนองเดิ่น มข. ส่งนอกพื้นที่รอแก้ไขภายหลัง</b>
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
                                ? "dark"
                                : "outline-dark"
                            }
                            className="w-100"
                            onClick={() => setPaymentType("bank_transfer")}
                          >
                            {" "}
                            <AccountBalanceIcon /> เงินโอน{" "}
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
                  <b>ยังไม่มีรายการอาหารในตะกร้า </b>
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
