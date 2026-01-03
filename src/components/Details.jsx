import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Button, Modal, ListGroup, Form } from "react-bootstrap";
import Select from 'react-select'
import { httpDelete, httpGet, httpPost, httpPut } from "../http";
import { AuthData } from "../ContextData";
import Swal from 'sweetalert2'
const Details = (props) => {
    const token = localStorage.getItem("token");
    let { bill_ID, status, id, reset } = props;
    const [detail, setDetail] = useState([]);
    const [show, setShow] = useState(false);
    const [dataMenus, setDataMenus] = useState("");
    const { shop } = useContext(AuthData);
    const [options, setOption] = useState([]);
    const [optionsFood, setOptionFood] = useState([]);
    const [onUpdate, setOnupdate] = useState(false);

    const [name, setName] = useState("");
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
        await httpGet(`/menutype/${shop?.shop_id}`, { headers: { 'apikey': token } })
            .then(res => {
                setMenuType(res.data);
            })
    }

    const getMenuByTypeId = async (id) => {
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
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const res = await httpDelete(`/billsdetails/remove/${id}`);
                if (res.status === 200) {
                    Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
                    getDetail();
                    setOnupdate(true);
                }
            } catch (error) {
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้', 'error');
                console.error(error);
            }
        }
    }


    const updateAmount = async (newPrice) => {
        const body = { amount: newPrice };
        await httpPut(`/bills/${id}`, body, { headers: { 'apikey': token } })
        await reset();
    }


    const UpdateDetailById = async () => {
        const id = dataMenus.id;
        const body = {
            foodname: name ? name : dataMenus.foodname,
            price: price ? parseInt(price) : parseInt(dataMenus.price),
            quantity: quantity ? parseInt(quantity) : parseInt(dataMenus.quantity),
            note: note ? note : dataMenus.note
        }
        await httpPut(`/billsdetails/${id}`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res) {
                    getDetail();
                    setOnupdate(true);
                }
            })
        handleClose();
    }

    const addNewMenu = async () => {
        const body = {
            bills_id: bill_ID
            , foodname: dataMenus.label
            , price: dataMenus.price
            , quantity: parseInt(quantity)
            , note: note
        };
        await httpPost(`/billsdetails`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {

                    handleClose()
                }
            })

        await getDetail();
        setOnupdate(true);
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
        if (onUpdate) {
            console.log(detail);
            let newPriceBeforeUpdate = 0;
            detail.map((item) => {
                newPriceBeforeUpdate += item.quantity * item.price;
            })
            updateAmount(newPriceBeforeUpdate);

        }
    }, [detail])

    return (<>

        {status === "รับออเดอร์แล้ว" && (<Row>
            <Col md={6}>
                <Button className="when-print" variant="success" onClick={() => handleShow('', 'newMenu')}> เพิ่มเมนูใหม่</Button>
            </Col>
        </Row>)
        }

        <ListGroup className="mt-2">

            {
                detail.map(item => {

                    return (<React.Fragment key={item.id}>
                        <Row>
                            <Col md={8}>
                                <ListGroup.Item style={{ border: 'none', margin: '0px', padding: '0px', fontSize: '18px' }}>   {item.foodname}  {item.note}     {item.price}     {item.quantity}</ListGroup.Item>
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

                    </React.Fragment>)
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
                                        onChange={(e) => setName(e.target.value)}
                                        defaultValue={dataMenus?.foodname} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>จำนวน</Form.Label>
                                    <Form.Control type="text" placeholder='จำนวน'
                                        onChange={(e) => setQuantity(e.target.value)}
                                        value={quantity} />
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
                                            onChange={(e) => getMenuByTypeId(e)} />
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


