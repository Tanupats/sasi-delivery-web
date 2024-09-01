
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
import EggAltIcon from '@mui/icons-material/EggAlt';
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
    updateNote,
    orderType,
    setOrderType,
    setName,
    name,
    updatePrice,
    updateQuantity,
    setMenuPichet,
    setMenuNormal,
    updateFoodName,
    queueNumber,
    getQueueNumber,
  } =
    useContext(AuthData)

  const [menu, setMenu] = useState([]);
  const [menuType, setMenuType] = useState([]);
  const [show, setShow] = useState(false);
  const [shop, setShop] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [defaultMenu, setDefaultMenu] = useState({})
  const [newId, setNewId] = useState("")


  const [phoneNumber, setPhoneNumber] = useState("0983460756");
  const [showQr, setShowQr] = useState(false);
  const [qrCode, setqrCode] = useState("sample");
  const [numberEage, setNumberEage] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const printSlip = () => {

    window.print()
  }


  function handleQR() {
    setqrCode(generatePayload(phoneNumber, { amount: sumPrice }));
  }
  const userid = localStorage.getItem("userId");
  const getMyShop = async () => {
    await axios.get(`${import.meta.env.VITE_BAKUP_URL}/shop/shop-user/${userid}`)
      .then((res) => {

        setShop(res.data)
      })
  }

  const addEage = () => {
    let id = nanoid(10)
    addTocart({ foodname: "ไข่ดาว", Price: 5, id: id, quantity: numberEage })
    handleClose();
  }

  const confirmMenu = async () => {
    let ID = nanoid(10)
    setNewId(ID)
    addTocart({ ...defaultMenu, id: ID })
    handleClose();

  }

  const onSelectMenu = (obj) => {
    setDefaultMenu(obj)
    setNewPrice(obj.Price)
    getQueueNumber()
    handleShow()
  }

  const updateSpecail = () => {
    const price = Number(newPrice) + 10
    console.log(defaultMenu)
    setDefaultMenu({ ...defaultMenu, foodname: defaultMenu.foodname + 'พิเศษ', Price: price })

  }

  const getMenu = async () => {
    await axios.get(import.meta.env.VITE_BAKUP_URL + '/foodmenu').then(
      res => {
        if (res.status === 200) {
          setMenu(res.data);
        }
      }
    )
  }

  const getMenuType = async () => {
    await axios.get(`${import.meta.env.VITE_BAKUP_URL}/menutype`)
      .then(res => {
        setMenuType(res.data);
      })
  }

  const getMenuBytypeId = async (id) => {
    await axios.get(`${import.meta.env.VITE_BAKUP_URL}/foodmenu/${id}`)
      .then(res => {
        setMenu(res.data);
      })
  }

  useEffect(() => {
    getMyShop()
    getMenuType()
    getMenu()
  }, [])

  useEffect(() => {
    const Time = new Date().getHours() + ':' + new Date().getMinutes() + " น.";
    const DateToday = new Date().toLocaleDateString()

    setTime(Time);
    setDate(DateToday)

  }, [queueNumber])

  useEffect(() => {
    handleQR()
  }, [sumPrice])




  return (
<>
   
      <Container fluid>



        <Row className='mt-3'>
          <Col md={2} className='whenprint' >
            <div className='menu-type'>
              <Row>


                {
                  menuType.map((item, index) => {

                    return (<Col md={12}>
                      <Button
                        className='w-100 mb-2'
                        key={index}
                        onClick={() => getMenuBytypeId(item.id)}
                        style={{ backgroundColor: '#FD720D', border: 'none' }}
                      >   {item.name}</Button>
                    </Col>)
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
                    menu.map(item => {
                      return (
                        <Col md={6} onClick={() => onSelectMenu(item)}>
                          <FoodComponent data={item} />
                        </Col>
                      )
                    })
                  }



                </Row>

              </div>

            </div>
          </Col>
          <Col md={4}>
         
              <div className='header-pos text-center'>

                <h6> SASI Restaurant หนองคาย</h6>
                <h6>  ใบเสร็จรับเงิน</h6>
                <h6> ลำดับคิว {queueNumber} </h6>
                วันที่ {date} {time}
                <h6>รายการอาหาร</h6>ุุุุุุุุุุุุุุุุุุุุุุุ
              </div>
ุุุุุ
              <Row>
                
                  <Col md={12}>

                    <Table>
                      <tbody>
                        {

                          cart.map(item => {

                            return (

                              <tr style={{ padding: 0, margin: 0 }}>
                                <td >{item.name} <br></br> {item.note}</td>
                                <td colSpan={2}>{item.quntity}</td>
                                <td colSpan={2}>{item.price}</td>
                                <td>
                                  <div className='whenprint'>
                                    <CancelIcon onClick={() => removeCart(item.id)}
                                      variant='light' style={{ color: 'red', }} /></div></td>
                              </tr>
                            )
                          })
                        }
                        <tr>
                          <td >ราคารวม {sumPrice} บาท</td>
                          <td ></td>
                        </tr>
                        <tr>
                          <td colSpan={4}>การรับอาหาร-{orderType}</td>
                        </tr>
                        <tr>
                          <td > {name}</td>
                          <td ></td>

                        </tr>
                        <div className='text-center'>
                          <Row>

                            <Col md={12}>
                              <Button className='when-print mb-2' onClick={() => { handleQR(), setShowQr(!showQr) }}>สร้าง QR CODE</Button>
                            </Col>
                            <Col md={12} className='text-center'>
                              {
                                showQr ? <center><QRCode value={qrCode} /></center> : <></>
                              }
                            </Col>
                          </Row>
                        </div>
                      </tbody>
                    </Table>
                  </Col>
                </div>
              </Row>
            
              
                <Form>

                  <ButtonGroup className='when-print'>
                    <Button className='btn btn-primary'
                      onClick={() => { setOrderType("เสิร์ฟในร้าน"), setName("ทานที่ร้าน") }}
                      style={{ border: 'none' }} >เสิร์ฟในร้าน</Button>
                    <Button className='btn btn-success'
                      onClick={() => setOrderType("สั่งกลับบ้าน")}
                      style={{ border: 'none' }} >สั่งกลับบ้าน</Button>
                    <Button className='btn btn-danger'
                      onClick={() => { setOrderType("รับเอง"), setName("รับเองหน้าร้าน") }}
                      style={{ border: 'none' }} >รับเอง</Button>
                  </ButtonGroup>


                  <Row className='order-type when-print'>
                    <Col>

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

          

       
        
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>รายการสั่งอาหาร</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12} xs={12}>
              <Card style={{ height: 'auto', marginBottom: '10px', padding: '10px' }}>
                <Card.Body className='p-0'>
                  <Row>

                    <Col md={12}>

                      <Row>
                        <Form>
                          <Form.Label> รายการ</Form.Label>
                          <Form.Control
                            type="text"
                            value={defaultMenu?.foodname}
                            placeholder='เมนู'
                            onChange={(e) => setDefaultMenu({ ...defaultMenu, foodname: e.target.value })}

                          />
                        </Form>
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

                    <Col md={12} className='mt-2'>
                      <ButtonGroup className='when-print mb-2'>
                        <Button className='btn btn-primary'
                          onClick={() => updateSpecail()}
                          style={{ border: 'none' }} > { } พิเศษ { }</Button>
                        {/* <Button className='btn btn-success'
                          onClick={() => setMenuNormal(newId, defaultMenu)}
                          style={{ border: 'none' }} >ธรรมดา</Button>{" "} */}

                      </ButtonGroup><br />
                      <Button onClick={() => setNumberEage(numberEage + 1)}>+</Button>
                      <Button variant='light'> ไข่ดาว {numberEage}
                        <EggAltIcon style={{ color: '#FD720D' }} />
                      </Button>
                      <Button onClick={() => setNumberEage(numberEage - 1)}>-</Button> {" "}
                      <Button variant='light' onClick={() => addEage()}>เพิ่ม</Button>
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
                    <Button onClick={() => { updateQuantity(newId, (defaultMenu.quntity + 1)) }}>+</Button>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      className='w-100'
                      type='number'
                      value={defaultMenu.quntity}
                      onChange={(e) => { updateQuantity(newId, e.target.value) }} />
                  </Col>
                  <Col md={2}>
                    <Button onClick={() => { updateQuantity(newId, (defaultMenu.quntity - 1)) }}>-</Button>
                  </Col>
                </Row>

              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label> ราคา </Form.Label>
                <Form.Control
                  value={defaultMenu.price}
                  type='number'
                  onChange={(e) => updatePrice(newId, e.target.value)} />
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
            </Row>ุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุุ
            </Container >
        </Modal.Footer>

      </Modal>
 
 </> );
}

export default Pos; 