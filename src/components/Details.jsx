import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, ListGroup, Form } from "react-bootstrap";
import Select from 'react-select'
import { httpDelete, httpGet, httpPost, httpPut } from "../http";
const Details = (props) => {
    const token = localStorage.getItem("token");
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

    const [formName, setFormName] = useState("");
    const [menuType, setMenuType] = useState([]);

    const handleClose = () => setShow(false);

    const handleShow = (dataMenu, name) => {
        setFormName(name)
        setDataMenus(dataMenu);
        setShow(true);
    }

    const getMenuType = async () => {
        await httpGet(`/menutype`)
            .then(res => {
                setMenuType(res.data);
            })
    }

    const getMenuBytypeId = async (id) => {
        await httpGet(`/foodmenu/${id.value}`)
            .then(res => {

                let newOption = res.data.map(item => {
                    return { label: item.foodname, value: item.foodname, price: parseInt(item.Price) }
                })
                setOptionFood(newOption);
            })
    }

    const getDetail = async () => {
        await httpGet(`/billsdetails/${bill_ID}`)
            .then(res => {
                setDetail(res.data);
            })
    }

    const deleteById = async (id) => {
        await httpDelete(`/billsdetails/remove/${id}`)
            .then(res => {
                if (res.status === 200) {
                    getDetail()
                }
            })

        handleClose()
    }

    const updateAmount = async ()=>{
        const body = {};
        await httpPut(`/billsdetails/${bill_ID}`)
    }


    const UpdateDetailById = async () => {
        let id = dataMenus.id;
        let body = {
            foodname: foodname ? foodname : dataMenus.foodname,
            price: price ? price : dataMenus.price,
            quantity: quantity ? quantity : dataMenus.quantity,
            note: note ? note : dataMenus.note
        }
        await httpPut(`/billsdetails/${id}`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {
                    getDetail()
                }
            })
        handleClose()
    }

    const addNewMenu = async () => {
        const body = {
            bills_id: bill_ID
            , foodname: dataMenus.label
            , price: dataMenus.price
            , quantity: quantity
            , note: note
        };
        await httpPost(`/billsdetails`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {

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



    useEffect(() => {
        console.log(dataMenus)
    }, [dataMenus])

    useEffect(() => {
        console.log(detail)
    }, [detail])

    return (<>

        <Row>


            <Col md={6}>

                <Button className="when-print" variant="success" onClick={() => handleShow('', 'newMenu')}> เพิ่มเมนูใหม่</Button>
            </Col>


        </Row>

        <ListGroup className="mt-2">

            {
                detail.map(item => {

                    return (<>
                        <Row>
                            <Col md={8}>
                                <ListGroup.Item style={{ border: 'none', margin: '0px', padding: '0px', fontSize: '18px' }}> X   {item.quantity}  {item.foodname}  {item.note}  {item.price}</ListGroup.Item>
                            </Col>

                            {
                                status === "รับออเดอร์แล้ว" && (
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
                                        <Select
                                            placeholder="เลือกประเภท"
                                            options={options}
                                            onChange={(e) => getMenuBytypeId(e)} />
                                    </Form.Group>

                                    <Form.Group className="mt-2">
                                        <Form.Label>รายการอาหาร</Form.Label>
                                        <Select
                                            placeholder="เลือกเมนู"
                                            options={optionsFood}
                                            onChange={(e) => setDataMenus(e)} />
                                    </Form.Group>
                                    <Form.Group className="mt-2">

                                        <Form.Label>
                                            หมายเหตุ
                                        </Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder='หมายเหตุเพิ่มเติม'
                                        />
                                    </Form.Group>
                                    <Form.Group className="mt-2">
                                        <Form.Label>จำนวน</Form.Label>
                                        <Form.Control type="number"
                                            defaultValue={1}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mt-2">

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
                                            บันทึก
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


