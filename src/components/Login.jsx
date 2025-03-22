import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import { httpGet } from "../http";
const Login = () => {
    const router = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setAuth, setStaffName, setUser, setShop } = useContext(AuthData);

    const getShop = (id) => {
        httpGet('/shop/shop-user/' + id).then((res) => {
            console.log(res.data)
            setShop({ ...res.data[0] })
        })
    }

    const login = async (e) => {
        e.preventDefault();
        const body = { email: email, password: password };
        await axios.post(import.meta.env.VITE_BAKUP_URL + '/auth/signin', body)
            .then(res => {
                if (res) {
                    if (res.status === 200) {
                        const { name, department, token, id } = res.data;
                        localStorage.setItem("name", name)
                        localStorage.setItem("role", department)
                        localStorage.setItem("token", token)
                        localStorage.setItem("userId", id)
                        setUser(res.data)
                        getShop(id)
                        setStaffName(name)
                        router('/pos')
                    }

                }
            })
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router('/pos');
        }
    }, [])
    return (
        <>
            <Row className="mt-4">
                <Col md={4}>

                </Col>
                <Col md={4}>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title className="text-center">
                                SASI POS <br />
                                <br />
                                Login </Card.Title>

                            <Form onSubmit={login}>
                                <Form.Group>
                                    <Form.Label>
                                        email
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        placeholder="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mt-2">
                                    <Form.Label>
                                        password
                                    </Form.Label>

                                    <Form.Control
                                        required
                                        placeholder="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                    />

                                </Form.Group>

                                <Button
                                    type="submit"
                                    style={{ backgroundColor: '#FD720D', border: '0px' }}

                                    className="w-100 mt-4"
                                >เข้าสู่ระบบ</Button>
                                <div className="text-center mt-4">
                                    <p> หรือ </p>
                                </div>

                                <Button
                                    onClick={() => router('/register')}
                                    variant="primary"
                                    className="w-100 mt-2"
                                >ลงทะเบียนผู้ใช้</Button>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>

                </Col>
            </Row>

        </>
    )
}

export default Login;