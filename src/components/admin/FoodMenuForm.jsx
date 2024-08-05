import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import AddCircleIcon from '@mui/icons-material/AddCircle';
const FoodMenuForm = () => {
    const [show, setShow] = useState(false);
    const [foodname, setFoodName] = useState("");
    const [price, setPrice] = useState(50);
    const [img, setImg] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState("1");
    const [menuType, setMenuType] = useState([]);
    const [menuTypeId, setMenuTypeId] = useState("");
    const [filename, setFilename] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const getMenuType = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menutype`)
            .then(res => {
                setMenuType(res.data);
            })
    }

    const saveData = async () => {
        const formData = new FormData();
        formData.append('file', img);
        await axios.post(`${import.meta.env.VITE_BAKUP_URL}/upload`, formData)
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data.filename)
                    setFilename(res.data.filename);
                }
            })
        handleClose()
    }

    const postMenu = async () => {
        if (filename !== '') {
            const body = {
                foodname: foodname,
                TypeID: parseInt(menuTypeId),
                Price: parseInt(price),
                img: filename, code: code,
                status: parseInt(status)
            };
            await axios.post(`${import.meta.env.VITE_BAKUP_URL}/foodmenu`, body)
                .then(res => {
                    if (res.status === 200) {
                        alert('created menu success');
                        setFilename("")
                    }
                })

        }

    }

    const [imgPreview, setImgPreview] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImg(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImgPreview(null);
        }
    };

    useEffect(() => {
        getMenuType()
    }, [])

    useEffect(() => {

        postMenu()
    }, [filename])
    return (<>

        <Row className="mb-4">
            <Col>
                <Button onClick={() => handleShow()}>
                    <AddCircleIcon /> เพิ่มเมนู </Button>
            </Col>

        </Row>
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>เพิ่มเมนู</Modal.Title>
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
                                            <Form.Group>
                                                <Form.Label>รูปภาพ </Form.Label>

                                                <Image src={imgPreview} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                                <Form.Control
                                                    type="file"
                                                    onChange={handleImageChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={7} xs={7}>
                                            <Form.Group className="mb-2">
                                                <Form.Label>เมนู </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="เมนู"
                                                    onChange={(e) => setFoodName(e.target.value)}
                                                    value={foodname} />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>ราคา </Form.Label>

                                                <Form.Control type="text"
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    value={price}
                                                    placeholder="ราคา"
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>รหัสเมนู </Form.Label>

                                                <Form.Control type="text"
                                                    placeholder="รหัสเมนู"
                                                    onChange={(e) => setCode(e.target.value)}
                                                    value={code}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>ประเภท </Form.Label>
                                                <Form.Select
                                                    onChange={(e) => setMenuTypeId(e.target.value)}
                                                    aria-label="Default select example">
                                                    {menuType.map((item) => {
                                                        return (<option value={item.id}>{item.name}</option>)
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>สถานะ </Form.Label>
                                                <Form.Select
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    aria-label="Default select example">
                                                    <option value="1">พร้อมขาย</option>
                                                    <option value="0">ของหมด</option>
                                                </Form.Select>
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
                <Button variant="success" onClick={() => saveData()}>
                    เพิ่มเมนู
                </Button>
                <Button variant="danger" onClick={handleClose}>
                    ยกเลิก
                </Button>
            </Modal.Footer>


        </Modal>
    </>
    )

}
export default FoodMenuForm;
