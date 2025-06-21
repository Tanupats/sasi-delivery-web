import { useContext, useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { httpPut } from "../http";
import { AuthData } from "../ContextData";
import Swal from 'sweetalert2'
const Profile = () => {
    const { user, shop, getUser } = useContext(AuthData);
    //user 
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useNavigate();
    //shop
    const [shopName, setShopName] = useState("");
    const [phone, setPhone] = useState(user?.phone);

    const updateData = async () => {
        const body = {
            phone: phone
        }
        await httpPut('/user/' + user?.id, body)
            .then((res) => {
                if (res) {
                    getUser();
                    Swal.fire({
                        title: 'แก้ไขโปรไฟล์',
                        text: 'บันทึกข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน'
                    })
                }
            })
    }

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
                        <p>    เบอร์  :    {user.phone}</p>
                        <input type="text" value={phone}  placeholder="แก้ไขเบอร์" onChange={(e) => setPhone(e.target.value)} />
                        <Button onClick={() => updateData()}>แก้ไข</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={2}></Col>
        </Row>
    )
}

export default Profile;