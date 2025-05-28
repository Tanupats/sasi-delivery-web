import { useContext, useState } from "react";
import { AuthData } from "../ContextData";
import { Row, Col, Card, Image, Button, Form, Alert } from "react-bootstrap";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
const Cart = () => {

    const router = useNavigate()
    const { toTal,
        cart,
        sumPrice,
        removeCart,
        saveOrder,
        updateNote,
        queue,
        setMenuPichet,
        setMenuNormal,
        updateQuantity,
        getQueueNumber,
        resetCart,
        Address,
        setAddress,
        paymentType,
        setPaymentType
    } = useContext(AuthData);

    const [loading, setLoading] = useState(false);

    const onSave = async (e) => {
        e.preventDefault();
        await getQueueNumber();
        setLoading(true);
        await saveOrder();
        setLoading(false);
        router('/Myorder');
    }

    return (<>
        <Card style={{ height: '100%', marginBottom: '120px' }}>
            <Card.Body style={{ height: '100%' }}>
                <Card.Title className="mb-4" >สรุปรายการสั่งออเดอร์</Card.Title>
                <Row>
                    {
                        cart.length !== 0 && cart?.map(item => {
                            return (<>
                                <Col md={6} xs={12} style={{ marginBottom: '12px' }} key={item.id}>
                                    <Card style={{ height: '100%', marginBottom: '10px', padding: '6px' }}>
                                        <Card.Body className='p-0'>
                                            <Row>
                                                <Col md={3}
                                                    xs={5}
                                                >
                                                    <Image style={{ width: "100%", height: '130px', objectFit: 'cover', borderRadius: '8px' }}
                                                        src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.photo}`} />
                                                </Col>
                                                <Col md={5} xs={5}>
                                                    <div className="menu-list mt-3">
                                                        <h6>{item?.name}</h6>
                                                        <h6>{item?.price}฿</h6>
                                                        <Form.Group>
                                                            <Row className="mt-2">
                                                                <Col xs={4} md={2}>
                                                                    <Button
                                                                        variant="success"
                                                                        onClick={() => { updateQuantity(item.id, item.quantity + 1) }} >+</Button>
                                                                </Col>
                                                                <Col xs={4} md={2} className="text-center p-2">
                                                                    <h6>{item.quantity}</h6>

                                                                </Col>
                                                                <Col xs={4} md={2}>
                                                                    <Button
                                                                        variant="success"
                                                                        onClick={() => {
                                                                            if (item.quantity > 1) {
                                                                                updateQuantity(item.id, item.quantity - 1);
                                                                            }
                                                                        }}
                                                                    >
                                                                        -
                                                                    </Button>
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
                                                    item.name !== 'ไข่ดาว' && item.name !== 'ข้าวสวย' && (

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
                            </>)
                        })
                    }

                    {
                        cart.length > 0 ? (
                            <>
                                <h5>รวมทั้งหมด {sumPrice} บาท</h5>
                                <h5>จำนวน {toTal} รายการ</h5>
                                <h5 style={{ color: 'red' }}> จำนวนรอ {queue} คิว </h5>

                                <Col md={12} xs={12} className="mt-2">
                                    <Form id="save" onSubmit={(e) => { onSave(e) }}>
                                        <Form.Group>
                                            <Form.Label style={{ fontWeight: 500 }}> ที่อยู่จัดส่ง    </Form.Label>
                                            <Form.Control
                                                value={Address}
                                                type="text"
                                                required
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="ระบุที่อยู่สำหรับจัดส่ง"
                                                className="mb-2" />
                                        </Form.Group>
                                        <Form.Group>
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
                                        {loading ? "กำลังบันทึก..." : <> <CheckCircleIcon /> ยืนยันสั่งออเดอร์</>}
                                    </Button>
                                </Col>
                                <Col className="mt-3">
                                    <Button
                                        className="w-100"
                                        onClick={() => resetCart()}
                                        variant="danger" >
                                        <CancelIcon />  ยกเลิกออเดอร์
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
