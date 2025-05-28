import { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { httpPost } from "../http";
const Register = () => {
    //user 
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let userId = ""
    const router = useNavigate();
    //shop
    const [shopName, setshopName] = useState("");
    const [photo, setPhoto] = useState("");

    const createUser = async () => {
        const bodyUser = { name: name, email: email, password: password, department: "admin" };
        await httpPost('/auth/sigup', bodyUser)
            .then(res => {
                if (res) {
                    if (res.status === 200) {
                        userId = res.data.id;
                    }
                }
            })
    }

    const createShop = async () => {
        const bodyShop = { name: shopName, user_id: String(userId), photo: photo }
        await httpPost('/shop', bodyShop)
            .then(res => {
                if (res) {
                    if (res.status === 200) {
                        router('/');
                    }
                }
            })
    }

    const saveRegister = async (e) => {
        e.preventDefault();
        await createUser()
        await createShop()
    }

    return (

        <Row className='mt-4'>
            <Col md={2}></Col>
            <Col md={8}>
                <Card>
                    <Card.Title className="text-center mt-4">ลงทะเบียนผู้ใช้ และร้านค้า</Card.Title>
                    <Card.Body>

                        <Form onSubmit={saveRegister}>
                            <Form.Group>
                                <Form.Label> ชื่อ-นามสกุล</Form.Label>
                                <Form.Control
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="ขื่อ-นามสกุล" />

                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>อีเมล</Form.Label>
                                <Form.Control type="email"
                                    onChange={(e) =>
                                        setEmail(e.target.value)}
                                    placeholder="email" />

                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>รหัสผ่าน</Form.Label>
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="password" />

                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label>ชื่อร้านค้า (แบรนด์)</Form.Label>
                                <Form.Control
                                    onChange={(e) => setshopName(e.target.value)}
                                    type="text"
                                    placeholder="ชื่อร้านค้า(แบรนด์)" />

                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>โลโก้</Form.Label>
                                <Form.Control type="file" placeholder="โลโก้" onChange={(e) => setPhoto(e.target.files[0].name)} />

                            </Form.Group>

                            <Row className="mt-4">
                                <Col md={6} xs={6} >
                                    <Button
                                        type="submit"
                                        variant="primary">
                                        ลงทะเบียน
                                    </Button>
                                </Col>
                                <Col md={6} xs={6}>
                                    <Button variant="danger">
                                        ยกเลิก

                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={2}></Col>
        </Row>
    )
}

export default Register;