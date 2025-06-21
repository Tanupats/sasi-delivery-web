import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { httpDelete, httpGet, httpPost, httpPut } from "../../http";
import moment from "moment";
import { AuthData } from "../../ContextData";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
const Stock = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [item, setIem] = useState(1);
    const { shop } = useContext(AuthData);
    const token = localStorage.getItem("token");
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [stockData, setStockData] = useState("");
    const [newStock, setNewStock] = useState(1);
    const [getStock, setGetStock] = useState(1);

    const shopId = shop.shop_id
    const handleClose = () => setShow(false);
    const handleCloseAdd = () => setShowAdd(false);

    const getData = async () => {
        if (shopId !== null) {
            await httpGet(`/stock?shop_id=${shopId}`)
                .then((data) => {
                    if (data) {
                        setData(data.data);
                    }
                })
        }

    }

    const postData = async () => {
        const body = {
            name: name,
            product_id: "",
            shop_id: shopId,
            stock_quantity: parseInt(item)
        }
        await httpPost('/stock', body)
            .then((res) => {
                if (res.status === 200) {
                    Swal.fire({
                        title: 'บันทึกสำเร็จ',
                        text: 'เพิ่มสต็อกสินค้า',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                        timer: 1300
                    });
                    getData();
                }
            })
    }

    const updateData = async (quantity, id) => {
        const body = {
            stock_quantity: parseInt(quantity)
        }
        await httpPut('/stock/' + id, body)
            .then((res) => {
                if (res) {
                    getData();
                }
            })
    }

    const updateStock = async (e) => {
        e.preventDefault();
        //จำนวนเบิกใช้
        const oldItem = parseInt(stockData.stock_quantity)

        let totalGet = parseInt(oldItem - getStock);

        const body = {
            stock_quantity: totalGet
        }
        await httpPut('/stock/' + stockData.id, body)
            .then((res) => {
                if (res) {
                    getData();
                    handleClose();
                }
            })
    }

    const updateAddStock = async (e) => {
        e.preventDefault();
        //จำนวนรับเข้า 
        const oldItemNew = parseInt(stockData.stock_quantity)
        const totalNew = parseInt(oldItemNew + newStock);
        const body = {
            stock_quantity: totalNew
        }
        await httpPut(`/stock/ ${stockData.id}`, body)
            .then((res) => {
                if (res) {
                    getData();
                    handleCloseAdd();
                }
            })
    }

    const deleteData = async (id) => {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await httpDelete(`/stock/${id}`, {
                        headers: { 'apikey': token }
                    });
                    if (res) {
                        getData();
                        Swal.fire({
                            title: 'ลบข้อมูล',
                            text: 'ลบข้อมูลสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ยืนยัน',
                            timer: 1300
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถลบข้อมูลได้',
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    });
                }
            }
        });
    };

    const onClickRow = (row) => {
        setShow(true);
        setStockData(row)
    }

    const onClickRowAdd = (row) => {
        setShowAdd(true);
        setStockData(row)
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Card className="mt-4">


                <Card.Body>
                    <Card.Title> จัดการสต๊อกสินค้า</Card.Title>   <Form>
                        <Row>

                            <Col md={4}>
                                <Form.Label>
                                    รายการ
                                </Form.Label>
                                <Form.Control
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    type="text" placeholder="ชื่อสินค้า" />



                            </Col>
                            <Col md={4}>
                                <Form.Label>
                                    จำนวน
                                </Form.Label>
                                <Form.Control
                                    required
                                    onChange={(e) => setIem(e.target.value)}
                                    type="text"
                                    placeholder="จำนวน" />

                            </Col>

                        </Row>
                        <Row>


                            <Col md={4} className="mt-3">
                                <Button className="w-50" onClick={() => postData()}> บันทึก </Button>
                            </Col>

                        </Row>
                    </Form>

                    <TableContainer component={Paper} className="mt-3">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ลำดับ</TableCell>
                                    <TableCell align="left">รายการ</TableCell>
                                    <TableCell align="left">วันที่บันทึก</TableCell>
                                    <TableCell align="left">จำนวนคงเหลือ</TableCell>
                                    <TableCell align="left">จัดการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.length > 0 && data?.map((row, index) => (
                                    <TableRow
                                        key={row.account_id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>   <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">{moment(row.created).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell align="left">

                                            {row.stock_quantity}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Button variant="primary" onClick={() => onClickRow(row)}> <RemoveIcon /> เบิกใช้ </Button> {' '}
                                            <Button variant="success" onClick={() => onClickRowAdd(row)}> <AddIcon /> รับเข้าสินค้า </Button> {' '}

                                            <Button variant="danger" onClick={() => deleteData(row.id)} > <DeleteIcon /> ลบ</Button>
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>
                </Card.Body>
            </Card>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ปรับปรุงสต็อกสินค้า-เบิกใช้</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="addmenu" onSubmit={(e) => updateStock(e)}>
                        <Row>
                            <Col md={12} xs={12}>
                                <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                                    <Card.Body className='p-0'>
                                        <Row>
                                            <Col md={6} xs={6}>
                                                <Form.Group>
                                                    <Form.Label>
                                                        รายการ

                                                    </Form.Label>
                                                    <Form.Control value={stockData.name} />
                                                </Form.Group>

                                            </Col>
                                            <Col md={6}
                                                xs={6}
                                            >
                                                <Form.Group>
                                                    <Form.Label>
                                                        จำนวนคงเหลือ

                                                    </Form.Label>
                                                    <Form.Control readOnly value={stockData.stock_quantity} />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} xs={12} className="mt-2">

                                                <Form.Group>
                                                    <Form.Label>
                                                        จำนวนเบิกใช้

                                                    </Form.Label>
                                                    <Form.Control value={getStock} onChange={(e) => setGetStock(e.target.value)} />
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
                    <Button variant="danger" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                </Modal.Footer>


            </Modal>
            <Modal size="lg" show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>ปรับปรุงสต็อกสินค้า-รับเข้าสินค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="add-menu" onSubmit={(e) => updateAddStock(e)}>
                        <Row>
                            <Col md={12} xs={12}>
                                <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                                    <Card.Body className='p-0'>
                                        <Row>
                                            <Col md={6} xs={6}>
                                                <Form.Group>
                                                    <Form.Label>
                                                        รายการ

                                                    </Form.Label>
                                                    <Form.Control value={stockData.name} />
                                                </Form.Group>

                                            </Col>
                                            <Col md={6}
                                                xs={6}
                                            >
                                                <Form.Group>
                                                    <Form.Label>
                                                        จำนวนคงเหลือ

                                                    </Form.Label>
                                                    <Form.Control readOnly value={stockData.stock_quantity} />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} xs={12} className="mt-2">

                                                <Form.Group>
                                                    <Form.Label>
                                                        จำนวนรับเข้า

                                                    </Form.Label>
                                                    <Form.Control value={newStock} onChange={(e) => setNewStock(parseInt(e.target.value))} />
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
                        form="add-menu"
                        type="submit"
                        variant="success"
                    >
                        บันทึก
                    </Button>
                    <Button variant="danger" onClick={handleCloseAdd}>
                        ยกเลิก
                    </Button>
                </Modal.Footer>


            </Modal>

        </>
    )

}
export default Stock;