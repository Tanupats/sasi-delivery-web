import { useContext, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { httpPut } from "../http";
import { AuthData } from "../ContextData";
import Swal from 'sweetalert2'
import moment from "moment";
const Profile = () => {
    const { user,setUser, shop, getUser, setShop } = useContext(AuthData);
    const [status, setStatus] = useState(shop?.is_open);
    

    const updateData = async () => {

        await httpPut('/shop/' + shop?.id, {...shop,is_open:status})
            .then((res) => {
                if (res) {
                    getUser();
                    Swal.fire({
                        title: 'แก้ไขข้อมูลสำเร็จ',
                        text: 'บันทึกข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน'
                    })
                }
            })
    }

    return (
        <Row className='mt-4'>
            <Col md={3}></Col>
            <Col md={6}>
                <Card>
                    <Card.Title className="text-center mt-4">โปรไฟล์</Card.Title>
                    <Card.Body>

                        <h5>ข้อมูลผู้ใช้</h5>
                        <p>    ชื่อ-นามสกุล :   {user.name}</p>
                        <p>    อีเมล :   {user.email}</p>
                        <label htmlFor="">เบอร์โทร</label>
                        <input type="text"
                            className="form-control mb-2"
                            value={user.phone}
                            onChange={(e) => setUser(e.target.value)} />
                        <h5>ข้อมูลร้านค้า</h5>
                        <p> ชื่อร้าน  :  {shop.name}</p>
                        <p> ประเภทร้านค้า  :  {shop.shop_type}</p>
                        <p> วันที่ลงทะเบียน: {moment(new Date(shop.creted)).format("DD/MM/YYYY").toLocaleString()}</p>
                        <p> สถานะเปิดร้าน  :    {status ?

                            <Button variant="success" onClick={() => {
                                setStatus(false)
                            }}> เปิดร้าน </Button> :
                            <Button variant="danger" onClick={() => { setStatus(true) }}>ร้านปิด</Button>}</p>
                        <label htmlFor="">เวลาเปิด-ปิดร้าน</label>
                        <input type="text"
                            className="form-control mb-2"
                            value={shop.open_time}
                            onChange={(e) => setShop({ ...shop, open_time: e.target.value })} />

                        <Button onClick={() => updateData()} className="mt-2">แก้ไขโปรไฟล์</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}></Col>
        </Row>
    )
}

export default Profile;