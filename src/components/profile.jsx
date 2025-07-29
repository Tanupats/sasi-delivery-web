import { useContext, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { httpPut } from "../http";
import { AuthData } from "../ContextData";
import Swal from 'sweetalert2'
const Profile = () => {
    const { user, shop, getUser } = useContext(AuthData);
    const [status, setStatus] = useState(shop?.is_open);
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
        await updateIsOpen();
    }

    const updateIsOpen = async () => {
        const body = {
            is_open: status
        }
        await httpPut('/shop/' + shop?.id, body)
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
                        <p>    สถานะเปิดร้าน  :    {status ?

                            <Button onClick={() => {
                                setStatus(false)
                            }}> เปิดร้าน </Button> :
                            <Button onClick={() => { setStatus(true) }}>ปิดร้าน</Button>}</p>
                        <input type="text" value={phone}
                            placeholder="แก้ไขเบอร์"
                            onChange={(e) => setPhone(e.target.value)} />
                        <br />

                        <Button onClick={() => updateData()} className="mt-2">บันทึก</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={2}></Col>
        </Row>
    )
}

export default Profile;