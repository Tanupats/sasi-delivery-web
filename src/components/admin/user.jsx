import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Modal, Card } from "react-bootstrap";
import { httpDelete, httpGet, httpPost } from "../../http";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import AddCircleIcon from '@mui/icons-material/AddCircle';
const User = () => {
  const token = localStorage.getItem("token");
  const shopId = localStorage.getItem("shopId");
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const saveUser = async (e) => {
    e.preventDefault();
    const body = {
      name: name,
      email: email,
      password: passWord,
      department: department,
      shop_id: shopId,
      phone: phone,
    };
    const res = await httpPost("/auth/sigup", body);
    res.status === 200 &&
      Swal.fire({
        title: "เพิ่มข้อมูลสำเร็จ!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    await getData();
    setShow(false);
    setName("");
    setEmail("");
    setPassWord("");
    setDepartment("");
    setPhone("");
  };

  const getData = async () => {
    await httpGet(`/user?shop_id=${shopId}`, {
      headers: { apikey: token },
    }).then((data) => {
      if (data.status === 200) {
        setData(data.data);
      }
    });
  };

  const deleteOutcome = async (id) => {
    try {
      // แสดง Swal เพื่อยืนยันการลบ
      const result = await Swal.fire({
        title: "ยืนยันการลบ?",
        text: "คุณต้องการลบข้อมูลนี้หรือไม่!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        // หากผู้ใช้กดยืนยัน
        await httpDelete(`/user/${id}`);
        await getData();
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting the record:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบข้อมูลได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card>
      <Card.Body>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มข้อมูลผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => saveUser(e)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>ชื่อ-นามสกุล</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    placeholder="กรอกชื่อ-นามสกุล"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>อีเมล</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    placeholder="example@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>รหัสผ่าน</Form.Label>
                  <Form.Control
                    type="password"
                    value={passWord}
                    placeholder="กรอกรหัสผ่าน"
                    onChange={(e) => setPassWord(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>เบอร์โทร</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone}
                    placeholder="08xxxxxxxx"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>แผนก</Form.Label>
                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">เลือกแผนก</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                    <option value="rider">Rider</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Button type="submit" variant="primary mt-3 w-100">
                  บันทึก
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

<Row>

  <Col>
    <Button variant="secondary"   onClick={handleShow}>
     <AddCircleIcon /> เพิ่มข้อมูลพนักงาน
      </Button>
  </Col>
</Row>
    


      <TableContainer component={Paper} className="mt-3">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>

              <TableCell align="left">ชื่อ-นามสกุล</TableCell>
              <TableCell align="left">อีเมล</TableCell>
              <TableCell align="left">แผนก</TableCell>
              <TableCell align="left">เบอร์โทร</TableCell>
              <TableCell align="left">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 &&
              data?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>

                  <TableCell align="left">{row.name} </TableCell>
                  <TableCell align="left">{row.email}</TableCell>

                  <TableCell align="left">{row.department}</TableCell>
                  <TableCell align="left">{row.phone}</TableCell>
                  <TableCell align="left">
                    <Button
                      variant="danger"
                      onClick={() => deleteOutcome(row.id)}
                    >
                      {" "}
                      ลบ{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Card.Body>
      </Card>
    
  );
};
export default User;
