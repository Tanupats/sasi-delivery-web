import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Form, Button, Navbar, Nav, Card, Modal } from 'react-bootstrap'
import { httpDelete, httpGet, httpPost } from "../../http";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../../ContextData";

const MenuType = () => {
    const { shop } = useContext(AuthData);
    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");
    const [showType, setShowType] = useState(false);
    const [typeName, setTypeName] = useState("");
    const handleShowType = () => setShowType(true);
    const handleCloseType = () => setShowType(false);
    const getData = async () => {
        await httpGet(`/menutype/${shop?.shop_id}`, { headers: { 'apikey': token } })
            .then(res => {
                setData(res.data);
            })
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
                    handleCloseType()
                }
            })
        getData();
    }

    useEffect(() => {
        getData();
    }
        , [])

    return (<>

        <TableContainer component={Paper} className="mt-3">
           
            <div className="text-center">
                <h6>ประเภทสินค้า</h6>
            </div>
            <Row>
                <Col>
                    <Button onClick={() => handleShowType()}>
                        <AddCircleIcon /> เพิ่มประเภท </Button>
                </Col>
            </Row>
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
                            <TableCell align="left"><Button variant="warning"> แก้ไข </Button></TableCell>
                            <TableCell align="left"><Button variant="danger"> ลบ </Button></TableCell>



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
    </>)
}
export default MenuType;