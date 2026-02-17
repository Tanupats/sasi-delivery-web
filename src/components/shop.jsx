import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Row, Col, Card, Image } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import { signInWithPopup } from "firebase/auth"
// import { auth, facebookProvider } from "../firebase"
const ShopData = () => {
    const { userid, name } = useParams();
    const router = useNavigate();
    const [data, setData] = useState([]);
    const PageAccessToken = import.meta.env.VITE_PAGE_ACCESS_TOKEN;
    const [loading, setLoading] = useState(false);

    const sendTestMessage = async (recipientId) => {
        try {

            const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PageAccessToken}`;
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    recipient: { id: recipientId },
                    message: { text: "สวัสดีครับ ลูกค้ากดสั่งอาหาร และแจ้งชำระเงินได้เลยครับ" }
                }),
                headers: { "Content-Type": "application/json" }
            });
            return res;
        } catch (err) {
            return null;
        }
    };

    const handleShopClick = async (shop) => {
        setLoading(true);
        const res = await sendTestMessage(userid);
        if (res.status === 200) {
            setLoading(false);
            router('/foodmenu/' + shop);
        } else {
            setLoading(false);
            Swal.fire('ลิงค์หมดอายุเนื่องจากใช้งานมาแล้วครบ 24 ชม. กรุณาส่งข้อความขอลิงค์ใหม่กับทางร้านค้า', { showConfirmButton: false })
        }
    }

    useEffect(() => {
        const getShopData = async () => {
            await axios.get(`${import.meta.env.VITE_API_URL}/shop`)
                .then(res => { setData(res.data); });
        };

        if (userid && name) {
            localStorage.setItem("messangerId", userid);
            localStorage.setItem("name", name);
            getShopData();
        }
    }, [])



    // const login = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, facebookProvider)
    //         const user = result.user

    //         console.log("Login success:", user)
    //         alert(`ยินดีต้อนรับ ${user.displayName}`)
    //     } catch (err) {
    //         console.error(err)
    //         alert("Login ไม่สำเร็จ")
    //     }
    // }


    return (<>
        <Card style={{ marginBottom: '120px', border: 'none' }}>
            <Card.Body>
                <Row>
                    {
                        data.map((item, index) => {

                            if (item.id === 1) return (
                                <React.Fragment key={index}>
                                    <Col
                                        md={4}
                                        xs={12}
                                        className="mt-2"
                                    >
                                        {

                                            loading ?  <h3>กำลังโหลด....</h3> : <>
                                                <Card onClick={() => handleShopClick(item.shop_id)} style={{ cursor: item.is_open ? 'pointer' : 'not-allowed' }}>
                                                    <Card.Body style={{ padding: 10 }}>

                                                        <Card.Title>{item.name}</Card.Title>
                                                        <div className="mb-2">

                                                            <h4>
                                                                {
                                                                    item.is_open ? (<Badge bg="success" style={{ fontWeight: 500 }}>
                                                                        เปิด <AccessTimeIcon />
                                                                        {item.open_time}
                                                                    </Badge>) : (<>


                                                                        <Badge bg="danger">{item.open_time}  </Badge>
                                                                    </>)
                                                                }
                                                            </h4>
                                                        </div>

                                                        <Image
                                                            style={{
                                                                width: "100%",
                                                                height: "200px",
                                                                objectFit: "cover",
                                                                cursor: item.is_open ? "pointer" : "not-allowed",
                                                                opacity: item.is_open ? 1 : 0.5,
                                                            }}
                                                            src={`${import.meta.env.VITE_API_URL}/images/${item.photo}`}

                                                        />

                                                    </Card.Body>
                                                </Card>
                                            </>
                                        }

                                    </Col>

                                </React.Fragment>
                            );
                        })
                    }

                </Row>



                {/* <button onClick={login}>
                        Login with Facebook
                    </button> */}



            </Card.Body>


        </Card >
    </>)
}

export default ShopData;