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
    } = useContext(AuthData);

    const onSave = () => {
        saveOrder()
    }

    return (<>
        <Card style={{height:'100%',marginBottom:'120px'}}>


            <Card.Body style={{height:'100%'}}>   
                <Card.Title className="mb-2" >สรุปรายการสั่งอาหาร</Card.Title>
                <Row>
                    {
                        cart.length !== 0 && cart?.map(item => {
                            return (<>


                                <Col md={12} xs={12}>
                                    <Card style={{ height: '130px', marginBottom: '10px', padding: '0px' }}>
                                        <Card.Body className='p-0'>
                                            <Row>
                                                <Col md={3}
                                                    xs={5}
                                                >
                                                    <Image style={{ width: "100%", height: '130px', objectFit: 'cover' }}
                                                        src={`${import.meta.env.VITE_BASE_URL}/img/${item.photo}`} />
                                                </Col>
                                                <Col md={5} xs={5}>
                                                    <div className="menu-list mt-3">
                                                        <h6>{item?.name}</h6>
                                                        <h6>{item?.price}฿</h6>
                                                    </div>

                                                    <Row>
                                                        <Col md={12}>

                                                            <Form>
                                                                <Form.Control
                                                                    className='w-100'
                                                                    type="text"
                                                                    placeholder='คำอธิบายเพิ่มเติม'
                                                                    onChange={(e) => updateNote(item.id, e.target.value)}
                                                                    defaultValue={item.note}
                                                                />
                                                            </Form>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={2} xs={2} className="text-center">
                                                    <Button
                                                        onClick={() => removeCart(item.id)}
                                                        style={{ float: 'right' }}

                                                        variant="light">
                                                        <RemoveCircleOutlineIcon />
                                                    </Button>
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
                                <Col className="mt-2">
                        <Button variant="success" onClick={() => onSave()}>
                            ยืนยันสั่งออเดอร์
                        </Button>

                    </Col>
                    <Col className="mt-2">
                        <Button variant="danger" >
                            ยกเลิก
                        </Button>
                    </Col>
                            </>
                        ) : (
                            <Alert variant='danger' className='pd-4'>
                                ยังไม่มีรายการสั่งอาหาร

                            </Alert>)
                    }


                  

                </Row>
            </Card.Body>




        </Card>
    </>)
}

export default Cart;
