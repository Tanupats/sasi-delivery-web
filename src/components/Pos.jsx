
import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Row, Col, Table, Card, Image, Form, Container, Modal, Alert } from 'react-bootstrap';
import FoodComponent from './foodComponent';
import Pagination from 'react-bootstrap/Pagination';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { AuthData } from "../ContextData";
import { nanoid } from 'nanoid'
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
let active = 2;
let items = [];
import { httpGet } from '../http';
import QRCode from 'qrcode.react';
import generatePayload from 'promptpay-qr'
import { useNavigate } from "react-router-dom";

for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}


const Pos = () => {
  const router = useNavigate()
  const {
    addTocart,
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
    getQueueNumber,
    shop,
    user
  } =
    useContext(AuthData)

  const [menu, setMenu] = useState([]);
  const [menuType, setMenuType] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [defaultMenu, setDefaultMenu] = useState({})
  const [newId, setNewId] = useState("")

  const token = localStorage.getItem("token");

  const [phoneNumber, setPhoneNumber] = useState("0983460756");
  const [showQr, setShowQr] = useState(false);
  const [qrCode, setqrCode] = useState("sample");
  const [newPrice, setNewPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const printSlip = () => {

    window.print()
  }

 

  function handleQR() {
    setqrCode(generatePayload(phoneNumber, { amount: sumPrice }));
  }


  const confirmMenu = async () => {
    let ID = nanoid(10)
    setNewId(ID)
    addTocart({ ...defaultMenu, id: ID, quantity: quantity })
    handleClose();
    setQuantity(1);
  }

  const onSelectMenu = (obj) => {
    setDefaultMenu(obj)
    setNewPrice(obj.Price)
    getQueueNumber()
    handleShow()
  }

  const getMenu = () => {
    httpGet(`/foodmenu/getByShop/${shop.shop_id}`,{ headers: { 'apikey': token } })
      .then(res => {
        if (res.status === 200) {
          setMenu(res.data);
        }
      }
      )
  }

  const getMenuType =  () => {
    httpGet(`/menutype/${shop.shop_id}`,{ headers: { 'apikey': token }})
      .then(res => {
        setMenuType(res.data);
      })
  }

  const getMenuBytypeId =  (id) => {
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
    if (!token) {  // ตรวจสอบว่าค่า token ไม่มีหรือเป็นค่าว่าง
      router('/');
    }
  }, []);

  useEffect(() => {
    getMenuType()
    getMenu()
  }, [user,shop])




  return (
    <>
      <Container fluid style={{ height: '100vh' }}>
        <Row className='mt-3'>
          <Col md={2} className='whenprint' >
            <div className='menu-type'>
              <Row>
                {
                  menuType.map((item, index) => {

                    return (
                      <React.Fragment key={index} >
                        <Col md={12}>
                          <Button
                            className='w-100 mb-2'

                            onClick={() => getMenuBytypeId(item.id)}
                            style={{
                              backgroundColor:

                                '#FD720D',
                              fontSize: 18,
                              border: 'none'
                            }}
                          >   {item.name}</Button>
                        </Col>
                      </React.Fragment>)
                  })
                }
              </Row>

            </div>
          </Col>
          <Col md={6} className='whenprint'>
            <div >


              <div className='menu' >

                <Row>

                  {
                    menu.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Col md={6} onClick={() => onSelectMenu(item)}>
                            <FoodComponent data={item} />
                          </Col>
                        </React.Fragment>)
                    })
                  }



                </Row>

              </div>

            </div>
          </Col>

          <Col md={4}>

            <div className='header-pos text-center'>

              <h6> {shop?.name}</h6>
              <h6>  ใบเสร็จรับเงิน</h6>
              <h6> ลำดับคิว {queueNumber} </h6>
              วันที่ {date} {time}
            </div>
            <Row>
              <Col md={12}>
                <div className='whenprint'> <h5>รายการอาหาร</h5></div>
                <Table>
                  <tbody>
                    {
                      cart.map(item => {
                        return (

                          <tr style={{ padding: 0, margin: 0 }}>
                            <td >{item.name} <br></br> {item.note}</td>
                            <td colSpan={2}>{item.quantity}</td>
                            <td colSpan={2}>{item.price}</td>
                            <td>
                              <div className='whenprint'>
                                <CancelIcon onClick={() => removeCart(item.id)}
                                  variant='light' style={{ color: 'red', }} /></div></td>
                          </tr>
                        )
                      })
                    }
                    <tr >
                      <td >รวมทั้งหมด {cart.length} รายการ</td>
                      <td ></td>
                    </tr>
                    <tr>
                      <td colSpan={4}>การรับอาหาร-{orderType}</td>
                    </tr>
                    <tr>
                      <td >{name}</td>
                    

                    </tr>
                    <tr>
                    <td colSpan={4}>รวมทั้งหมด {sumPrice} บาท</td>
                    </tr>
                  </tbody>
                </Table>
                {/* <Row>
                  <Col md={12}>

                    <div className="sum-price mb-2">
                     
                    </div>
                  </Col>
                </Row> */}
                {

                  cart?.length > 0 && (
                    <Row>

                      <Col md={12}>
                        <Button className='when-print mb-2 w-100' onClick={() => { handleQR(), setShowQr(!showQr) }}>Patment QR </Button>
                      </Col>
                      <Col md={12} className='text-center'>
                        {
                          showQr ? <center><QRCode value={qrCode} /></center> : <></>
                        }
                      </Col>
                    </Row>
                  )
                }




                <Form>
                  <Row className='order-type when-print '>
                    <ButtonGroup >
                      <Button className='btn btn-primary w-100'
                        onClick={() => { setOrderType("เสิร์ฟในร้าน"), setName("ทานที่ร้าน") }}
                        style={{ border: 'none' }} >เสิร์ฟในร้าน</Button>
                      <Button className='btn btn-success w-100'
                        onClick={() => setOrderType("สั่งกลับบ้าน")}
                        style={{ border: 'none' }} >สั่งกลับบ้าน</Button>
                      <Button className='btn btn-danger w-100'
                        onClick={() => { setOrderType("รับเอง"), setName("รับเองหน้าร้าน") }}
                        style={{ border: 'none' }} >รับเอง</Button>
                    </ButtonGroup>



                    <Col md={12} className='mt-3'>

                      <Form.Control
                        type="text"
                        placeholder='ข้อมูลติดต่อ'
                        onChange={(e) => setName(e.target.value)} value={name} />
                    </Col>
                  </Row>

                </Form>
                <Row className='mt-4 when-print'>

                  <Col md={6}>
                    <Button
                      style={{ height: '46px' }}
                      onClick={() => { printSlip() }}
                      variant='primary w-100'>
                      <LocalPrintshopIcon />  พิมพ์
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      style={{ height: '46px' }}
                      onClick={() => { saveOrder() }}
                      variant='success w-100'>
                      <SaveIcon />  บันทึก
                    </Button>
                  </Col>
                </Row>

              </Col>
            </Row>
          </Col>
        </Row>





      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>รายการอาหาร</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12} xs={12}>
              <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                <Card.Body className='p-0'>
                  <Row>

                    <Col md={12}>

                      <Row>
                        <Col md={8}>
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
                        <Col md={4}>
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

              <Col md={6}>
                <Button variant="success w-100" onClick={() => { confirmMenu() }}>
                  ยืนยัน
                </Button>
              </Col>
              <Col md={6}>
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