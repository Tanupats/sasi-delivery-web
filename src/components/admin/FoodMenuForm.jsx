import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../../ContextData";
import Swal from 'sweetalert2';
import { httpGet, httpPost } from "../../http";
const FoodMenuForm = (props) => {
    const { getFoodMenu } = props;
    const { shop } = useContext(AuthData);
    const [show, setShow] = useState(false);
    
    const [foodname, setFoodName] = useState("");
    const [price, setPrice] = useState(50);
    const [img, setImg] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState("1");
    const [menuType, setMenuType] = useState([]);
    const [menuTypeId, setMenuTypeId] = useState("");
   
    const token = localStorage.getItem("token");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    

    const getMenuType = async () => {
        await httpGet(`/menutype/${shop?.shop_id}`, { headers: { 'apikey': token } })
            .then(res => {
                console.log(res.data)
                setMenuType(res.data);
            })
    }

    let filename = "";
    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', img);
        await httpPost(`/upload`, formData)
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data.filename)
                    filename = res.data.filename
                }
            })
        handleClose();
    }


    const postMenu = async (e) => {
        e.preventDefault()
        await uploadFile();
        if (filename !== '') {
            const body = {
                foodname: foodname,
                TypeID: parseInt(menuTypeId),
                Price: parseInt(price),
                img: filename, code: code,
                status: parseInt(status),
                shop_id: shop.shop_id
            };
            await httpPost(`/foodmenu`, body, { headers: { 'apikey': token } })
                .then(res => {
                    if (res.status === 200) {
                        Swal.fire({
                            title: 'บันทึกข้อมูลสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ยืนยัน',
                            timer: 1300
                        })
                        getFoodMenu();
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
    }, [shop])

    useEffect(() => {
        if (menuType?.length > 0) {
            setMenuTypeId(menuType[0].id);
        }

    }, [menuType])


    return (<>

        <Row className="mb-3">
            <Col>
                <Button  variant="success" onClick={() => handleShow()}>
                    <AddCircleIcon /> เพิ่มเมนูใหม่ </Button>
            </Col>
           

        </Row>
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>เพิ่มเมนู</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="addmenu" onSubmit={(e) => postMenu(e)}>
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
                                                    required
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
                                                    {menuType.map((item, index) => {
                                                        return (<option key={index} value={item.id}>{item.name}</option>)
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
                <Button
                    form="addmenu"
                    type="submit"
                    variant="success"
                >
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
