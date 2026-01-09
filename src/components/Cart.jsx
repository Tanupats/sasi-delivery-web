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
    } = useContext(AuthData);

    const [loading, setLoading] = useState(false);

    const getProfile = async () => {
        const res = await axios.get(`${api_url}/bills/profile/${messengerId}`).then((data) => data);
        if (res.status === 200) {
            setName(res.data?.customerName || "ลูกค้า");
            localStorage.setItem('name', res.data.customerName || "ลูกค้า");
        }
    }

    const onSave = async (e) => {
        e.preventDefault();
        let queueMessage = `<h4 style="color: ${queue > 9 ? 'red' : 'black'}">${queue}</h4>`;
        if (queue > 10) {
            queueMessage += `<div style="color:red;">* รอประมาณ 1.30 ชม ขึ้นไป</div>`;
        } else if (queue >= 9) {
            queueMessage += `<div style="color:red;">* รอประมาณ 40 น. - 1 ชั่วโมง </div>`;
        }

        const result = await Swal.fire({
            title: 'ยืนยันการสั่งซื้อ ?',
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
        getQueue();
        getProfile();

    }, [cart])

    return (<>
        <Card style={{ height: '100%', marginBottom: '120px' }}>
            <Card.Body style={{ height: '100%' }}>
                <Card.Title as={'h6'} className="mb-2 text-center" >สรุปรายการสั่งซื้อ</Card.Title>
                <Button
                className="mb-2"
                    variant="secondary"
                    size="sm"
                    onClick={() => router(-1)}
                >
                    <i className="bi bi-arrow-left"></i> ย้อนกลับ
                </Button>

                <Row>
                    {
                        cart.length !== 0 && cart?.map(item => {
                            return (<React.Fragment key={item.id}>
                                <Col md={6} xs={12} style={{ marginBottom: '12px' }} key={item.id}>
                                    <Card style={{ height: '100%', marginBottom: '10px', padding: '6px' }}>
                                        <Card.Body className='p-0'>
                                            <Row>
                                                <Col md={3}
                                                    xs={5}
                                                >
                                                    <Image style={{ width: "100%", height: '130px', objectFit: 'cover', borderRadius: '8px' }}
                                                        src={`${api_url}/images/${item.photo}`} />
                                                </Col>
                                                <Col md={5} xs={5}>
                                                    <div className="menu-list mt-3">
                                                        <h6>{item?.name} {item?.price} ฿</h6>
                                                        <h6></h6>
                                                        <Form.Group>
                                                            <Row className="mt-2"><Col xs={4} md={2}>
                                                                <Button
                                                                    style={{ backgroundColor: '#FD720D', border: 'none' }}
                                                                    onClick={() => {
                                                                        if (item.quantity > 1) {
                                                                            updateQuantity(item.id, item.quantity - 1);
                                                                        }
                                                                    }}
                                                                >
                                                                    -
                                                                </Button>
                                                            </Col>

                                                                <Col xs={4} md={2} className="text-center p-2">
                                                                    <h6>{item.quantity}</h6>

                                                                </Col>
                                                                <Col xs={4} md={2}>
                                                                    <Button
                                                                        style={{ backgroundColor: '#FD720D', border: 'none' }}
                                                                        onClick={() => { updateQuantity(item.id, item.quantity + 1) }} >+</Button>
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                    </div>

                                                </Col>
                                                <Col md={4} xs={2} className="text-center">
                                                    <Button
                                                        onClick={() => removeCart(item.id)}
                                                        style={{ float: 'right', color: 'red' }}
                                                        variant="light">
                                                        <RemoveCircleOutlineIcon />
                                                    </Button>
                                                </Col>
                                                {
                                                    item.name !== 'ไข่ดาว' && item.name !== 'ข้าวสวย' && item.name !== 'ไข่เจียว' && (
                                                        <Col md={4} className="mt-3">
                                                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                                <button type="button" className="btn btn-outline-primary" onClick={() => setMenuNormal(item.id)}>ธรรมดา </button>
                                                                <button type="button" className="btn btn-outline-success" onClick={() => setMenuPichet(item.id, item)}>พิเศษ </button>
                                                            </div>
                                                        </Col>
                                                    )
                                                }
                                                <Col md={12} xs={12}>
                                                    <Form.Control
                                                        className='w-100 mt-3'
                                                        type="text"
                                                        placeholder='หมายเหตุ'
                                                        onChange={(e) => updateNote(item.id, e.target.value)}
                                                        defaultValue={item.note}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </React.Fragment>)
                        })
                    }
                    {
                        cart.length > 0 ? (
                            <>
                                <h6>ยอดรวมทั้งหมด {sumPrice} บาท</h6>
                                <h6>จำนวน {toTal} รายการ</h6>
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
                                                    }}
                                                > <DeliveryDiningIcon />  จัดส่ง</Button>
                                                {/* <Button
                                                    variant={orderType === 'เสิร์ฟในร้าน' ? 'danger w-100' : 'outline-danger w-100'}
                                                    onClick={() => {
                                                        setOrderType("เสิร์ฟในร้าน");
                                                        setAddress("");
                                                    }}
                                                > <LocalDiningIcon />  ทานที่ร้าน</Button> */}
                                                <Button variant={orderType === 'รับเอง' ? 'primary w-100' : 'outline-primary w-100'}
                                                    onClick={() => {
                                                        setOrderType("รับเอง");
                                                        setAddress("");
                                                    }}                                            > <ShoppingBagIcon />  รับที่ร้าน</Button>
                                            </ButtonGroup>
                                            {
                                                orderType === "สั่งกลับบ้าน" && (
                                                    <Form.Group className="mt-2">
                                                        <Form.Label style={{ fontWeight: 500 }}> ที่อยู่จัดส่ง    </Form.Label>
                                                        <Form.Control
                                                            value={Address}
                                                            type="text"
                                                            required
                                                            onChange={(e) => setAddress(e.target.value)}
                                                            placeholder="ระบุที่อยู่สำหรับจัดส่งอาหาร"
                                                            className="mb-2" />
                                                    </Form.Group>
                                                )
                                            }
                                        </Row>
                                        <Form.Group className="mt-2">
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
                                {/* <Col md={12} className="mt-3"><h5 style={{ color: 'red' }}> รอคิวตอนนี้ {queue} คิว </h5></Col> */}
                                <Col md={12} className="mt-3">  <h6 style={{ color: 'red' }}> * รบกวนรอหน่อยนะครับ พี่ทำคนเดียวจะช้ากว่าปกติครับ </h6>  </Col>
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
                            <Alert variant='danger' className='pd-3 text-center'>
                                ยังไม่มีรายการสั่งอาหาร
                            </Alert>)
                    }
                </Row>
            </Card.Body>
        </Card>
    </>)
}

export default Cart;
