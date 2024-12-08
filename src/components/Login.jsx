import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
const Login = () => {
    const router = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setAuth, setStaffName, setUser } = useContext(AuthData);

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

                        setStaffName(name)
                        router('/pos')
                    }

                }
            })
    }
    useEffect(() => {
        // โหลด SDK ของ Facebook
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: "831737185629037", // ใส่ App ID ของคุณ
                cookie: true,
                xfbml: true,
                version: "v17.0", // ใช้เวอร์ชันล่าสุดของ Graph API
            });
        };
    }, []);

    const handleFacebookLogin = () => {
        window.FB.login(
            (response) => {
                if (response.status === "connected") {
                    console.log("Login Success!", response);
                    fetchFacebookUserData();
                } else {
                    console.log("Login Failed!", response);
                }
            },
            { scope: "public_profile,email" }
        );
    };
    const fetchFacebookUserData = () => {
        window.FB.api("/me", { fields: "name,email,picture" }, (response) => {
            console.log("User Data:", response);
            // คุณสามารถใช้ response เพื่อแสดงข้อมูลผู้ใช้
        });
    };
  
    return (
        <>
            <Row className="mt-4">
                <Col md={4}>

                </Col>
                <Col md={4}>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title className="text-center">
                                SASI Delivery <br />
                                Login </Card.Title>





                            <Button
                                onClick={()=>handleFacebookLogin()}
                              
                                variant="primary"
                                className="w-100 mt-4"
                            >เข้าสู่ระบบด้วย FaceBook</Button>




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
