import { useContext, useState, useEffect } from "react";
import { AuthData } from "../ContextData";
import { Row, Col, Card, Image, Button, Form, Alert, ButtonGroup } from "react-bootstrap";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import Swal from 'sweetalert2';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const Cart = () => {
    const router = useNavigate()
    const { toTal,
        cart,
        sumPrice,
        removeCart,
        saveOrder,
        updateNote,
        queue,
        getQueue,
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
        setDeliveryFee
    } = useContext(AuthData);

    const [loading, setLoading] = useState(false);
    

    const getProfile = async () => {
        const res = await axios.get(`${api_url}/bills/profile/${messengerId}`).then((data) => data);
        if (res.status === 200) {
            const name = res.data?.customerName;
            setName(name);
            localStorage.setItem('name', name);
            setAddress(res.data?.address);
        } else {
            setName("");
        }
    }

    const onSave = async (e) => {
        e.preventDefault();
        await getQueue();
        let queueMessage = `<h4 style="color: ${queue > 9 ? 'red' : 'black'}">${queue}</h4>`;
        if (queue > 10) {
            queueMessage += `<div style="color:red;">* รอประมาณ 1.30 ชม ขึ้นไป</div>`;
        } else if (queue >= 9) {
            queueMessage += `<div style="color:red;">* รอประมาณ 40 น. - 1 ชั่วโมง </div>`;
        }
        const result = await Swal.fire({
            title: 'ยืนยันการสั่งซื้อ',
            html: `จำนวนคิวที่รอ ${queueMessage} คิว`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            confirmButtonColor: 'green',
            cancelButtonText: 'ยกเลิก',
            cancelButtonColor: 'red'
        });

        if (result.isConfirmed) {
            setLoading(true);
            await saveOrder();
            setLoading(false);
            router('/Myorder');
        }
    }

    useEffect(() => {
        getProfile();
        getQueue();
    }, [cart])

    return (<>
        <Card style={{ height: '100%', marginBottom: '120px' }}>
            <Card.Body style={{ height: '100%' }}>
                <Card.Title as={'h6'} className="mb-2 text-center" >สรุปรายการสั่งซื้อ</Card.Title>
                <Button
                    className="mb-2"
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => router(-1)}
                >
                    <ArrowLeft size={20} />   ย้อนกลับ
                </Button>

                <Row>
                  {
  cart.length !== 0 && cart?.map(item => {
    return (
      <Col md={4} xs={12} key={item.id} style={{ marginBottom: '10px' }}>
        <Card style={{ borderRadius: '12px', padding: '8px' }}>
          <Card.Body className="p-0">

            <Row className="align-items-center">

              {/* รูป */}
              <Col xs={4}>
                <Image
                  style={{
                    width: "100%",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                  src={`${api_url}/images/${item.photo}`}
                />
              </Col>

              {/* รายการ */}
              <Col xs={6} md={6}>
                <h6 style={{ marginBottom: "4px" }}>
                  {item.name}
                </h6>

                <b>
                  {item.price} ฿
                </b>

                {/* จำนวน */}
                <div className="d-flex align-items-center mt-2">

                  <Button
                    size="sm"
                    style={{ background: "#FD720D", border: "none" }}
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
                    style={{ background: "#FD720D", border: "none" }}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
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

              {/* ธรรมดา / พิเศษ */}
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

              {/* หมายเหตุ */}
              <Col xs={12}>
                <Form.Control
                  className="mt-2"
               
                  type="text"
                  placeholder="หมายเหตุ"
                  onChange={(e) => updateNote(item.id, e.target.value)}
                  defaultValue={item.note}
                />
              </Col>

            </Row>

          </Card.Body>
        </Card>
      </Col>
    )
  })
}
                    {
                        cart.length > 0 ? (
                            <>
                                
                                <Col md={12} xs={12} className="mt-2">
                                    <Form id="save" onSubmit={(e) => { onSave(e) }}>
                                        <Row className='order-type when-print'>
                                            <Form.Label style={{ fontWeight: 500 }}> การรับอาหาร</Form.Label>
                                            <ButtonGroup >
                                                <Button style={{
                                                    backgroundColor: orderType === "สั่งกลับบ้าน" ? "#FD720D" : "white",
                                                    color: orderType === "สั่งกลับบ้าน" ? "white" : "#FD720D",
                                                    border: "1px solid #FD720D",
                                                    width: "100%"
                                                }}
                                                    onClick={() => {
                                                        setOrderType("สั่งกลับบ้าน");
                                                        getProfile();
                                                        setDeliveryFee(5);
                                                    }}
                                                > <DeliveryDiningIcon />  จัดส่ง</Button>
                                                <Button
                                                    variant={orderType === 'เสิร์ฟในร้าน' ? 'danger w-100' : 'outline-danger w-100'}
                                                    onClick={() => {
                                                        setOrderType("เสิร์ฟในร้าน");
                                                        setAddress("");
                                                        setDeliveryFee(0);
                                                    }}
                                                > <LocalDiningIcon />  ทานที่ร้าน</Button>
                                                <Button variant={orderType === 'รับเอง' ? 'primary w-100' : 'outline-primary w-100'}
                                                    onClick={() => {
                                                        setOrderType("รับเอง");
                                                        setAddress("");
                                                        setDeliveryFee(0);
                                                    }}                                            > <ShoppingBagIcon />  รับที่ร้าน</Button>
                                            </ButtonGroup>
                                            {
                                                orderType === "สั่งกลับบ้าน" && (
                                                    <Form.Group className="mt-2">
                                                        <Form.Label style={{ fontWeight: 500 }}>ชื่อผู้รับ  </Form.Label>
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
                                                            required />
                                                        <Form.Label style={{ fontWeight: 500 }}> ที่อยู่จัดส่ง / ข้อมูลติดต่อ  </Form.Label> <br />
                                                        {/* <b style={{ color: 'red' }}>ประกาศ : สำหรับพรุ่งนี้เป็นต้นไป ทางร้านขออนุญาตคิดค่าบริการจัดส่ง ขอบคุณครับ</b> */}
                                                        <Form.Control
                                                            value={Address}
                                                            type="text"
                                                            required
                                                            onChange={(e) => setAddress(e.target.value)}
                                                            placeholder="ระบุที่อยู่จัดส่ง และ เบอร์โทรติดต่อถ้ามี"
                                                            className="mb-2 mt-1" />
                                                    </Form.Group>
                                                )
                                            }
                                        </Row>
                                        <Form.Group className="mt-2">
                                            <h6>ยอดรวมค่าอาหาร {sumPrice} บาท</h6>
                                           {orderType === "สั่งกลับบ้าน" && <h6>ค่าจัดส่ง : {deliveryFee} บาท</h6>}
                                            <h6>จำนวน {toTal} รายการ</h6>
                                            <h6>รวมทั้งหมด : {sumPrice + deliveryFee} บาท</h6>

                                            <Form.Label style={{ fontWeight: 500 }}>  เลือกวิธีชำระเงิน </Form.Label>
                                            <Row>
                                                <Col md={2} xs={6}>
                                                    <Button variant={paymentType === "bank_transfer" ? "primary" : "outline-primary"} className="w-100"
                                                        onClick={() => setPaymentType("bank_transfer")}
                                                    > <AccountBalanceIcon /> โอนจ่าย </Button>
                                                </Col>
                                                <Col md={2} xs={6}>
                                                    <Button variant={paymentType === "cash" ? "success" : "outline-success"}
                                                        onClick={() => setPaymentType("cash")}
                                                        className="w-100"
                                                    >  <PaymentsIcon /> ชำระเงินสด  </Button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Form>
                                </Col>

                                <Col className="mt-3">

                                    <Button
                                        className="w-100"
                                        form="save" type="submit"
                                        variant="success"
                                        disabled={loading}>
                                        {loading ? "กำลังบันทึก..." : <> <CheckCircleIcon /> ยืนยัน</>}
                                    </Button>
                                </Col>
                                <Col className="mt-3">
                                    <Button
                                        className="w-100"
                                        onClick={() => resetCart()}
                                        variant="danger" >
                                        <CancelIcon />  ล้างตะกร้า
                                    </Button>
                                </Col>
                            </>
                        ) : (
                            <Col>

                                <Alert variant='danger' className='pd-3 text-center text-bold mt-3'>
                                    <b>ไม่มีรายการอาหาร</b>   
                                </Alert></Col>)
                    }
                </Row>
            </Card.Body>
        </Card>
    </>)
}

export default Cart;
