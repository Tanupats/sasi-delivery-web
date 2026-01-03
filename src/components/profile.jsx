import { useContext, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { httpPut } from "../http";
import { AuthData } from "../ContextData";
import Swal from 'sweetalert2'
import moment from "moment";
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
            <Col md={3}></Col>
            <Col md={6}>
                <Card>
                    <Card.Title className="text-center mt-4">โปรไฟล์ร้านค้า</Card.Title>
                    <Card.Body>

                        <h5>ข้อมูลผู้ใช้</h5>
                        <p>    ชื่อ-นามสกุล :   {user.name}</p>
                        <p>    อีเมล :   {user.email}</p>
                        <label htmlFor="">เบอร์โทร</label>
                        <input type="text"
                            className="form-control mb-2"
                            value={user.phone}
                            onChange={(e) => setPhone(e.target.value)} />
                        <h5>ข้อมูลร้านค้า</h5>
                        <p> ชื่อร้าน  :  {shop.name}</p>
                        <p> วันที่ลงทะเบียน: {moment(new Date(shop.creted)).format("DD/MM/YYYY").toLocaleString()}</p>
                        <p>    สถานะเปิดร้าน  :    {status ?

                            <Button variant="success" onClick={() => {
                                setStatus(false)
                            }}> เปิดร้าน </Button> :
                            <Button variant="danger" onClick={() => { setStatus(true) }}>ร้านปิด</Button>}</p>
                        <label htmlFor="">เวลาเปิด-ปิดร้าน</label>
                        <input type="text"
                            className="form-control mb-2"
                            value={shop.open_time}
                            onChange={(e) => setPhone(e.target.value)} />

                        <Button onClick={() => updateData()} className="mt-2">แก้ไขโปรไฟล์</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}></Col>
        </Row>
    )
}

export default Profile;