import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const FoodMenuForm = () => {
    const [show, setShow] = useState(false);
    const [foodName, setFoodName] = useState("");
    const [price, setPrice] = useState(0);
    const [img, setImg] = useState("");
    const [code, setCode] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const saveData = async () => {
        const body = { foodname: data.foodname };

        await axios.post(`${import.meta.env.VITE_BAKUP_URL}/foodmenu`, body)
            .then(res => {
                if (res.status === 200) {
                    alert('update menu success');
                }
            })
        handleClose()
        getFoodMenu()
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
    return (<>

        <Row className="mb-4">
            <Col>
            <Button onClick={()=>handleShow()}> 
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

                                                <Image src={ imgPreview} style={{width:'100%',height:'180px',objectFit:'cover'}}/>
                                                <Form.Control
                                                    type="file"
                                                    onChange={handleImageChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={5} xs={5}>
                                            <Form.Group>
                                                <Form.Label>เมนู </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => setFoodName(e.target.value)}
                                                    value={foodName} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>ราคา </Form.Label>

                                                <Form.Control type="text" 
                                               onChange={(e) => setPrice(e.target.value)}
                                               value={price} 
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>รหัสเมนู </Form.Label>

                                                <Form.Control type="text" 
                                               onChange={(e) => setCode(e.target.value)}
                                               value={code} 
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>สถานะ </Form.Label>

                                               
                                                 
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
