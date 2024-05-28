
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
let active = 2;
let items = [];

for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

const Pos = () => {

  const {
    addTocart,
    cart,
    sumPrice,
    toTal,
    removeCart,
    saveOrder,
    updateNote,
    resetCart,
    orderType,
    setOrderType,
    setName,
    name,
    updatePrice,
    updateQuantity,
    setMenuPichet,
    setMenuNormal,
    updateFoodName

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
    let ID = nanoid(10)
    setNewId(ID)
    //add to cart 
    addTocart({ ...obj, id: ID })
    console.log('obj', obj)
    //set data to defaultMenu
    setDefaultMenu(obj)
    //set modal open 
    handleShow()
  }

  const getMenu = async () => {

    await axios.get(import.meta.env.VITE_API_URL + '/').then(
      res => {
        if (res.status === 200) {
          setMenu(res.data);
          console.log(res.data)
        }
      }
    )
  }

  const getMenuType = async () => {
    await axios.get(`${import.meta.env.VITE_API_URL}/GetmenuType.php`)
      .then(res => {
        setMenuType(res.data);
      })
  }


  const getMenuBytypeId = async (id) => {
    await axios.get(`${import.meta.env.VITE_API_URL}/getMenuId.php?TypeID=${id}`)
      .then(res => {
        setMenu(res.data);
      })
  }

  useEffect(() => {
    getMenuType()
    getMenu()
  }, [])



  return (


    <div >
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
                        onClick={() => getMenuBytypeId(item.TypeID)}
                        style={{ backgroundColor: '#FD720D', border: 'none' }}
                      >   {item.T_name}</Button>
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

                  {/* <Col md={12}>
                    <Pagination>{items}</Pagination>
                  </Col> */}

                </Row>

              </div>

            </div>
          </Col>
          <Col md={4}>
            <div>
              <div className='text-center pt-0'>
                <h6>SASI Restaurant หนองคาย</h6>
                <h5>รายการอาหาร</h5>
              </div>

              <Row>
                <div >
                  <Col md={12}>

                    <Table border={1}>

                      <tbody>
                        {

                          cart.map(item => {

                            return (

                              <tr>
                                <td>{item.name} <br></br> {item.note}</td>
                                <td colSpan={2}>{item.quntity}</td>
                                <td colSpan={2}>{item.price}</td>
                                <td>
                                  <Button
                                    onClick={() => removeCart(item.id)}
                                    variant='light' className='whenprint'>
                                    <CancelIcon style={{ color: 'red' }} /></Button></td>
                              </tr>
                            )
                          })
                        }


                        <tr>
                          <td>รวมทั้งหมด</td>
                          <td colSpan={4}>{sumPrice} บาท</td>

                        </tr>
                        <tr>
                          <td>จำนวน</td>
                          <td colSpan={3}>{toTal} รายการ</td>

                        </tr>
                      </tbody>
                    </Table>



                  </Col>
                </div>
              </Row>


              <div>
                <Form>

                  <ButtonGroup className='when-print'>
                    <Button className='btn btn-primary'
                      onClick={() => setOrderType("เสิร์ฟในร้าน")}
                      style={{ border: 'none' }} >เสิร์ฟในร้าน</Button>
                    <Button className='btn btn-success'
                      onClick={() => setOrderType("สั่งกลับบ้าน")}
                      style={{ border: 'none' }} >สั่งกลับบ้าน</Button>
                    <Button className='btn btn-danger'
                      onClick={() => setOrderType("รับเอง")}
                      style={{ border: 'none' }} >รับเอง</Button>
                  </ButtonGroup>

                  <Row className='mt-2'>
                    <Col>
                      <h5>การรับอาหาร - {orderType}</h5>
                      <Form.Control
                        type="text"
                        placeholder='ข้อมูลติดต่อ'
                       
                       onChange={(e) => setName(e.target.value)} />
                    </Col>
                  </Row>

                </Form>
                <Row className='mt-2 when-print'>

                  <Col md={6}>
                    <Button
                      onClick={() => { printSlip() }}
                      variant='primary w-100'>
                      <LocalPrintshopIcon />  พิมพ์
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      onClick={() => { saveOrder() }}
                      variant='success w-100'>
                      <LocalPrintshopIcon />  บันทึก
                    </Button>
                  </Col>


                  <Col>
                    <Button
                      onClick={() => resetCart()}
                      variant='danger w-100 mt-3'>
                      ยกเลิก
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
                    <Col md={5}
                      xs={5}
                    >
                      <Image style={{ width: "100%", height: '100px', objectFit: 'cover' }}
                        src={`${import.meta.env.VITE_BASE_URL}/img/${defaultMenu?.img}`} />
                    </Col>
                    <Col md={7} xs={7}>
                      
                      <Row>
        
                
                        <Form>
                          <Form.Label> รายการ (*แก้ไขได้)</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={defaultMenu?.foodname}
                            placeholder='เมนู'
                            onChange={(e) => updateFoodName(newId, e.target.value)}

                          />
                           <Form.Label> หมายเหตุ </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='หมายเหตุ'
                            onChange={(e) => updateNote(newId, e.target.value)}

                          />
                        </Form>
                      </Row>
                    </Col>



                  </Row>

                </Card.Body>



              </Card>

            </Col>

            <Col md={12}>

              <ButtonGroup className='when-print mb-2'>
                <Button className='btn btn-primary'
                  onClick={() => setMenuPichet(newId)}
                  style={{ border: 'none' }} > { }พิเศษ {  }</Button>
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
                          <Form.Control
                            type='number'
                            defaultValue={item.quntity}
                            onChange={(e) => updateQuantity(newId, e.target.value)} />
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
              <Button variant="success" onClick={() => handleClose()}>
                ยืนยัน
              </Button>
              <Button variant="danger" onClick={handleClose}>
                ยกเลิก
              </Button>
            </Modal.Footer>
          </>)
        }
      </Modal>
    </div>
  );
}

export default Pos; 