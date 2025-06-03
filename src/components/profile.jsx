import { useContext, useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { httpPost } from "../http";
import { AuthData } from "../ContextData";
const Profile = () => {
    const { user, shop } = useContext(AuthData);
    //user 
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useNavigate();
    //shop
    const [shopName, setShopName] = useState("");
    const [photo, setPhoto] = useState("");

    return (
        <Row className='mt-4'>
            <Col md={2}></Col>
            <Col md={8}>
                <Card>
                    <Card.Title className="text-center mt-4">โปรไฟล์</Card.Title>
                    <Card.Body>
                        <h5>ข้อมูลร้านค้า</h5>
                        <p> {shop.name}</p>
                        <p> วันที่ลงทะเบียน : {shop.creted}</p>
                        <h5>ข้อมูลผู้ใช้</h5>
                        <p>    ชื่อ-นามสกุล :   {user.name}</p>
                        <p>    อีเมล :   {user.email}</p>
                       
                      <Button>แก้ไข</Button>          
                    </Card.Body>
                </Card>
            </Col>
            <Col md={2}></Col>
        </Row>
    )
}

export default Profile;