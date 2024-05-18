
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Row, Col, Table, Card, Image, Form } from 'react-bootstrap';
import FoodComponent from './foodComponent';
import Pagination from 'react-bootstrap/Pagination';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

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

const  Pos = ()=> {

  const [menu, setMenu] = useState([]);
  const [menuType, setMenuType] = useState([]);
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
    getMenu();
  }, [])

  return (
   
   
      <div >
       
        <Row className='mt-3'>

          <Col md={7} className='whenprint'>
            <div >

              <div className='menu-type'>
                <Row>
                  <ButtonGroup > 

                    {
                        menuType.map((item,index)=>{

                            return (<>
                             <Button 
                               onClick={() => getMenuBytypeId(item.TypeID)}
                             style={{ backgroundColor: '#FD720D', border: 'none' }} 
                              >   {item.T_name}</Button>
                            </>)
                        })
                    }
                   
                   
                  </ButtonGroup>
                </Row>

              </div>
              <div className='menu' >

                <Row>
                  <h5>เมนูอาหาร</h5>
                  {
                    menu.map(item => {
                      return (
                        <Col md={4}>
                          <FoodComponent  data={item}/>
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
          <Col md={5}>
            <div>
              <div className='text-center pt-0'>
                <h5>รายการอาหาร</h5>
              </div>

              <Row>
                <div >
                  <Col md={12}>

                    <Table>

                      <tbody>
                        <tr>
                          <td>ข้าวผัดหมู</td>
                          <td>50</td>
                          <td>1</td>
                          <td>
                            <Button variant='light'><CancelIcon /></Button></td>
                        </tr>
                        <tr>
                          <td>สปาเก็ตตี้หมูสับ</td>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>
                            <Button variant='light'><CancelIcon /></Button></td>
                        </tr>
                        <tr>
                          <td>ข้าวไก่ทอดกระเทียม</td>
                          <td colSpan={2}>Larry the Bird</td>
                          <td>
                            <Button variant='light'><CancelIcon /></Button></td>
                        </tr>
                        <tr>
                          <td>รวมทั้งหมด</td>
                          <td colSpan={3}>100 บาท</td>

                        </tr>
                        <tr>
                          <td>จำนวน</td>
                          <td colSpan={3}>2 รายการ</td>

                        </tr>
                      </tbody>
                    </Table>



                  </Col>
                </div>
              </Row>


              <div className='mt-2' >
                <Form>
                  <Row> <Form.Label>เลือกวิธีรับอาหาร </Form.Label>

                  </Row>

                  <ButtonGroup >
                    <Button className='btn btn-primary' style={{ border: 'none' }} >เสิร์ฟในร้าน</Button>
                    <Button className='btn btn-success' style={{ border: 'none' }} >จัดส่ง</Button>
                    <Button className='btn btn-danger' style={{ border: 'none' }} >รับเอง</Button>
                  </ButtonGroup>

                  <Row className='mt-2'>
                    <Col>
                      <Form.Label>ชื่อ</Form.Label>
                      <Form.Control type="text" placeholder='ชื่อลูกค้า' />
                    </Col>
                    <Col>
                      <Form.Label>เบอร์</Form.Label>
                      <Form.Control type="text" placeholder='เบอร์โทร' />
                    </Col>
                  </Row>


                </Form>
                <Row className='mt-2 when-print'>
                  <Col>
                    <Button
                      onClick={() => printSlip()}
                      variant='primary w-100'>
                      <LocalPrintshopIcon />  พิมพ์
                    </Button>
                  </Col>
                  <Col>
                    <Button variant='success w-100'>
                      บันทึก
                    </Button>
                  </Col>
                  <Col>
                    <Button variant='danger w-100'>
                      ยกเลิก
                    </Button>
                  </Col>
                </Row>

              </div>

            </div>
          </Col>
        </Row>


      </div>
    );
}

export default Pos;