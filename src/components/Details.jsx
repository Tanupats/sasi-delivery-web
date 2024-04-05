import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, ListGroup,Form } from "react-bootstrap";
import axios from "axios";
const Details = (props) => {
    let { bill_ID } = props;
    const [detail, setDetail] = useState([]);
    const [show, setShow] = useState(false);
    const [dataMenus, setDataMenus] = useState("");

    const handleClose = () => setShow(false);

    const handleShow = (dataMenu) => {
        setDataMenus(dataMenu);
        setShow(true);
    }

    const getDetail = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/orderDetailId?bill_ID=${bill_ID}`)
            .then(res => {
                setDetail(res.data);
            })
    }

    const deleteById = async (id) => {

        await axios.delete(`${import.meta.env.VITE_API_URL}/app/DeleteDetailById/${id}`)
            .then(res => {
                if (res.status === 200) {
                    alert("ลบเรียบร้อย")
                }
            })
    }

    useEffect(() => {
        getDetail();
    }, [])

    return (<>

        <ListGroup>

            {
                detail.map(item => {

                    return (<>
                        <Row>
                            <Col md={8}>
                                <ListGroup.Item>{item.foodname} {item.note}  จำนวน {item.quantity} ราคา {item.price}</ListGroup.Item>
                            </Col>
                            <Col md={4}>

                                <Button variant="warning" onClick={() => handleShow(item)}>แก้ไข</Button> { }
                                <Button variant="danger" onClick={() => deleteById(item.id)}>ลบ</Button>
                            </Col>
                        </Row>

                    </>)
                })
            }




        </ListGroup>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>แก้ไขรายการอาหาร</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>


               
                <Row>


                    <Col md={12} xs={12}>
                        
                               
                                   
                                   
                                       
                                        
                                      
                                          
                                                 <Form.Control type="text" placeholder='เมนู'  defaultValue={dataMenus?.foodname}/>
                                                 <Form.Control type="text" placeholder='หมายเหตุเพิ่มเติม'  defaultValue={dataMenus?.note}/>
                                                 <Form.Control type="text" placeholder='ราคา'  defaultValue={dataMenus?.price}/>
                                           
                                      
                                    

                                

                          

                    </Col>
                    <Col md={12} className="text-center">
                        <Button 
                        onClick={handleClose}
                            style={{ float: 'right' }}
                            variant="success">
                                    บันทึก
                        </Button>
                    </Col>
                </Row>
                </Form>
            </Modal.Body>

        </Modal>

    </>
    )
}

export default Details;


