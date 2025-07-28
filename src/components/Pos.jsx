
import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Row, Col, Table, Card, Form, Container, Modal, Alert, Nav } from 'react-bootstrap';
import FoodComponent from './foodComponent';
import Pagination from 'react-bootstrap/Pagination';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { AuthData } from "../ContextData";
import { nanoid } from 'nanoid'
import SaveIcon from '@mui/icons-material/Save';
let active = 2;
let items = [];
import { httpGet } from '../http';
import QRCode from 'qrcode.react';
import generatePayload from 'promptpay-qr'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}
import { InputGroup } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
const Pos = () => {
  const router = useNavigate()
  const {
    addToCart,
    cart,
    sumPrice,
    removeCart,
    saveOrder,
    orderType,
    setOrderType,
    setName,
    name,
    updateQuantity,
    queueNumber,
    shop,
    toTal,
    staffName,
    user,
    printSlip
  } =
    useContext(AuthData)

  const [menu, setMenu] = useState();
  const [menuType, setMenuType] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [defaultMenu, setDefaultMenu] = useState({})
  const [newId, setNewId] = useState("")

  const token = localStorage.getItem("token");
  const phone = user?.phone;
  const [phoneNumber, setPhoneNumber] = useState(String(phone));
  const [showQr, setShowQr] = useState(false);
  const [qrCode, setQrCode] = useState("sample");
  const [newPrice, setNewPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shopId, setShopId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingByeType, setLoadingByType] = useState(false);
  const [search, setSearch] = useState("");

  const formatMoney = (val) => {
    return new Intl.NumberFormat().format(val)
  }

  function handleQR() {
    setQrCode(generatePayload(phoneNumber, { amount: sumPrice }));
  }

  const confirmMenu = async () => {
    let ID = nanoid(10)
    setNewId(ID)
    addToCart({ ...defaultMenu, id: ID, quantity: quantity })
    handleClose();
    setQuantity(1);
  }

  const onSelectMenu = (obj) => {
    setDefaultMenu(obj);
    setNewPrice(obj.Price);
    handleShow();
  }

  const getMenu = () => {
    setLoadingMenu(true)
    if (shop.shop_id !== undefined) {
      httpGet(`/foodmenu/getByShop/${shop.shop_id}`, { headers: { 'apikey': token } })
        .then(res => {
          if (res.data.length > 0) {
            setMenu(res.data);
            setLoadingMenu(false);
          } else {
            setMenu(null);
            setLoadingMenu(false);
          }
        }
        )
    }
  }

  const getMenuType = () => {
    if (shop.shop_id !== undefined) {
      setLoading(true);
      httpGet(`/menutype/${shop.shop_id}`, { headers: { 'apikey': token } })
        .then(res => {
          if (res.data.length > 0) {
            setMenuType(res.data);
            setLoading(false);
          } else {
            setMenuType(null);
            setLoading(false);
          }
        })
    }
  }

  const getMenuByTypeId = (id) => {
    setLoadingByType(true);
    httpGet(`/foodmenu/${id}`)
      .then(res => {
        setMenu(res.data);
      })
  }

  useEffect(() => {
    const Time = new Date().getHours() + ':' + new Date().getMinutes() + " น.";
    const DateToday = new Date().toLocaleDateString()
    setTime(Time);
    setDate(DateToday)
    handleQR()
  }, [sumPrice])


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router('/');
    }
  }, []);


  useEffect(() => {
    setShopId(shop.shop_id)
  }, [shop])

  useEffect(() => {
    if (shopId !== undefined) {
      getMenu();
      getMenuType();

    }
  }, [shopId])

  return (
    <>
      <Container fluid >
        <Row>
          <Col md={2} className='when-print bg-light border-end shadow-sm'>
            <div style={{ width: '200px', height: '100vh', backgroundColor: '#f8f9fa' }}>
              <h5 className="p-3"></h5>
              <Nav defaultActiveKey="/dashboard" className="flex-column px-3">
                <Nav.Link href="/admin">📦 จัดการสินค้า</Nav.Link>
                <Nav.Link href="/report">📈 รายงาน</Nav.Link>
                <Nav.Link href="/profile">⚙️ โปรไฟล์</Nav.Link>
              </Nav>
            </div>
          </Col>
          <Col md={6} className='when-print'>
            <div className="search mt-4 w-50">
              <InputGroup>
                <InputGroup.Text>
                  <SearchIcon />
                </InputGroup.Text>
                <Form.Control
                  placeholder="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button> ค้นหา </Button>
              </InputGroup>

            </div>

            <div className='menu-type mt-4'>
              <div className="title">
                <h5>category </h5>
              </div>
              <Row>
                {
                  loading ? <center> <CircularProgress /></center> : (
                    menuType?.map((item, index) => {
                      return (
                        <React.Fragment key={index} >
                          <Col md={3} xs={6}>
                            <Card
                              className='category mb-2'
                              onClick={() => getMenuByTypeId(item.id)}
                              style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                padding: 8,
                                backgroundColor:
                                  '#ffffff',
                                border:
                                  '1px solid rgb(143, 143, 143)',
                                fontSize: 16,

                              }}

                            >
                              {item.name}
                            </Card>
                          </Col>
                        </React.Fragment>)
                    })
                  )
                }

                {
                  menuType === null && (
                    <div className="text-center">
                      <Alert variant='danger'>ยังไม่มีประเภทสินค้า</Alert>
                    </div>)
                }
              </Row>

            </div>



            <div className='menu mt-2' >
              <div className="title">
                <h5>product </h5>
              </div>
              <Row>
                {
                  loadingMenu ? (
                    <center> <CircularProgress /></center>
                  ) :
                    (
                      menu?.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Col md={4} xl={3} xs={6}
                              className='mb-2'
                              onClick={() => item.status === 1 &&
                                onSelectMenu(item)}>
                              <FoodComponent data={item} />
                            </Col>
                          </React.Fragment>)
                      })
                    )
                }

                {
                  menu === null && (
                    <><div className="text-center">
                      <Alert variant='danger'>ยังไม่มีรายการสินค้า สามารถเพิ่มได้ที่ เมนูจัดการร้านค้าของคุณ</Alert>
                    </div> </>
                  )
                }
              </Row>
            </div>
          </Col>

          <Col md={4} className="border-start shadow-sm bg-white">
            {

              cart.length > 0 && (<>
                <div className='text-center'>

                  {/* <img style={{ width: '40%' }} src={`${import.meta.env.VITE_API_URL}/images/${shop?.photo}`} alt="" srcset="" /> */}
                  <h6> {shop?.name}</h6>
                  <h6>  ใบเสร็จรับเงิน</h6>
                  <h6> ลำดับคิว {queueNumber} </h6>
                  วันที่ซื้อสินค้า {date} เวลา {time}

                  {/* {statusPrint} */}

                </div>
                <Row className='mt-4'>
                  <Col md={12}>
                    <div className='when-print'>
                      <h5>รายการสินค้า</h5></div>
                    <Table>
                      <tbody>
                        {
                          cart.map((item, index) => {
                            return (
                              <tr key={index} style={{ padding: 0, margin: 0 }}>
                                <td style={{ padding: '2px 4px', lineHeight: '1.5' }}>
                                  {item.name} <br /> {item.note}
                                </td>
                                <td style={{ padding: '2px 4px', lineHeight: '1.5' }}>{item.quantity}</td>
                                <td style={{ padding: '2px 4px', lineHeight: '1.5' }}>{formatMoney(item.price)}</td>
                                <td style={{ padding: '2px 4px', lineHeight: '1.5' }}>
                                  <div className="when-print">
                                    <CancelIcon
                                      onClick={() => removeCart(item.id)}
                                      variant="light"
                                      style={{ color: 'red' }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        }

                        <tr>
                          <td className='get-order' colSpan={4}>การรับสินค้า-{orderType}</td>
                        </tr>
                        <tr>
                          <td className='get-order' style={{ padding: '2px 4px', lineHeight: '1.2' }} colSpan={4}>รวม {toTal} รายการ</td>
                        </tr>
                        {
                          name !== "" && (
                            <tr>
                              <td>{name}</td>
                            </tr>
                          )
                        }

                        <tr>
                          <td>
                            ยอดรวม {sumPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })} บาท
                          </td>

                        </tr>


                      </tbody>

                    </Table>

                    {

                      cart?.length > 0 && (
                        <Row>
                          <Col>
                            <div className="total when-print mb-2 text-center">
                              <h5> รวมทั้งหมด {sumPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</h5>
                              <h5>  รวม {toTal} รายการ</h5>
                            </div>

                          </Col>

                          <Col md={12}>
                            <Button
                              variant='primary'
                              className='when-print mb-2 w-100'
                              onClick={() => {
                                handleQR(),
                                  setShowQr(!showQr)
                              }}>
                              qrcode payment </Button>
                          </Col>
                          <Col md={12} className='text-center'>
                            {
                              showQr ? <center><QRCode value={qrCode} />
                                <h5>{staffName}</h5>
                              </center> : <></>
                            }
                          </Col>
                        </Row>
                      )
                    }

                    <Form>
                      <Row className='order-type when-print'>
                        <ButtonGroup >
                          <Button className='btn btn-danger w-100'
                            onClick={() => { setOrderType("เสิร์ฟในร้าน"), setName("ทานที่ร้าน") }}
                            style={{ border: 'none' }} >ทานที่ร้าน</Button>

                          <Button className='btn btn-primary w-100'
                            onClick={() => { setOrderType("รับเอง"), setName("รับเองหน้าร้าน") }}
                            style={{ border: 'none' }} >รับหน้าร้าน</Button><Button className='btn btn-success w-100'
                              onClick={() => { setOrderType("สั่งกลับบ้าน"), setName("จัดส่ง") }}
                              style={{ border: 'none' }} >จัดส่ง</Button>
                        </ButtonGroup>
                        <Col md={12} className='mt-3 mb-4' style={{ marginBottom: '500px' }}>
                          <Form.Control
                            type="text"
                            placeholder='ข้อมูลติดต่อ'
                            onChange={(e) => setName(e.target.value)} value={name} />
                        </Col>
                      </Row>
                    </Form>
                    <Row className='mt-3 mb-2 when-print sticky-bottom-mobile'>


                      <Col md={6} xs={6}>
                        <Button
                          style={{ height: '46px' }}
                          onClick={() => { saveOrder() }}
                          variant='success w-100'>
                          <SaveIcon />  บันทึก
                        </Button>
                      </Col>

                      <Col md={6} xs={6}>
                        <Button
                          style={{ height: '46px' }}
                          onClick={() => { printSlip() }}
                          variant='primary w-100'>
                          <LocalPrintshopIcon />  พิมพ์
                        </Button>
                      </Col>
                    </Row>

                  </Col>
                </Row>

              </>


              )
            }


          </Col>
        </Row>

      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>รายการ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12} xs={12}>
              <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                <Card.Body className='p-0'>
                  <Row>

                    <Col md={12}>

                      <Row>
                        <Col md={12}>
                          <Form>
                            <Form.Label> รายการ</Form.Label>
                            <Form.Control
                              type="text"
                              value={defaultMenu?.foodname}
                              placeholder='เมนู'
                              onChange={(e) => setDefaultMenu({ ...defaultMenu, foodname: e.target.value })}

                            />

                          </Form>
                        </Col>
                        <Col md={12}>
                          <Button
                            style={{ height: '46px', border: 'none', marginTop: '30px' }}
                            className='btn btn-primary w-100'
                            onClick={() => setDefaultMenu({ ...defaultMenu, foodname: defaultMenu.foodname + 'พิเศษ', Price: parseInt(defaultMenu.Price) + 10 })
                            }
                          > { } พิเศษ { }</Button>
                        </Col>

                      </Row>
                    </Col>

                    <Col md={12} className='mt-2'>
                      <Form.Label> หมายเหตุ </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder='หมายเหตุ'
                        onChange={(e) => setDefaultMenu({ ...defaultMenu, note: e.target.value })}

                      />
                    </Col>


                  </Row>

                </Card.Body>



              </Card>

            </Col>


            <Col md={6}>
              <Form.Group>
                <Form.Label> จำนวน </Form.Label>
                <Row>

                  <Col md={2}>
                    <Button onClick={() => { setQuantity(quantity + 1) }}>+</Button>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      className='w-100'
                      type='number'
                      value={quantity}
                      onChange={(e) => { updateQuantity(newId, e.target.value) }} />
                  </Col>
                  <Col md={2}>
                    <Button onClick={() => { setQuantity(quantity - 1) }}>-</Button>
                  </Col>
                </Row>

              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label> ราคา </Form.Label>
                <Form.Control
                  value={defaultMenu.Price}
                  type='number'
                  onChange={(e) => setDefaultMenu({ ...defaultMenu, Price: e.target.value })} />
              </Form.Group>

            </Col>


          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Container>


            <Row>

              <Col md={6} xs={6}>
                <Button variant="success w-100" onClick={() => { confirmMenu() }}>
                  ยืนยัน
                </Button>
              </Col>
              <Col md={6} xs={6}>
                <Button variant="danger w-100" onClick={handleClose}>
                  ยกเลิก
                </Button>
              </Col>
            </Row>
          </Container >
        </Modal.Footer>

      </Modal>

    </>
  );
}

export default Pos; 