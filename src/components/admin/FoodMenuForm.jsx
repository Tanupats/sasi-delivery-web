import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button, Modal, Form } from "react-bootstrap";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { AuthData } from "../../ContextData";
import Swal from "sweetalert2";
import { httpGet, httpPost } from "../../http";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
const FoodMenuForm = (props) => {
  const { getFoodMenu } = props;
  const { shop } = useContext(AuthData);
  const [show, setShow] = useState(false);
  const [foodname, setFoodName] = useState("");
  const [price, setPrice] = useState(50);
  const [img, setImg] = useState("");
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const [status, setStatus] = useState("1");
  const [menuType, setMenuType] = useState([]);
  const [menuTypeId, setMenuTypeId] = useState("");
  const shopId = shop?.shop_id;
  const token = localStorage.getItem("token");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errorMessage, setErrorMessage] = useState("");
  const getMenuType = async () => {
    if (shopId !== undefined) {
      await httpGet(`/menutype/${shopId}`, { headers: { apikey: token } }).then(
        (res) => {
          setMenuType(res.data);
        },
      );
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", img);
    const res = await httpPost("/upload", formData);
    if (res.status === 200) {
      return res.data.filename;
    }
    return null;
  };

  const postMenu = async (e) => {
    e.preventDefault();
    
    if (!img) {
      setErrorMessage("กรุณาอัพโหลดรูปภาพสินค้า");
      return;
    }

    setErrorMessage("");
    const uploadedFilename = await uploadFile();
    
    if (uploadedFilename) {
      const body = {
        foodname: foodname,
        TypeID: parseInt(menuTypeId),
        Price: parseInt(price),
        img: uploadedFilename,
        code: code,
        status: parseInt(status),
        shop_id: shopId,
      };
      await httpPost(`/foodmenu`, body, { headers: { apikey: token } }).then(
        (res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "บันทึกข้อมูลสำเร็จ",
              icon: "success",
              confirmButtonText: "ยืนยัน",
              timer: 1300,
            });
            getFoodMenu();
            setImg("");
            setImgPreview(null);
            setFoodName("");
            setPrice(50);
            handleClose();
          }
        },
      );
    }
  };

  const [imgPreview, setImgPreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImgPreview(null);
    }
  };

  useEffect(() => {
    getMenuType();
  }, [shop]);

  console.log(errorMessage);
  useEffect(() => {
    if (menuType?.length > 0) {
      setMenuTypeId(menuType[0].id);
    }
  }, [menuType]);

  return (
    <>
      <Row className="mb-3 mt-3">
        <Col>
          <Button variant="success" onClick={() => handleShow()}>
            <AddCircleIcon /> เพิ่มสินค้าใหม่{" "}
          </Button>
        </Col>
      </Row>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มข้อมูลสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addmenu" onSubmit={(e) => postMenu(e)}>
            <Row>
              <Col md={12} xs={12}>
                <Card
                  style={{
                    height: "auto",
                    marginBottom: "10px",
                    padding: "10px",
                  }}
                >
                  <Card.Body className="p-0">
                    <Row>
                      <Col md={5} xs={5}>
                        <Form.Group>
                          <Form.Label>รูปภาพสินค้า </Form.Label>

                          <Image
                            src={imgPreview}
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                            }}
                          />
                         
                          
                          
                          <Form.Group className="mt-4">
                            <Form.Group className="mt-4">
                              <Form.Label
                                className="w-100 outline-none text-center"
                                htmlFor="upload-file"
                                style={{
                                  backgroundColor: "#eeeeee", // สีเทาอ่อน (Light Grey)
                                  color: "#333333", // สีตัวอักษรเทาเข้มเพื่อให้ตัดกับพื้นหลัง
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  border: "1px solid #ccc", // เพิ่มเส้นขอบบางๆ ให้ดูมีมิติ
                                  transition: "0.3s", // ใส่ transition เผื่อเวลา hover
                                }}
                                // เพิ่มเอฟเฟกต์เวลาเอาเมาส์ไปวาง (Optional)
                                onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#e0e0e0")
                                }
                                onMouseOut={(e) =>
                                  (e.target.style.backgroundColor = "#eeeeee")
                                }
                              >
                                <CloudUploadIcon
                                  style={{
                                    color: "#333333",
                                    marginRight: "8px",
                                  }}
                                />{" "}
                                อัพโหลดรูปภาพ 
                                  <p style={{ color: "red", marginTop: "5px" }}>
                              {errorMessage}
                            </p>

                              </Form.Label>

                              <Form.Control
                                id="upload-file"
                               
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                              />
                            </Form.Group>
                          </Form.Group>
                        </Form.Group>
                      </Col>
                      <Col md={7} xs={7}>
                        <Form.Group className="mb-2">
                          <Form.Label>ชื่อสินค้า </Form.Label>
                          <Form.Control
                            type="text"
                            required
                            placeholder="ชื่อสินค้า"
                            onChange={(e) => setFoodName(e.target.value)}
                            value={foodname}
                          />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>ราคา </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            placeholder="ราคา"
                          />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>ประเภท </Form.Label>
                          <Form.Select
                            required
                            onChange={(e) => setMenuTypeId(e.target.value)}
                            aria-label="Default select example"
                          >
                            {menuType.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>สถานะสินค้า </Form.Label>
                          <Form.Select
                            required
                            onChange={(e) => setStatus(e.target.value)}
                            aria-label="Default select example"
                          >
                            <option value="1">พร้อมขาย</option>
                            <option value="0">ของหมด</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col md={3} xs={3}>
              <Button
                form="addmenu"
                type="submit"
                className="w-100"
                variant="primary"
              >
                บันทึก
              </Button>
            </Col>
            <Col md={3} xs={3}>
              <Button className="w-100" variant="danger" onClick={handleClose}>
                ยกเลิก
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FoodMenuForm;
