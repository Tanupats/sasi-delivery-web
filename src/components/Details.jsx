import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, ListGroup, Form } from "react-bootstrap";
import axios from "axios";
import Select from 'react-select'
const Details = (props) => {
    let { bill_ID, status } = props;
    const [detail, setDetail] = useState([]);
    const [show, setShow] = useState(false);
    const [dataMenus, setDataMenus] = useState("");

  


    const [formName, setFormName] = useState("");


    const handleClose = () => setShow(false);

    const handleShow = (dataMenu, name) => {
        setFormName(name)
        setDataMenus(dataMenu);
        setShow(true);
    }

 

    const getMenuBytypeId = async (id) => {
        console.log(id.value)
        await axios.get(`${import.meta.env.VITE_API_URL}/getMenuId.php?TypeID=${id.value}`)
            .then(res => {

                let newOption = res.data.map(item => {
                    return { label: item.foodname, value: item.foodname, price: item.Price }
                })
                setOptionFood(newOption);
            })
    }

    const getDetail = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/billsdetails/${bill_ID}`)
            .then(res => {
                setDetail(res.data);
            })
    }

 


    useEffect(() => {
        getDetail();
      
    }, [])

   
 

    return (<>

        <Row>



            {
                status !== "ออเดอร์พร้อมส่ง"  || status === 'ส่งแล้ว' && role !== "user" && (

                    <Col md={6}>
                        {/* <h1>{status}</h1> */}
                        <Button className="when-print" variant="success" onClick={() => handleShow('', 'newMenu')}> เพิ่มเมนูใหม่</Button>
                    </Col>
                )
            }






        </Row>

        <ListGroup className="mt-2">

            {
                detail.map(item => {

                    return (<>
                        <Row>
                            <Col md={8}>
                                <ListGroup.Item style={{ border: 'none', margin: '0px', padding: '0px', fontSize: '18px' }}> {item.quantity} X {item.foodname} {item.note}   {item.price}</ListGroup.Item>
                            </Col>

                            {
                                status !== "ออเดอร์พร้อมส่ง" || status === 'ส่งแล้ว' && role !== "user" && (
                                    <Col md={4}>

                                        <Button className="when-print mb-2"
                                            variant="warning"
                                            onClick={() =>
                                                handleShow(item, 'updateMenu')}>แก้ไข</Button>
                                        {' '}
                                        <Button className="when-print mb-2" variant="danger"
                                            onClick={() => deleteById(item.id)}>ลบ</Button>
                                    </Col>
                                )}

                        </Row>

                    </>)
                })
            }


           

        </ListGroup>


    </>
    )
}

export default Details;


