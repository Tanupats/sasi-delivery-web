import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Modal, Card } from "react-bootstrap";
import { http } from "../../http";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
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
    const res = await http.post("/auth/sigup", body);
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
    await http.get(`/user?shop_id=${shopId}`, {
      headers: { apikey: token },
    }).then((data) => {
      if (data.status === 200) {
        setData(data.data);
      }
    });
  };

  const deleteData = async (id) => {
    try {
      // แสดง Swal เพื่อยืนยันการลบ
      const result = await Swal.fire({
        title: "ยืนยันการลบผู้ใช้?",
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
        await http.delete(`/user/${id}`, { headers: { apikey: token } });
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
    <Card className="user-management-card">
      <Card.Body>
      <Modal show={show} onHide={handleClose} size="lg" centered className="user-modal">
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
                    <option value="cashier">Cashier</option>
                    <option value="rider">Rider</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                  <Button type="submit" variant="primary" className="mt-3 w-100">
                  บันทึกข้อมูลพนักงาน
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

        <div className="user-page-header">
          <div className="user-page-heading">
            <div className="user-page-icon"><GroupOutlinedIcon /></div>
            <div>
              <h2>จัดการพนักงาน</h2>
              <p>เพิ่มและดูแลข้อมูลสมาชิกในทีมของร้าน</p>
            </div>
          </div>
          <Button variant="success" className="add-user-button" onClick={handleShow}>
            <AddCircleIcon /> เพิ่มพนักงาน
          </Button>
        </div>

      <TableContainer component={Paper} className="user-table-container">
        <Table sx={{ minWidth: 650 }} aria-label="ตารางข้อมูลพนักงาน">
          <TableHead>
            <TableRow className="user-table-head">
              <TableCell>ลำดับ</TableCell>

              <TableCell align="left">ชื่อ-นามสกุล</TableCell>
              <TableCell align="left">ชื่อผู้ใช้</TableCell>
              <TableCell align="left">แผนก</TableCell>
              <TableCell align="left">เบอร์โทร</TableCell>
              <TableCell align="left">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 ?
              data?.map((row, index) => (
                <TableRow
                  key={index}
                  className="user-table-row"
                >
                  <TableCell component="th" scope="row">
                    <span className="user-index">{String(index + 1).padStart(2, "0")}</span>
                  </TableCell>

                  <TableCell align="left" className="user-name-cell">{row.name}</TableCell>
                  <TableCell align="left" className="user-email-cell">{row.email}</TableCell>

                  <TableCell align="left">
                    <span className={`department-badge department-${row.department}`}>
                      {row.department || "ไม่ระบุ"}
                    </span>
                  </TableCell>
                  <TableCell align="left" className="user-phone-cell">{row.phone || "-"}</TableCell>
                  <TableCell align="left">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="delete-user-button"
                      onClick={() => deleteData(row.id)}
                      aria-label={`ลบผู้ใช้ ${row.name}`}
                      title={`ลบผู้ใช้ ${row.name}`}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="user-empty-state">
                      <GroupOutlinedIcon />
                      <strong>ยังไม่มีข้อมูลพนักงาน</strong>
                      <span>เริ่มต้นด้วยการเพิ่มสมาชิกคนแรกของร้าน</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
      </Card.Body>
      </Card>
    
  );
};
export default User;
