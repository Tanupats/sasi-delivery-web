import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FoodMenuForm from "./FoodMenuForm";
import Swal from 'sweetalert2';
import { AuthData } from "../../ContextData";
const FoodMenuAdmin = () => {
    const { user } = useContext(AuthData);
    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getMenuType = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menutype`)
            .then(res => {
                setMenuType(res.data);
            })
    }


    const getMenuBytypeId = async (id) => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/${id}`)
            .then(res => {
                setFoods(res.data);
            })
    }

    const onSelectMenu = async (obj) => {
        setData(obj);
        handleShow()
    }

    const updateData = async () => {
        const body = { foodname: data.foodname, status: data.status };
        const { id } = data;
        await axios.put(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/${id}`, body)
            .then(res => {
                if (res.status === 200) {
                    alert('update menu success');
                }
            })
        handleClose()
        getFoodMenu()
    }

    const onDeleteMenu = async (id) => {
        Swal.fire({
            title: 'คุณต้องการลบเมนูนี้หรือไม่ ?',
            text: "กดยืนยันเพื่อลบ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยันรายการ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire(
                                'ลบเมนูสำเร็จ!',
                                'success'
                            );
                            getFoodMenu();
                        }
                    }).catch(error => {
                        Swal.fire(
                            error,
                            'An error occurred while deleting the bill.',
                            'error'
                        );
                    });
            }
        });

    }


    const getFoodMenu = () => {
        fetch(import.meta.env.VITE_BAKUP_URL + '/foodmenu')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setFoods(data);
                }
            })
    }

    useEffect(() => {
        getMenuType();
        getFoodMenu();
    }, [])
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <>
            <Card>
                <Card.Title className="text-center mt-3">  รายการอาหาร</Card.Title>
                <Card.Body>

                    <Row>

                        <Col md={12} className="mb-4">

                            {
                                menuType.length > 0 && menuType?.map((item, index) => {

                                    return (


                                        <Badge
                                            key={index}
                                            style={{
                                                marginRight: '12px',
                                                fontSize: '18px',
                                                backgroundColor: '#FD720D', marginBottom: '12px'
                                            }}
                                            onClick={() => getMenuBytypeId(item.id)}
                                            pill bg="">
                                            {item.name}
                                        </Badge>

                                    )
                                })
                            }

                        </Col>

                        <FoodMenuForm />

                        <div className="menu-list" style={{ overflow: 'auto', height: '100vh' }}>
                            <Row>


                                {
                                    foods?.map((item, index) => {
                                        return (<React.Fragment key={index}>


                                            <Col md={6} xs={12} >
                                                <Card style={{ height: 'auto', marginBottom: '12px' }}>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col md={4}
                                                                xs={4}
                                                            >
                                                                <Image style={{ width: "100%", height: '100px', objectFit: 'cover' }}
                                                                    src={`${import.meta.env.VITE_BAKUP_URL}/images/${item.img}`} />
                                                            </Col>
                                                            <Col md={4} xs={4}>

                                                                <h5>{item.foodname}</h5>
                                                                <h5>{item.Price}฿</h5>
                                                            </Col>
                                                            <Col md={4} xs={4} className="text-center">
                                                                <Button
                                                                    onClick={() => onSelectMenu(item)}
                                                                    variant="light"
                                                                >
                                                                    <EditIcon />
                                                                </Button> {' '}
                                                                <Button
                                                                    onClick={() => onDeleteMenu(item.id)}
                                                                    variant="danger"
                                                                >
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </Col>
                                                        </Row>

                                                    </Card.Body>


                                                </Card>

                                            </Col>
                                        </React.Fragment>)
                                    })
                                }
                            </Row>
                        </div>
                    </Row>


                </Card.Body>
            </Card>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขเมนูอาหาร</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>


                        <Row>

                            <Col md={12} xs={12}>
                                <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                                    <Card.Body className='p-0'>
                                        <Row>
                                            <Col md={5}
                                                xs={5}
                                            >
                                                <Image style={{ width: "100%", height: '180px', objectFit: 'cover' }}
                                                    src={`${import.meta.env.VITE_BASE_URL}/img/${data.img}`} />
                                            </Col>
                                            <Col md={5} xs={5}>
                                                <Form.Group>
                                                    <Form.Label>เมนู </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        onChange={(e) => setData({ ...data, foodname: e.target.value })}
                                                        defaultValue={data?.foodname} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>ราคา </Form.Label>

                                                    <Form.Control
                                                        onChange={(e) => setData({ ...data, Price: e.target.value })}
                                                        type="text"
                                                        defaultValue={data?.Price} />
                                                </Form.Group>
                                                {

                                                    data.status === 1 && (

                                                        <Form.Group>
                                                            <Form.Label> มีจำหน่าย</Form.Label>
                                                            <Form.Check checked={data.status} onClick={() => setData({ ...data, status: 0 })} />
                                                        </Form.Group>
                                                    )
                                                }
                                                {

                                                    data.status === 0 && (
                                                        <Form.Group>
                                                            <Form.Label> สินค้าหมด</Form.Label>
                                                            <Form.Check checked={data.status} onClick={() => setData({ ...data, status: 1 })} />
                                                        </Form.Group>
                                                    )}

                                            </Col>

                                        </Row>

                                    </Card.Body>


                                </Card>

                            </Col>


                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="success" onClick={() => updateData()}>
                        แก้ไข
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                </Modal.Footer>


            </Modal>
        </>)
}

export default FoodMenuAdmin;