import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Modal, Form, Alert, Image } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Details from "./Details";
import moment from "moment/moment";
import { httpDelete, httpGet, httpPut, sendDelivery, httpPost, sendNotificationBot, sendDeliverySuccess, sendImageToPage } from "../http";
import Swal from 'sweetalert2';
import { AuthData } from "../ContextData";
import CachedIcon from '@mui/icons-material/Cached';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
const Orders = () => {
    const { shop } = useContext(AuthData);
    const token = localStorage.getItem("token");
    const [report, setReport] = useState([]);
    const [show, setShow] = useState(false);
    const [price, setPrice] = useState(0);
    const [printBillId, setPrintBillId] = useState(null);
    const [id, setId] = useState(null);
    const [file, setFile] = useState("");
    const [Delivered, setDelivered] = useState(0);
    const [OrderNew, setOrderNew] = useState(0);
    const [OrderCooking, setOrderCooking] = useState(0);
    const [OrderCookingFinish, setOrderCookingFinish] = useState(0);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const getMenuReport = async (status) => {
        setReport([]);
        if (shop?.shop_id) {

            await httpGet(`/bills?status=${status}&shop_id=${shop?.shop_id}`, { headers: { 'apikey': token } })
                .then(res => { setReport(res.data) });
        }
    }


    const getOrderDelivery = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=ส่งสำเร็จ`, { headers: { 'apikey': token } })
                .then(res => {
                    setDelivered(res.data.count);
                })
        }
    }

    const getOrderNew = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=รับออเดอร์แล้ว`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderNew(res.data.count);
                })
        }
    }

    const getOrderCooking = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=กำลังส่ง`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderCooking(res.data.count);
                })
        }
    }

    const getOrderCookingFinish = async () => {
        if (shop?.shop_id) {
            await httpGet(`/bills/counter-order-status/${shop?.shop_id}?statusOrder=ทำเสร็จแล้ว`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderCookingFinish(res.data.count);
                })
        }
    }

    const handleClose = () => setShow(false);
    const dev = import.meta.env.VITE_API_URL;

    const uploadFile = async (messageid) => {
        const formData = new FormData();
        formData.append('file', file);
        await httpPost(`/upload`, formData)
            .then(res => {
                if (res.status === 200) {
                    let filename = dev + '/images/' + res.data.filename;
                    if (filename) {
                        sendImageToPage(messageid, filename);
                    }
                    setFile("");
                }
            })
    }
    function compressImage(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new window.Image(); // ✅ ใช้ window.Image แทน

                img.onload = () => {
                    const canvas = document.createElement("canvas");

                    let scaleFactor = maxWidth / img.width;
                    if (scaleFactor > 1) scaleFactor = 1;

                    canvas.width = img.width * scaleFactor;
                    canvas.height = img.height * scaleFactor;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error("Failed to compress image"));
                            }
                        },
                        "image/jpeg",
                        quality
                    );
                };

                img.onerror = reject;
                img.src = event.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }


    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const compressedBlob = await compressImage(selectedFile, 800, 0.6); // ย่อกว้างสุด 800px, คุณภาพ 60%
            const compressedFile = new File([compressedBlob], file.name, {
                type: "image/jpeg",
            });
            console.log("ขนาดเดิม:", (file.size / 1024 / 1024).toFixed(2), "MB");
            console.log("ขนาดใหม่:", (compressedFile.size / 1024).toFixed(2), "KB");
            // สามารถใช้ compressedFile ส่งไป server หรือแสดงในเว็บได้
            setFile(compressedFile);
        }
    };



    const UpdateStatus = async (id, status, messageid, step) => {
        Swal.fire({
            title: 'คุณต้องการอัพเดต หรือไม่ ?',
            text: "กดยืนยันเพื่ออัพเดตสถานะ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยันรายการ',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const body = {
                    statusOrder: status,
                    step: step
                }
                httpPut(`/bills/${id}`, body).then((res) => {
                    if (res) {
                        if (status === "ทำเสร็จแล้ว") {
                            if (messageid !== "pos") {
                                sendNotificationBot(messageid);

                            }
                            getMenuReport("รับออเดอร์แล้ว");

                        }
                        if (status === "กำลังส่ง") {
                            if (messageid !== "pos") {
                                sendDelivery(messageid);

                            }

                            getMenuReport("ทำเสร็จแล้ว");
                        }
                        if (status === "ส่งสำเร็จ") {
                            if (messageid !== "pos") {
                                uploadFile(messageid);
                                sendDeliverySuccess(messageid);
                            }
                            getMenuReport("กำลังส่ง");
                        }
                        getOrderNew();
                        getOrderDelivery();
                        getOrderCookingFinish();
                        getOrderCooking();
                    }
                })
            }
        });
    }

    const UpdatePrice = async () => {
        const body = {
            amount: parseInt(price)
        }
        await httpPut(`/bills/${id}`, body)
        setReport([]);
        await getMenuReport("รับออเดอร์แล้ว");
        handleClose();
    }

    useEffect(() => {
        getMenuReport("รับออเดอร์แล้ว");
 getOrderNew();
    }, [shop])

    return (<>
        <Row className="mt-3">
            <Col md={12}>

                <Card style={{ border: 'none', marginTop: '12px' }}  >

                    <Form>

                        <Row className="when-print">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="btn btn-outline-primary" style={{ fontSize: '18px' }} onClick={() => { getMenuReport("รับออเดอร์แล้ว") }}>ออเดอร์ใหม่ {OrderNew}</Button>
                                <Button variant="btn btn-outline-success" style={{ fontSize: '18px' }} onClick={() => { getMenuReport("ทำเสร็จแล้ว") }}>ทำเสร็จแล้ว {OrderCookingFinish}</Button>
                                <Button variant="btn btn-outline-danger" style={{ fontSize: '18px' }} onClick={() => { getMenuReport("กำลังส่ง") }}>กำลังส่ง  {OrderCooking}</Button>
                                <Button variant="btn btn-outline-primary" style={{ fontSize: '18px' }} onClick={() => { getMenuReport("ส่งสำเร็จ") }}>ส่งสำเร็จ {Delivered} </Button>

                            </ButtonGroup>
                        </Row>

                        <Row>
                            {report.map((item, index) => (
                                <React.Fragment key={index}>
                                    {(printBillId === null || printBillId === item.bill_ID) && item.ordertype === 'สั่งกลับบ้าน' && (
                                        <Col md={4}>
                                            <Card className="mb-4 mt-4" id={item.id}>
                                                <Card.Body style={{ padding: '12px' }}>
                                                    <div className="text-center show-header">
                                                        <h5> {shop?.name} </h5>
                                                        <h5>ใบเสร็จรับเงิน</h5>
                                                    </div>
                                                    <b> คิวที่ {item.queueNumber} <br /> เลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()}</b>
                                                    <p>
                                                        เวลาสั่งซื้อ {moment(item.timeOrder).format('HH:mm')} น. &nbsp; <br />
                                                        วันที่ {moment(item.timeOrder).format('YYYY-MM-DD')}<br />
                                                        {item?.printStatus !== null ? item?.printStatus : " "}
                                                    </p>
                                                    <Row>
                                                        <Col md={6} xs={6}>
                                                            <div className="when-print mb-2">
                                                                <b> สั่งจาก {item.messengerId === 'pos' ? 'Admin' : 'Page'} </b> <br />
                                                            </div>
                                                        </Col>
                                                        {/* <Col md={6} xs={6} className="mb-2">
                                                            <Button
                                                                className="when-print"
                                                                onClick={() => handlePrint(item.bill_ID, item.id)}
                                                                variant="primary w-100"
                                                            >
                                                                <LocalPrintshopIcon />  พิมพ์ใบเสร็จ
                                                            </Button>
                                                        </Col> */}
                                                    </Row>
                                                    <Alert className="when-print bg-white">
                                                        <b>สถานะ : {item.statusOrder}</b>
                                                    </Alert>
                                                    {/* <Details
                                                        reset={reset}
                                                        id={item.id}
                                                        bill_ID={item.bill_ID}
                                                        status={item.statusOrder} /> */}
                                                    <Row>
                                                        <Col md={8}>
                                                            <h5>รวมทั้งหมด {item.amount} บาท</h5>
                                                            <h5>ลูกค้า-{item.customerName}</h5>
                                                            {item.address ? <h5>จัดส่งที่-{item.address}</h5> : " "}
                                                            {/* <h5>วิธีการรับอาหาร-{item.ordertype}</h5> */}
                                                        </Col>


                                                    </Row>

                                                    <Row className="mt-2">

                                                        {
                                                            item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                                <Col md={12} xs={12} className="mb-2">
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {

                                                                            UpdateStatus(item.id, 'ทำเสร็จแล้ว', item.messengerId, 2);

                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        ทำอาหารเสร็จแล้ว
                                                                    </Button>
                                                                </Col>
                                                            )
                                                        }
                                                        {/* {item.statusOrder === 'รับออเดอร์แล้ว' && (<>

                                                            <Col md={6} xs={6} className="mb-2">
                                                                <Button
                                                                    className="when-print"
                                                                    onClick={() => deleteBill(item.id, item.bill_ID)}
                                                                    variant="danger w-100"
                                                                >
                                                                    ยกเลิกออเดอร์
                                                                </Button>
                                                            </Col></>
                                                        )} */}
                                                        {
                                                            item.statusOrder === 'ทำเสร็จแล้ว' && item.ordertype === "สั่งกลับบ้าน" && (<>
                                                                <Col md={12} xs={12}>
                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {

                                                                            UpdateStatus(item.id, 'กำลังส่ง', item.messengerId, 3);


                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        กำลังส่ง
                                                                    </Button>

                                                                </Col>

                                                            </>)
                                                        }
                                                        {
                                                            item.statusOrder === 'กำลังส่ง' && (<>
                                                                <Col md={12}>
                                                                    <>
                                                                        <Form.Group className="mt-2">
                                                                            <Form.Label>หลักฐานการส่ง</Form.Label>
                                                                            <Form.Control
                                                                                type="file"
                                                                                id="file" accept="image/*" capture="environment"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                        </Form.Group>



                                                                    </>

                                                                    <Button
                                                                        className="when-print"
                                                                        onClick={() => {
                                                                            UpdateStatus(item.id, 'ส่งสำเร็จ', item.messengerId, 4);

                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        ส่งสำเร็จ
                                                                    </Button>

                                                                </Col>

                                                            </>)
                                                        }

                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </React.Fragment>
                            ))}
                        </Row>
                    </Form>

                </Card>
            </Col>
        </Row>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> แก้ไขราคา  </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>

                    <Row>
                        <Col md={12} xs={12}>

                            <Form.Group>

                                <Form.Label>ราคา</Form.Label>
                                <Form.Control type="text"
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder='ราคา'
                                    defaultValue={price} />

                            </Form.Group>

                        </Col>
                        <Row>

                            <Col md={6} xs={6} className="text-center">
                                <Button
                                    className="mt-3 w-100"
                                    onClick={() => UpdatePrice()}
                                    style={{ float: 'left' }}
                                    variant="success">
                                    บึนทึก
                                </Button>
                            </Col>
                            <Col md={6} xs={6}>
                                <Button
                                    className="mt-3 w-100"
                                    onClick={handleClose}
                                    style={{ float: 'left' }}
                                    variant="danger">
                                    ยกเลิก
                                </Button>
                            </Col>
                        </Row>

                    </Row>
                </Form>








            </Modal.Body>

        </Modal>
    </>)
}
export default Orders;