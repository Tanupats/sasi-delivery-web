import React, { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
import { httpGet, httpPost, httpPut } from "../http";
import axios from "axios";

const Login = () => {
    const router = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setStaffName, setUser, setShop, shop } = useContext(AuthData);
    const [messageError, setMessageError] = useState(false);
    const [fbReady, setFbReady] = useState(false);
    const [facebookPages, setFacebookPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState("");
    const [showPageSelector, setShowPageSelector] = useState(false);
    const [userAccessToken, setUserAccessToken] = useState("");
    
    const appId = import.meta.env.VITE_PUBLIC_FB_APP_ID;

    const getShop = (id) => {
        httpGet('/shop/shop-user/' + id).then((res) => {
            setShop({ ...res.data[0] });
        })
    }

    const login = async (e) => {
        e.preventDefault();
        const body = { email: email, password: password };
        await httpPost('/auth/signin', body)
            .then(res => {
                if (res) {
                    if (res.status === 200) {
                        const { name, department, token, id } = res.data;
                        localStorage.setItem("name", name);
                        localStorage.setItem("role", department);
                        localStorage.setItem("token", token);
                        localStorage.setItem("userId", id);

                        setUser(res.data);
                        getShop(id);
                        setStaffName(name);
                        router('/pos');
                    } else {
                        console.log('เข้าสู่ระบบไม่สำเร็จ')
                        setMessageError(true);
                    }
                }
            })
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router('/pos');
        }
    }, [])

    // Initialize Facebook SDK
    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: appId,
                cookie: false, // Disable cookie to avoid overriding global access token
                xfbml: false,
                version: 'v19.0',
            });
            setFbReady(true);
        };

        if (!document.getElementById("facebook-jssdk")) {
            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            document.body.appendChild(script);
        }
    }, [])

    const loginWithFacebook = () => {
        if (!fbReady) {
            alert("Facebook SDK not ready");
            return;
        }

        window.FB.login(
            (response) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    const userId = response.authResponse.userID;
                    console.log("User Access Token:", accessToken);
                    console.log("User PSID:", userId);
                    
                    // Get user name from Facebook
                    window.FB.api('/me', { fields: 'name' }, (userInfo) => {
                        console.log("User Info:", userInfo);
                        console.log("User Name:", userInfo.name);
                        console.log("User ID (PSID):", userInfo.id);
                    });
                    
                    getPages(accessToken);
                } else {
                    alert("Login cancelled");
                }
            },
            {
                scope: "pages_show_list,pages_messaging,pages_read_engagement,pages_manage_posts",
            }
        );
    }

    const getPages = async (userToken) => {
        try {
            const res = await axios.get(
                "https://graph.facebook.com/v19.0/me/accounts?fields=name,id,access_token,tasks&access_token=" + userToken
            );
            console.log("Pages:", res);
            const pages = res.data.data || [];
            setFacebookPages(pages);
            setUserAccessToken(userToken);
            
            if (pages.length > 0) {
                setShowPageSelector(true);
            } else {
                alert("ไม่พบเพจที่คุณเป็นผู้ดูแล กรุณาสร้างเพจหรือขอสิทธิ์ผู้ดูแล");
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
            alert("ไม่สามารถดึงข้อมูลเพจ Facebook ได้: " + error.message);
        }
    }

    const selectPage = async (pageId) => {
        const selectedPageData = facebookPages.find(page => page.id === pageId);
        if (selectedPageData) {
            setSelectedPage(pageId);
            const pageAccessToken = selectedPageData.access_token;
            console.log("Selected Page:", selectedPageData);
            console.log("Page Access Token:", pageAccessToken);

            await updateUserToken(pageAccessToken, selectedPageData);
        }
    }

    const updateUserToken = async (token, pageData) => {
        if (!shop || !shop.id) {
            alert("ไม่พบข้อมูลร้านค้า กรุณาลองใหม่อีกครั้ง");
            return;
        }

        const id = shop.id;
        const body = {
            facebook_token: token,
            facebook_page_id: pageData.id,
            facebook_page_name: pageData.name,
        }

        try {
            const res = await httpPut(`/shop/${id}`, body);
            if (res.status === 200) {
                alert(`เชื่อมต่อเพจ "${pageData.name}" สำเร็จ!`);
                setShowPageSelector(false);
                setFacebookPages([]);
                setSelectedPage("");
                setUserAccessToken("");
            }
        } catch (error) {
            console.error("Error updating token:", error);
            alert("บันทึกข้อมูลไม่สำเร็จ: " + error.message);
        }
    }

    const cancelPageSelection = () => {
        setShowPageSelector(false);
        setFacebookPages([]);
        setSelectedPage("");
        setUserAccessToken("");
    }

    return (
        <>
            <Row className="mt-4">
                <Col md={4}>

                </Col>
                <Col md={4}>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title className="text-center" style={{ color: '#FD720D', border: '0px' }}>
                                SASI POS <br />
                                <br />
                                Login </Card.Title>

                            {showPageSelector && facebookPages.length > 0 ? (
                                <Form>
                                    <Form.Group>
                                        <Form.Label style={{ color: '#FD720D', fontWeight: 'bold' }}>
                                            เลือกเพจ Facebook ที่คุณต้องการเชื่อมต่อ
                                        </Form.Label>
                                        <Form.Select
                                            value={selectedPage}
                                            onChange={(e) => selectPage(e.target.value)}
                                            className="mt-2"
                                        >
                                            <option value="">-- เลือกเพจ --</option>
                                            {facebookPages.map((page) => (
                                                <option key={page.id} value={page.id}>
                                                    {page.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <div className="mt-3">
                                        <small className="text-muted">
                                            เพจที่เลือกจะเชื่อมต่อกับร้านค้า: {shop?.name || 'กำลังโหลด...'}
                                        </small>
                                    </div>
                                    <Button
                                        onClick={cancelPageSelection}
                                        variant="secondary"
                                        className="w-100 mt-3"
                                    >ยกเลิก</Button>
                                </Form>
                            ) : (
                                <Form onSubmit={login}>
                                    <Form.Group>
                                        <Form.Label>
                                            username
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
                                    {
                                        messageError ? (<p style={{ color: 'red', marginTop: '12px' }}> รหัสผ่าน หรือ ชื่อผู้ใช้ไม่ถูกต้อง </p>) : <> </>
                                    }


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

                                    <Button
                                        onClick={loginWithFacebook}
                                        disabled={!fbReady}
                                        variant="primary"
                                        className="w-100 mt-2"
                                        style={{ backgroundColor: '#1877F2', border: '0px' }}
                                    >
                                        Login with Facebook
                                    </Button>

                                </Form>
                            )}
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
