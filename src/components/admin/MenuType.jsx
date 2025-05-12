import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button, Card, Modal } from 'react-bootstrap'
import { httpDelete, httpGet, httpPost, httpPut } from "../../http";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../../ContextData";
import Swal from 'sweetalert2';
const MenuType = () => {
    const { shop } = useContext(AuthData);
    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");
    const [showType, setShowType] = useState(false);
    const [typeName, setTypeName] = useState("");
    const [show, setShow] = useState(false);
    const [id, setId] = useState("");
    const handleShowType = () => setShowType(true);
    const handleCloseType = () => setShowType(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getData = async () => {
        await httpGet(`/menutype/${shop?.shop_id}`, { headers: { 'apikey': token } })
            .then(res => {
                setData(res.data);
            })
    }

    const onEditData = (payload) => {
        handleShow();
        setTypeName(payload.name);
        setId(payload.id);
    }

    const onDeleteData = async (payload) => {
        const { id } = payload;
        await httpDelete(`/menutype/${id}`, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        title: 'ลบข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                        timer: 1300
                    })
                }
            })
        getData();
    }

    const postMenuType = async (e) => {
        e.preventDefault()
        const body = {
            name: typeName,
            shop_id: shop.shop_id
        };
        await httpPost(`/menutype`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        title: 'บันทึกข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                        timer: 1300
                    })
                    handleCloseType();
                }
            })
        getData();
    }

    const updateMenuType = async () => {
        const body = {
            name: typeName,
        };
        await httpPut(`/menutype/${id}`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        title: 'แก้ไขข้อมูลสำเร็จ',
                        text: 'บันทึกข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                        timer: 1300
                    })
                }
            })
        handleClose();
        getData();
    }

    useEffect(() => {
        if (shop.shop_id) {
            getData();
        }
    }, [shop])

    return (<>
        <Card>
            <Card.Body>
                <Card.Title className="text-center mt-3">  ประเภทสินค้า</Card.Title>
                <Row>
                    <Col>
                        <Button onClick={() => handleShowType()}>
                            <AddCircleIcon />  เพิ่มประเภท </Button>
                    </Col>
                </Row>
                <TableContainer component={Paper} className="mt-3">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">ลำดับ</TableCell>
                                <TableCell align="left">รายการ</TableCell>
                                <TableCell align="left">จัดการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.length > 0 && data?.map((row, index) => (
                                <TableRow
                                    key={row.account_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">
                                        <Button variant="warning" onClick={() => onEditData(row)}> แก้ไข  </Button> {" "}
                                        <Button variant="danger" onClick={() => onDeleteData(row)}> ลบ </Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal size="lg" show={showType} onHide={handleCloseType}>
                    <Modal.Header closeButton>
                        <Modal.Title>เพิ่มประเภท</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="addmenu" onSubmit={(e) => postMenuType(e)}>
                            <Row>
                                <Col md={12} xs={12}>
                                    <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                                        <Card.Body className='p-0'>
                                            <Row>

                                                <Col md={12} xs={12}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>ประเภท </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="ชื่อประเภท"
                                                            onChange={(e) => setTypeName(e.target.value)}
                                                            value={typeName} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            form="addmenu"
                            type="submit"
                            variant="success"
                        >
                            บันทึก
                        </Button>
                        <Button variant="danger" onClick={handleCloseType}>
                            ยกเลิก
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขข้อมูลประเภทสินค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={12} xs={12}>
                                <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                                    <Card.Body className='p-0'>
                                        <Row>
                                            <Col md={12} xs={12}>
                                                <Form.Group>
                                                    <Form.Label>ประเภท </Form.Label>
                                                    <Form.Control
                                                        onChange={(e) => setTypeName(e.target.value)}
                                                        type="text"
                                                        defaultValue={typeName} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col md={6} xs={6}>
                            <Button variant="success" onClick={() => updateMenuType()}>
                                บันทึก
                            </Button>
                        </Col>
                        <Col md={6} xs={6}>
                            <Button variant="danger" onClick={handleClose}>
                                ยกเลิก
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </Card>

    </>)
}
export default MenuType;