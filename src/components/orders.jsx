import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Form, Alert, Modal, ModalHeader } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Details from "./Details";
import moment from "moment/moment";
import { httpGet, httpPut, httpPost, sendImageToPage } from "../http";
import Swal from 'sweetalert2';
import { AuthData } from "../ContextData";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
const Orders = () => {
    const { shop } = useContext(AuthData);
    const token = localStorage.getItem("token");
    const [report, setReport] = useState([]);
    const [file, setFile] = useState("");
    const [Delivered, setDelivered] = useState(0);
    const [OrderNew, setOrderNew] = useState(0);
    const [OrderCooking, setOrderCooking] = useState(0);
    const [OrderCookingFinish, setOrderCookingFinish] = useState(0);
    const [statusOrder, setStatusOrder] = useState("รับออเดอร์แล้ว");
    const [shopId, setShopId] = useState("15b4e191-d125-4c18-bdd1-445091c349ff");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState("");
    const [id, setId] = useState("");
    const [userid, setUserId] = useState("");

    const getMenuReport = async (status) => {
        setReport([]);

        if (shopId) {
            setLoading(true);
            await httpGet(`/bills?status=${status}&shop_id=${shopId}`, { headers: { 'apikey': token } })
                .then(res => { setReport(res.data) });

        } setLoading(false);
    }

    const getOrderDelivery = async () => {

        if (shopId) {
            await httpGet(`/bills/counter-order-status/${shopId}?statusOrder=ส่งสำเร็จ`, { headers: { 'apikey': token } })
                .then(res => {
                    setDelivered(res.data.count);
                })
        }
    }

    const getOrderNew = async () => {
        if (shopId) {
            await httpGet(`/bills/counter-order-status/${shopId}?statusOrder=รับออเดอร์แล้ว`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderNew(res.data.count);
                })
        }
    }

    const getOrderCooking = async () => {
        if (shopId) {
            await httpGet(`/bills/counter-order-status/${shopId}?statusOrder=กำลังส่ง`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderCooking(res.data.count);
                })
        }
    }

    const getOrderCookingFinish = async () => {
        if (shopId) {
            await httpGet(`/bills/counter-order-status/${shopId}?statusOrder=ทำเสร็จแล้ว`, { headers: { 'apikey': token } })
                .then(res => {
                    setOrderCookingFinish(res.data.count);
                })
        }
    }

    const dev = import.meta.env.VITE_API_URL;

    const uploadFile = async (messageid) => {
        const formData = new FormData();
        formData.append('file', file);
        await httpPost(`/upload`, formData)
            .then(res => {
                if (res.status === 200) {
                    const filename = dev + '/images/' + res.data.filename;
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

    const PAGE_ACCESS_TOKEN = 'EAAkMtjSMoDoBOZCGYSt499z6jgiiAjAicsajaOWhjqIxmHsl0asrAm61k6LgD1ifGXHzbDsHrJFCZASriCSyoPDpeqFh3ZBTrWC4ymdZCZBwcioKueKj31QK6w6GFHILPiJaZA8hgNHXtW5OqkRTZBzI0VFvIOoVhGdGq28DvOHGVSNEmPMJjkAOikE1thOaF3mzDg6dnjSyZBGpIY6mMZA1rWaIx';
    const sendMessageToPage = (userid, messageText) => {
        axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            recipient: {
                id: userid
            },
            message: {
                text: messageText
            }
        }).then(response => {
            if (response) {
                Swal.fire({
                    title: 'ดำเนินการสำเร็จ',
                    icon: 'success',
                    timer: 500
                })

            }
        }).catch(error => {
            if (error) {
                Swal.fire({
                    title: 'ส่งข้อความไปยังลูกไม่สำเร็จ',
                    icon: 'error',
                })

            }

        });
    }


    const handleFileChange = async (e, bill, userid) => {
        setOpen(true);
        setUserId(userid);
        setId(bill);
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const compressedBlob = await compressImage(selectedFile, 800, 0.6); // ย่อกว้างสุด 800px, คุณภาพ 60%
            const extension = selectedFile.name.split('.').pop() || 'jpg';
            const fileName = selectedFile.name.split('.').slice(0, -1).join('.') || 'image';
            const compressedFile = new File([compressedBlob], `${fileName}.${extension}`, {
                type: "image/jpeg",
            });
            setFile(compressedFile);
            const previewUrl = URL.createObjectURL(compressedFile);
            setPreview(previewUrl);
        }
    };

    const UpdateStatus = async (id, status, messageid, step) => {
        const body = {
            statusOrder: status,
            step: step
        }
        httpPut(`/bills/${id}`, body).then((res) => {
            if (res) {
                if (status === "ทำเสร็จแล้ว") {
                    if (messageid !== "pos") {
                        sendMessageToPage(messageid, "ออเดอร์ทำเสร็จแล้ว รอส่งนะครับ")
                    }
                    getMenuReport("รับออเดอร์แล้ว");
                    setStatusOrder("รับออเดอร์แล้ว");
                }
                if (status === "กำลังส่ง") {
                    if (messageid !== "pos") {
                        sendMessageToPage(messageid, "กำลังไปส่งนะครับ")
                    }
                    getMenuReport("ทำเสร็จแล้ว");
                    setStatusOrder("ทำเสร็จแล้ว");
                }
                if (status === "ส่งสำเร็จ") {
                    if (messageid !== "pos") {
                        uploadFile(messageid);
                        sendMessageToPage(messageid, "มาส่งแล้วนะครับ")
                    }
                    getMenuReport("กำลังส่ง");
                    setStatusOrder("กำลังส่ง");
                    setFile("");
                    setOpen(false);
                }
                getOrderNew();
                getOrderDelivery();
                getOrderCookingFinish();
                getOrderCooking();
            }
        })
    }

    useEffect(() => {
        getMenuReport("รับออเดอร์แล้ว");
        getOrderNew();
        getOrderDelivery();
        getOrderCookingFinish();
        getOrderCooking();
    }, [shopId])

    return (<>

        <Modal show={open}>
            <ModalHeader>
                <Modal.Title >
                    ยืนยันส่งออเดอร์
                </Modal.Title>

            </ModalHeader>

            <Modal.Body>
                <img style={{ width: '100%', height: 300, objectFit: 'cover' }} src={preview} />
                <Row className="mt-3">

                    <Col md={6} xs={6}>
                        <Button
                            style={{ fontSize: 18 }}
                            className="mb-2"
                            onClick={() => {
                                UpdateStatus(id, 'ส่งสำเร็จ', userid, 4);
                            }}
                            variant="success w-100"
                        >
                            ส่งสำเร็จ
                        </Button>
                    </Col>
                    <Col md={6} xs={6}>
                        <Button
                            variant="danger w-100"
                            style={{ fontSize: 18 }} onClick={() => setOpen(false)}> ยกเลิก</Button>
                    </Col>
                </Row>


            </Modal.Body>
        </Modal>
        <Row className="mt-3">
            <Col md={12}>

                <Card style={{ border: 'none', marginTop: '12px' }}  >
                    <Form>
                        <Row className="when-print">

                            <Col md={6} xs={6} className="mb-3">
                                <Button variant="warning" className="w-75" onClick={() => setShopId("15b4e191-d125-4c18-bdd1-445091c349ff")}> ร้านศศิ </Button>

                            </Col>
                            <Col md={6} xs={6}>
                                <Button variant="primary" className="w-75" onClick={() => setShopId("a9c9cac7-fa2f-4f19-bdc8-016e9a0a0cda")}> ร้านเตี๋ยวซา </Button>

                            </Col>

                            <ButtonGroup aria-label="Basic example" style={{ height: 60 }}>
                                <Button variant={statusOrder === "รับออเดอร์แล้ว" ? "btn btn-primary" : "btn btn-outline-primary"}
                                    style={{ fontSize: '18px' }} onClick={() => { getMenuReport("รับออเดอร์แล้ว"), setStatusOrder("รับออเดอร์แล้ว") }}>ใหม่ {OrderNew}</Button>
                                <Button
                                    variant={statusOrder === "ทำเสร็จแล้ว" ? "btn btn-success" : "btn btn-outline-success"}

                                    style={{ fontSize: '18px' }} onClick={() => { getMenuReport("ทำเสร็จแล้ว"), setStatusOrder("ทำเสร็จแล้ว") }}>พร้อมส่ง {OrderCookingFinish}</Button>
                                <Button
                                    variant={statusOrder === "กำลังส่ง" ? "btn btn-danger" : "btn btn-outline-danger"}
                                    style={{ fontSize: '18px' }} onClick={() => { getMenuReport("กำลังส่ง"), setStatusOrder("กำลังส่ง") }}>กำลังส่ง  {OrderCooking}</Button>
                                <Button
                                    variant={statusOrder === "ส่งสำเร็จ" ? "btn btn-primary" : "btn btn-outline-primary"}
                                    style={{ fontSize: '18px' }} onClick={() => { getMenuReport("ส่งสำเร็จ"), setStatusOrder("ส่งสำเร็จ") }}>ส่งสำเร็จ {Delivered} </Button>

                            </ButtonGroup>
                        </Row>

                        <Row>
                            <div className="mt-3 text-center">


                                {

                                    loading ? (<>

                                        <Spinner animation="border" role="status" variant="primary">  </Spinner>
                                    </>) : (

                                        <>


                                        </>
                                    )
                                }

                            </div>

                            {report.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.ordertype === 'สั่งกลับบ้าน' && (
                                        <Col md={4}>
                                            <Card className="mb-4 mt-4" id={item.id}>
                                                <Card.Body style={{ padding: '12px' }}>
                                                    <div className="text-center show-header">
                                                        <h5> {shop?.name} </h5>
                                                        <h5>ใบเสร็จรับเงิน</h5>
                                                    </div>
                                                    {/*  คิวที่ {item.queueNumber} <br /> */}
                                                    <b> เลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()}</b>
                                                    <p>
                                                        เวลาสั่งซื้อ {moment(item.timeOrder).format('HH:mm')} น. &nbsp;  วันที่สั่ง {moment(item.timeOrder).format('YYYY-MM-DD')}

                                                    </p>
                                                    <Row>
                                                        <Col md={12} xs={12}>
                                                            <h5>ลูกค้า - {item.customerName}</h5>
                                                        </Col>
                                                    </Row>
                                                    <Alert className="bg-white p-2 text-center">
                                                        <Row>
                                                            <Col md={6} xs={6}>
                                                                <h5>สถานะ :  {item.statusOrder}</h5>
                                                            </Col>
                                                            <Col md={6} xs={6}>
                                                                <h5> {item.amount} บาท</h5>
                                                            </Col>
                                                        </Row>


                                                    </Alert>
                                                    <Details

                                                        id={item.id}
                                                        bill_ID={item.bill_ID}
                                                        status={item.statusOrder} />
                                                    <Row className="mt-2">
                                                        <Col md={8}>
                                                            {item.address ? <h5>จัดส่งที่-{item.address}</h5> : " "}
                                                        </Col>
                                                    </Row>

                                                    <Row className="mt-2">

                                                        {
                                                            item.statusOrder === 'รับออเดอร์แล้ว' && (
                                                                <Col md={12} xs={12} className="mb-2">
                                                                    <Button
                                                                        style={{ fontSize: 20 }}
                                                                        className="mb-2"
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

                                                        {
                                                            item.statusOrder === 'ทำเสร็จแล้ว' && item.ordertype === "สั่งกลับบ้าน" && (<>
                                                                <Col md={12} xs={12}>
                                                                    <Button
                                                                        style={{ fontSize: 20 }}
                                                                        className="mb-2"
                                                                        onClick={() => {

                                                                            UpdateStatus(item.id, 'กำลังส่ง', item.messengerId, 3);


                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        เปลี่ยนเป็นกำลังส่ง
                                                                    </Button>

                                                                </Col>

                                                            </>)
                                                        }
                                                        {
                                                            item.statusOrder === 'กำลังส่ง' && (<>
                                                                <Col md={6} xs={6}>
                                                                    <>
                                                                        <Form.Group>
                                                                            <Form.Label>* ถ่ายรูปหลักฐานการส่ง</Form.Label>
                                                                            <Form.Control
                                                                                className="mt-2 mb-4"
                                                                                type="file"
                                                                                id="file" accept="image/*" capture="environment"
                                                                                onChange={(e) => handleFileChange(e, item.id, item.messengerId)}
                                                                            />
                                                                        </Form.Group>
                                                                    </>

                                                                </Col>
                                                                <Col md={6} xs={12}>
                                                                    <Button
                                                                        style={{ fontSize: 18 }}
                                                                        className="mb-2"
                                                                        onClick={() => {
                                                                            UpdateStatus(item.id, 'ส่งสำเร็จ', item.messengerId, 4);
                                                                        }}
                                                                        variant="success w-100"
                                                                    >
                                                                        จัดส่งสำเร็จ
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
    </>)
}
export default Orders;