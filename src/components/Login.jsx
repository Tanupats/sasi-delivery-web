import axios from "axios";
import React, { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const router = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const login = async () => {
        const body = { email: email, password: password };
        await axios.post(import.meta.env.VITE_API_URL + '/login.php', body)
            .then(res => {
                if (res) {

                    const { name, department } = res.data;
                    sessionStorage.setItem("name", name)
                    sessionStorage.setItem("role", department)
                    router('/pos')

                }
            })
    }

    return (
        <>
            <Row>
                <Col md={4}>

                </Col>
                <Col md={4}>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title className="text-center"> Login </Card.Title>

                            <Form >
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
                                <Form.Group>
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
                                    onClick={() => login()}

                                    variant="primary"
                                    className="w-100 mt-4"
                                >Login</Button>

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
