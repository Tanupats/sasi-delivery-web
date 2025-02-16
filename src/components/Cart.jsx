import React, { useContext } from "react";
import { AuthData } from "../ContextData";
import { Row, Col, Card, Image, Button, Modal, Form, Alert } from "react-bootstrap";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Cart = () => {
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
        resetCart
    } = useContext(AuthData);

    const onSave = () => {
        saveOrder()
    }

    return (<>
        <Card style={{ height: '100%', marginBottom: '120px' }}>


            <Card.Body style={{ height: '100%' }}>
                <Card.Title className="mb-4" >สรุปรายการสั่งอาหาร</Card.Title>
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
                                                    <Image style={{ width: "100%", height: '130px', objectFit: 'cover' }}
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
                                                                            if (item.quantity > 1) { // เช็คว่ามากกว่า 1 ก่อนลดค่า
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
                                                <Col md={4} className="mt-3">
                                                    <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                        <button type="button" className="btn btn-outline-primary" onClick={() => setMenuNormal(item.id)}>ธรรมดา </button>
                                                        <button type="button" className="btn btn-outline-success" onClick={() => setMenuPichet(item.id, item)}>พิเศษ </button>
                                                    </div>
                                                </Col>
                                                <Col md={12} xs={12}>

                                                    <Form>
                                                        <Form.Control
                                                            className='w-100 mt-3'
                                                            type="text"
                                                            placeholder='หมายเหตุพิ่มเติม'
                                                            onChange={(e) => updateNote(item.id, e.target.value)}
                                                            defaultValue={item.note}
                                                        />
                                                    </Form>
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
                                <b>รวมทั้งหมด {sumPrice} บาท</b>
                                <b>จำนวน {toTal} รายการ</b>
                                <b style={{ color: 'red' }}> จำนวนรอคิว {queue} คิว </b>
                                <Col className="mt-3">
                                    <Button variant="success" onClick={() => onSave()}>
                                        ยืนยันสั่งออเดอร์
                                    </Button>

                                </Col>
                                <Col className="mt-3">
                                    <Button
                                        onClick={() => resetCart()}
                                        variant="danger" >
                                        ยกเลิกออเดอร์
                                    </Button>
                                </Col>
                            </>
                        ) : (
                            <Alert variant='danger' className='pd-3'>
                                ยังไม่มีรายการสั่งอาหาร

                            </Alert>)
                    }




                </Row>
            </Card.Body>




        </Card>
    </>)
}

export default Cart;
