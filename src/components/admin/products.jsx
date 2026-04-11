import { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import FoodMenuForm from "./FoodMenuForm";
import Swal from 'sweetalert2';
import { AuthData } from "../../ContextData";
import { getMenuType } from "../../api";
import { httpDelete, httpGet, httpPut, httpPost } from "../../http";
const Products = () => {
    const { shop } = useContext(AuthData);
    const [foods, setFoods] = useState([]);
    const [menuType, setMenuType] = useState([]);
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const token = localStorage.getItem("token");

    const shopId = shop?.shop_id;

    const getType = async () => {
        if (shopId !== undefined) {
            const data = await getMenuType(shopId, token);
            setMenuType(data);
        }
    }

    const getMenuByTypeId = async (id) => {
        if (id === "all") {
            getFoodMenu();
            return;
        }
        await httpGet(`/foodmenu/${id}`)
            .then(res => {
                setFoods(res.data);
            })
    }

    const onSelectMenu = async (obj) => {
        setData(obj);
        setSelectedImage(null);
        setImagePreview(null);
        setImageFile(null);
        handleShow();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            setSelectedImage(file.name);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    let filename = "";

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', imageFile);
        await httpPost(`/upload`, formData)
            .then(res => {
                if (res.status === 200) {
                    filename = res.data.filename
                }
            })
        handleClose();
    }

    const updateData = async () => {
        if (imageFile) {
            await uploadFile();
        }

        const body = {
            foodname: data.foodname,
            status: data.status,
            Price: data.Price,
            notes: data.notes,
            shop_id: data.shop_id,
            img: filename !== '' ? filename : data.img
        };

        const { id } = data;
        await httpPut(`/foodmenu/${id}`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        title: 'แก้ไขเมนู',
                        text: 'บันทึกข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                        timer: 1300
                    })
                }
            })
        handleClose();
        getFoodMenu();
    }

    const updateStatus = async (id, val, TypeID) => {
        const body = { status: val };
        await httpPut(`/foodmenu/${id}`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res.status === 200) {
                    getMenuByTypeId(TypeID);
                }
            })
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
                httpDelete(`/foodmenu/${id}`, { headers: { 'apikey': token } })
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire(
                                'ลบข้อมูลสินค้าสำเร็จ!',
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
        if (shopId !== undefined) {
            httpGet(`/foodmenu/getByShop/${shopId}`, { headers: { 'apikey': token } })
                .then((res) => {
                    if (res.data) {
                        setFoods(res.data);
                    }
                })
        }
    }

    useEffect(() => {
        if (shopId) {
            getFoodMenu();
            getType();
        }
    }, [shop])

    return (
        <>
            <Card style={{ width: '100%', borderRadius: 0 }}>
                <Card.Body>
                    <Row>
                        <Col md={12}>
                            <div className="border p-3 mb-2">

                                <div className="row align-items-center">
                                    <div className="col-md-3">

                                        <select className="form-select" onChange={(e) => getMenuByTypeId(e.target.value)}>
                                            <option value="all">ทั้งหมด</option>
                                            {
                                                menuType.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>

                                    </div>
 <div className="col-md-3">
                                        <FoodMenuForm
                                        getMenuType={getMenuType}
                                        getFoodMenu={getFoodMenu} />
                                    </div>
                                    <div className="col-md-4">
                                                <div className="d-flex">
 <input className="form-control me-2" type="search" placeholder="ค้นหาสินค้า" />
                                            <button className="btn btn-outline-success" type="submit">ค้นหา</button>
                                       

                                                </div>
                                           
                                        

                                    </div>
                                   
                                    
                                </div>
                            </div>
                        </Col>

                        <div className="menu-list" style={{ overflow: 'auto', height: '600px' }}>
                            <Row>
                                {
                                    foods?.map((item, index) => {
                                        return (<React.Fragment key={index}>
                                            <Col md={4} xs={12} >
                                                <Card style={{ height: 'auto', marginBottom: '12px', padding: 2 }}>
                                                    <Card.Body style={{ padding: 5 }}>
                                                        <Row>
                                                            <Col md={4}
                                                                xs={4}
                                                            >
                                                                <Image style={{ width: "100%", height: '160px', objectFit: 'cover' }}
                                                                    src={`${import.meta.env.VITE_API_URL}/images/${item.img}`} />
                                                            </Col>
                                                            <Col md={8} xs={8}>
                                                                <div className="mt-3">
                                                                    <h5>{item.foodname}</h5>
                                                                    <h5>{item.Price}฿</h5>
                                                                </div>

                                                                {
                                                                    item.status === 1 && (<>
                                                                        <Button variant="success"
                                                                            onClick={() => updateStatus(item.id, 0, item.TypeID)}
                                                                        >มีจำหน่าย</Button>{' '}</>)

                                                                }
                                                                {
                                                                    item.status === 0 && (<>
                                                                        <Button variant="danger"
                                                                            onClick={() => updateStatus(item.id, 1, item.TypeID)}
                                                                        >ของหมด</Button>{' '}</>)

                                                                }

                                                                <Button
                                                                    onClick={() => onSelectMenu(item)}
                                                                    variant="warning"
                                                                >
                                                                    <EditIcon /> แก้ไข
                                                                </Button> {' '}
                                                              
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
                    <Modal.Title>แก้ไขข้อมูลสินค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={12} xs={12}>
                                <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                                    <Card.Body className='p-0'>
                                        <Row>
                                            <Col md={6}
                                                xs={6}
                                            >
                                                <Image style={{ width: "100%", objectFit: 'cover' }}
                                                    src={imagePreview || `${import.meta.env.VITE_API_URL}/images/${data.img}`} />

                                                <div className="mt-3" style={{ textAlign: 'center' }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        fullWidth
                                                        onClick={() => fileInputRef.current?.click()}
                                                        style={{
                                                            textTransform: 'none',
                                                            fontWeight: 'bold',
                                                            marginBottom: '10px',
                                                            borderColor: '#1976d2',
                                                            color: '#1976d2',
                                                            borderWidth: '2px'
                                                        }}
                                                    >
                                                        <CloudUploadIcon style={{color:'#1976d2'}} />  อัพโหลดรูปภาพ
                                                    </Button>

                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: 'none' }}
                                                    />

                                                    {imagePreview && (
                                                        <div style={{ position: 'relative' }}>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="contained"
                                                                onClick={handleRemoveImage}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: -50,
                                                                    right: 8,
                                                                    minWidth: 'auto',
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    padding: 0,
                                                                }}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {selectedImage && (
                                                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                                            ไฟล์: {selectedImage}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                            </Col>
                                            <Col md={6} xs={6}>
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
                                                <Form.Group>
                                                    <Form.Label>หมายเหตุ </Form.Label>
                                                    <Form.Control
                                                        placeholder="หมายเหตุเพิ่มเติม เช่น เมนูแนะนำ, เมนูใหม่ ฯลฯ"
                                                        onChange={(e) => setData({ ...data, notes: e.target.value })}
                                                        type="text"
                                                        defaultValue={data?.notes} />
                                                </Form.Group>
  <Button  className="mt-2"
                                                                    onClick={() => onDeleteMenu(data.id)}
                                                                    variant="danger"
                                                                >
                                                                    <DeleteIcon /> ลบเมนู
                                                                </Button>
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
                        บันทึก
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                </Modal.Footer>


            </Modal>
        </>)
}

export default Products;