import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import FacebookLogin from 'react-facebook-login';
const Login = () => {
    const router = useNavigate()

    const handleResponse = (response) => {
        console.log('Facebook response:', response);
        if (response.accessToken) {
            // ส่ง accessToken ไป backend เพื่อยืนยันตัวตน
            console.log('User is logged in:', response);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
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

                                <h2>Login with Facebook</h2>
            <FacebookLogin
                appId="831737185629037" // ใส่ App ID ของคุณ
                autoLoad={false} // ตั้งเป็น true หากต้องการโหลดอัตโนมัติ
                fields="name,email,picture"
                callback={handleResponse} // ฟังก์ชันที่เรียกเมื่อสำเร็จ
                textButton="Login with Facebook"
                icon="fa-facebook"
                cssClass="my-facebook-button-class"
            />
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
