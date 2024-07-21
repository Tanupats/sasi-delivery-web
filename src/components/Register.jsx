import React, { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const createUser = async (e) => {
        e.preventDefault();
        const bodyUser = { name: name, email: email, password: password, department: "admin" };

        await axios.post(import.meta.env.VITE_BAKUP_URL + '/auth/sigup', bodyUser)
            .then(res => {
                if (res) {
                    if (res.status === 200) {

                        router('/pos')
                    }


                }
            })
    }

    const createShop = async () => {
       
      

        await axios.post(import.meta.env.VITE_BAKUP_URL + '/auth/sigup', bodyUser)
            .then(res => {
                if (res) {
                    if (res.status === 200) {

                        router('/pos')
                    }


                }
            })
    }


    return (

        <Row className='mt-4'>
            <Col md={2}></Col>
            <Col md={8}>
                <Card>
                    <Card.Title className="text-center mt-4">ลงทะเบียนผู้ใช้ และร้านค้า</Card.Title>
                    <Card.Body>

                        <Form>

                            <Form.Group>
                                <Form.Label> ชื่อ-นามสกุล</Form.Label>
                                <Form.Control type="text" placeholder="ขื่อ-นามสกุล" />

                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>อีเมล</Form.Label>
                                <Form.Control type="email" placeholder="email" />

                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>รหัสผ่าน</Form.Label>
                                <Form.Control type="password" placeholder="password" />

                            </Form.Group>

                            <Form.Group className="mt-2">
                                <Form.Label>ชื่อร้านค้า</Form.Label>
                                <Form.Control type="text" placeholder="ชื่อร้านค้า(แบรนด์)" />

                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>โลโก้ร้าน</Form.Label>
                                <Form.Control type="file" placeholder="โลโก้" />

                            </Form.Group>

                            <Row className="mt-4">
                                <Col md={6} xs={6} >
                                    <Button variant="primary">
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