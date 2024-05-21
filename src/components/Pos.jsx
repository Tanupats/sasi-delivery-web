
import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Row, Col, Table, Card, Image, Form, Container } from 'react-bootstrap';
import FoodComponent from './foodComponent';
import Pagination from 'react-bootstrap/Pagination';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { AuthData } from "../ContextData";
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

  const { addTocart, cart, sumPrice, toTal, removeCart, saveOrder } = useContext(AuthData)
  const [menu, setMenu] = useState([]);
  const [menuType, setMenuType] = useState([]);
  const [note, setNote] = useState([]);



  const saveTocart = (data)=>{
        
  }

  const printSlip = () => {
    window.print()
  }

  const getMenu = async () => {

    await axios.get('https://www.sasirestuarant.com/api/index.php').then(
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
          <Col md={3} className='whenprint' >
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
          <Col md={5} className='whenprint'>
            <div >


              <div className='menu' >

                <Row>
                  <h5>เมนูอาหาร</h5>
                  {
                    menu.map(item => {
                      return (
                        <Col md={6} onClick={() => addTocart(item)}>
                          <FoodComponent data={item} />
                        </Col>
                      )
                    })
                  }

                  <Col md={12}>
                    <Pagination>{items}</Pagination>
                  </Col>

                </Row>

              </div>

            </div>
          </Col>
          <Col md={4}>
            <div>
              <div className='text-center pt-0'>
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
                                <td>{item.name}</td>
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

                  <ButtonGroup >
                    <Button className='btn btn-primary' style={{ border: 'none' }} >เสิร์ฟในร้าน</Button>
                    <Button className='btn btn-success' style={{ border: 'none' }} >สั่งกลับบ้าน</Button>
                    <Button className='btn btn-danger' style={{ border: 'none' }} > รับเอง</Button>
                  </ButtonGroup>

                  <Row className='mt-2'>
                    <Col>

                      <Form.Control type="text" placeholder='ข้อมูลติดต่อ' />
                    </Col>

                  </Row>


                </Form>
                <Row className='mt-2 when-print'>
                  <Col md={6}>
                    <Button
                      onClick={() => { printSlip(), saveOrder() }}
                      variant='primary w-100'>
                      <LocalPrintshopIcon />  พิมพ์
                    </Button>
                  </Col>

                  <Col>
                    <Button 
                    
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
    </div>
  );
}

export default Pos; 