import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, ListGroup, Form } from "react-bootstrap";
import axios from "axios";
import Select from 'react-select'
const Details = (props) => {
    let { bill_ID, status } = props;
    const [detail, setDetail] = useState([]);
    const [show, setShow] = useState(false);
    const [dataMenus, setDataMenus] = useState("");

    const [options, setOption] = useState([])

    const [optionsFood, setOptionFood] = useState([])

    //MENU LIST 
    const [foodname, setFoodName] = useState("")
    const [price, setPrice] = useState(0);
    const [note, setNote] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [totalNew, setTotalNew] = useState("");

    const [formName, setFormName] = useState("");
    const [menuType, setMenuType] = useState([]);

    const handleClose = () => setShow(false);

    const handleShow = (dataMenu, name) => {
        setFormName(name)
        setDataMenus(dataMenu);
        setShow(true);
    }

    const getMenuType = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/getMenuType`)
            .then(res => {
                setMenuType(res.data);
            })

    }

    const getMenuBytypeId = async (id) => {
        console.log(id.value)
        await axios.get(`${import.meta.env.VITE_API_URL}/app/foodMenuByTypeId?typeId=${id.value}`)
            .then(res => {

                let newOption = res.data.map(item => {
                    return { label: item.foodname, value: item.foodname, price: item.Price }
                })
                setOptionFood(newOption);
            })
    }

    const getDetail = async () => {
        await axios.get(`${import.meta.env.VITE_API_URL}/app/orderDetailId?bill_ID=${bill_ID}`)
            .then(res => {
                setDetail(res.data);
            })
    }

    const deleteById = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/app/DeleteDetailById/${id}`)
            .then(res => {
                if (res.status === 200) {
                    alert("ลบเรียบร้อย")
                }
            })
        await getDetail()
        handleClose()
    }

    const UpdateDetailById = async () => {
        let id = dataMenus.id;
        let body = {
            foodname: foodname ? foodname : dataMenus.foodname,
            price: price ? price : dataMenus.price,
            quantity: quantity ? quantity : dataMenus.quantity,
            note: note ? note : dataMenus.note
        }
        await axios.put(`${import.meta.env.VITE_API_URL}/app/UpdateDetailById/${id}`, body)
            .then(res => {
                if (res.status === 200) {
                    getDetail()
                }
            })
        handleClose()
        //update total new after update foodmenu 
    }

    const addNewMenu = async () => {
        const body = {
            bill_ID: bill_ID
            , foodname: dataMenus.label
            , price: dataMenus.price
            , quantity: quantity
            , note: note
        };
        await axios.post(`${import.meta.env.VITE_API_URL}/app/saveOrderDetail`, body)
            .then(res => {
                if (res.status === 200) {
                    alert("บันทึกเมนูสำเร็จ")
                    handleClose()
                }
            })

        await getDetail()
    }

    useEffect(() => {
        getDetail();
        getMenuType();
    }, [])

    useEffect(() => {
        let newOption = menuType.map(item => {
            return { label: item.name, value: item.id }
        })
        setOption(newOption);
    }, [menuType])


    // useEffect(()=>{

    // axios.put(`${import.meta.env.VITE_API_URL}/app/updateAmount/${bill_ID}`, { amount: totalNew })

    // },[totalNew])

    useEffect(() => {
        let total = 0;
        detail.map(item => {
            total += (item.quantity * item.price)
        })

        setTotalNew(total)



    }, [detail])

    useEffect(() => {


        console.log(dataMenus)

    }, [dataMenus])


    return (<>

        <Row>



            {
                status !== "ออเดอร์พร้อมส่ง" && (
                    <Col md={6}>
                        {/* <h1>{status}</h1> */}
                        <Button className="when-print" variant="success" onClick={() => handleShow('', 'newMenu')}> เพิ่มเมนูใหม่</Button>
                    </Col>
                )
            }






        </Row>

        <ListGroup className="mt-2">

            {
                detail.map(item => {

                    return (<>
                        <Row>
                            <Col md={8}>
                                <ListGroup.Item style={{ border: 'none', margin: '0px', padding: '0px', fontSize: '18px' }}>{item.foodname} {item.note}   {item.quantity}  {item.price}</ListGroup.Item>
                            </Col>

                            {
                                status !== "ออเดอร์พร้อมส่ง" && (
                                    <Col md={4}>

                                        <Button className="when-print mb-2"
                                            variant="warning"
                                            onClick={() =>
                                                handleShow(item, 'updateMenu')}>แก้ไข</Button>
                                        {' '}
                                        <Button className="when-print mb-2" variant="danger"
                                            onClick={() => deleteById(item.id)}>ลบ</Button>
                                    </Col>
                                )}

                        </Row>

                    </>)
                })
            }


            <p style={{ fontSize: '18px' }}>รวมทั้งหมด {totalNew} บาท</p>

        </ListGroup>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>  {formName === "updateMenu" ? 'แก้ไขรายการอาหาร' : "เพิ่มเมนูใหม่"}  </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formName === "updateMenu" && (<>
                    <Form>

                        <Row>
                            <Col md={12} xs={12}>
                                <Form.Group>
                                    <Form.Label>เมนู</Form.Label>
                                    <Form.Control type="text" placeholder='เมนู'
                                        onChange={(e) => setFoodName(e.target.value)}
                                        defaultValue={dataMenus?.foodname} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>จำนวน</Form.Label>
                                    <Form.Control type="text" placeholder='เมนู'
                                        onChange={(e) => setQuantity(e.target.value)}
                                        defaultValue={dataMenus?.quantity} />
                                </Form.Group>
                                <Form.Group>

                                    <Form.Label>
                                        หมายเหตุ
                                    </Form.Label>
                                    <Form.Control type="text"
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder='หมายเหตุเพิ่มเติม'
                                        defaultValue={dataMenus?.note} />
                                </Form.Group>
                                <Form.Group>

                                    <Form.Label>ราคา</Form.Label>
                                    <Form.Control type="text"
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder='ราคา'
                                        defaultValue={dataMenus?.price} />

                                </Form.Group>

                            </Col>
                            <Row>

                                <Col md={6} className="text-center">
                                    <Button
                                        className="mt-3"
                                        onClick={() => UpdateDetailById()}
                                        style={{ float: 'left' }}
                                        variant="success">
                                        แก้ไขข้อมูล
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button
                                        className="mt-3"
                                        onClick={handleClose}
                                        style={{ float: 'left' }}
                                        variant="danger">
                                        ยกเลิก
                                    </Button>
                                </Col>
                            </Row>

                        </Row>
                    </Form>

                </>)}


                {/*  ฟอร์มแก้ไขเมนู */}
                {
                    formName === "newMenu" && (<>

                        <Form>

                            <Row>
                                <Col md={12} xs={12}>
                                    <Form.Group>
                                        <Form.Label>เลือกประเภท</Form.Label>
                                        <Select options={options} onChange={(e) => getMenuBytypeId(e)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>เลือกเมนู</Form.Label>
                                        <Select options={optionsFood} onChange={(e) => setDataMenus(e)} />
                                    </Form.Group>
                                    <Form.Group>

                                        <Form.Label>
                                            หมายเหตุ
                                        </Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder='หมายเหตุเพิ่มเติม'
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>จำนวน</Form.Label>
                                        <Form.Control type="number"
                                            defaultValue={1}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>

                                        <Form.Label>ราคา</Form.Label>
                                        <Form.Control type="text"
                                            defaultValue={dataMenus.price}
                                            onChange={(e) => setDataMenus({ ...dataMenus, price: Number(e.target.value) })}
                                            placeholder='ราคา'
                                        />

                                    </Form.Group>

                                </Col>
                                <Row>

                                    <Col md={6} className="text-center">
                                        <Button
                                            className="mt-3"
                                            onClick={() => addNewMenu()}
                                            style={{ float: 'left' }}
                                            variant="success">
                                            เพิ่มเมนูใหม่
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button
                                            className="mt-3"
                                            onClick={handleClose}
                                            style={{ float: 'left' }}
                                            variant="danger">
                                            ยกเลิก
                                        </Button>
                                    </Col>
                                </Row>

                            </Row>
                        </Form>

                    </>)
                }
            </Modal.Body>

        </Modal>

    </>
    )
}

export default Details;


