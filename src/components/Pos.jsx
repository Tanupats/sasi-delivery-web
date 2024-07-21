
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
import { useNavigate } from "react-router-dom";
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

const Time = new Date().toLocaleTimeString()
const date = new Date().toLocaleDateString()
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [defaultMenu, setDefaultMenu] = useState({})
  const [newId, setNewId] = useState("")

  const printSlip = () => {
    window.print()
  }


  const onSelectMenu = (obj) => {
    getQueueNumber()
    let ID = nanoid(10)
    setNewId(ID)
    addTocart({ ...obj, id: ID })
    setDefaultMenu(obj)
    handleShow()
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
    getMenuType()
    getMenu()
  }, [])

  useEffect(() => {
  }, [queueNumber])

  return (

    <div>
      <Container fluid>



        <Row className='mt-3' style={{ height: '100vh' }}>
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
                  <h5>เมนูอาหาร</h5>
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
            <div>
              <div className='text-center'>

                SASI Restaurant หนองคาย<br></br>
                ใบเสร็จรับเงิน
                <h6> ลำดับคิว {queueNumber} </h6>
                วันที่ {date} {Time}
                <h6>รายการอาหาร</h6>
              </div>

              <Row>
                <div >
                  <Col md={12}>

                    <Table>
                      {/* <thead>
                        <tr>
                        <th>รายการ</th>
                        <th>จำนวน</th>
                        <th></th>
                        <th>ราคา</th>
                        <th></th>
                      </tr>
                      </thead> */}

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
                          <td style={{ padding: 0, margin: 0 }}>ราคารวม {sumPrice} บาท</td>
                          <td style={{ padding: 0, margin: 0 }}> </td>

                        </tr>
                        {/* <tr>
                          <td>จำนวน</td>
                          <td colSpan={3}>{toTal} รายการ</td>

                        </tr> */}
                      </tbody>
                    </Table>



                  </Col>
                </div>
              </Row>


              <div>
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
                  <div className="mt-2">
                    <h6>การรับอาหาร - {orderType}</h6>
                  </div>


                  <div >
                    <h6>ข้อมูลติดต่อ - {name}</h6>
                  </div>
                  <Row className='order-type when-print'>
                    <Col>

                      <Form.Control
                        type="text"
                        placeholder='ข้อมูลติดต่อ'
                        onChange={(e) => setName(e.target.value)} value={name} />
                    </Col>
                  </Row>

                </Form>
                <Row className='mt-2 when-print'>

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

              </div>

            </div>
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
                            defaultValue={defaultMenu?.foodname}
                            placeholder='เมนู'
                            onChange={(e) => updateFoodName(newId, e.target.value)}

                          />

                        </Form>

                      </Row>
                    </Col>

                    <Col md={12}>
                      <Form.Label> หมายเหตุ </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder='หมายเหตุ'
                        onChange={(e) => updateNote(newId, e.target.value)}

                      />
                    </Col>

                  </Row>

                </Card.Body>



              </Card>

            </Col>

            <Col md={12}>

              <ButtonGroup className='when-print mb-2'>
                <Button className='btn btn-primary'
                  onClick={() => setMenuPichet(newId)}
                  style={{ border: 'none' }} > { }พิเศษ { }</Button>
                <Button className='btn btn-success'
                  onClick={() => setMenuNormal(newId, defaultMenu)}
                  style={{ border: 'none' }} >ธรรมดา</Button>

              </ButtonGroup>

            </Col>
            {

              cart?.map(item => {
                if (item.id === newId) {
                  return (

                    <>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label> จำนวน </Form.Label>
                          <Row>

                            <Col md={2}>
                              <Button onClick={() => { updateQuantity(newId, (item.quntity + 1)) }}>+</Button>
                            </Col>
                            <Col md={8}>
                              <Form.Control
                                className='w-100'
                                type='number'
                                value={item.quntity}
                                onChange={(e) => { updateQuantity(newId, e.target.value) }} />
                            </Col>
                            <Col md={2}>
                              <Button onClick={() => { updateQuantity(newId, (item.quntity - 1)) }}>-</Button>
                            </Col>
                          </Row>

                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label> ราคา </Form.Label>
                          <Form.Control
                            value={item.price}
                            type='number'
                            onChange={(e) => updatePrice(newId, e.target.value)} />
                        </Form.Group>

                      </Col>
                    </>
                  )
                }
              })
            }


          </Row>
        </Modal.Body>
        {
          cart.length > 0 && (<>
            <Modal.Footer>
              <Container>


                <Row>

                  <Col md={6}>
                    <Button variant="success w-100" onClick={() => handleClose()}>
                      ยืนยัน
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button variant="danger w-100" onClick={handleClose}>
                      ยกเลิก
                    </Button>
                  </Col>
                </Row>
              </Container>

            </Modal.Footer>
          </>)
        }
      </Modal>
    </div>
  );
}

export default Pos; 