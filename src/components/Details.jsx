import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, ListGroup, Form } from "react-bootstrap";
import axios from "axios";

const Details = (props) => {
    let { bill_ID } = props;
    const [detail, setDetail] = useState([]);
    const [show, setShow] = useState(false);
    const [dataMenus, setDataMenus] = useState("");

    //MENU LIST 
    const [foodname, setFoodName] = useState("")
    const [price, setPrice] = useState(0);
    const [note, setNote] = useState("");
    const [quantity, setQuantity] = useState("");
    const [totalNew, setTotalNew] = useState("");

    const [formName,setFormName] = useState("");



    const handleClose = () => setShow(false);

    const handleShow = (dataMenu,name) => {
        setFormName(name)
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
        await getDetail()
        handleClose()
    }


    const UpdateDetailById = async () => {
        let id = dataMenus.id;
        let body = {
            foodname: foodname ? foodname : dataMenus.foodname,
            price: price ? price : dataMenus.price,
            quantity: quantity ? quantity : dataMenus.quantity,
            note: note ? note : dataMenus.note
        }

        await axios.put(`${import.meta.env.VITE_API_URL}/app/UpdateDetailById/${id}`, body)
            .then(res => {
                if (res.status === 200) {


                    getDetail()
                }
            })



        handleClose()
        //update total new after update foodmenu 

    }

    useEffect(() => {
        getDetail();
    }, [])

    // useEffect(()=>{

    // axios.put(`${import.meta.env.VITE_API_URL}/app/updateAmount/${bill_ID}`, { amount: totalNew })

    // },[totalNew])

    useEffect(() => {
        let total = 0;
        detail.map(item => {
            total += (item.quantity * item.price)
        })

        setTotalNew(total)



    }, [detail])

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

                                <Button variant="warning" onClick={() => handleShow(item,'updateMenu')}>แก้ไข</Button> { }
                                <Button variant="danger" onClick={() => deleteById(item.id)}>ลบ</Button>
                            </Col>
                        </Row>

                    </>)
                })
            }

            <br />
            <p>รวมทั้งหมด {totalNew} บาท</p>
            <Button onClick={()=>handleShow('','newMenu')}> เพิ่มเมนูใหม่</Button>
        </ListGroup>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>  { formName === "updateMenu" ? 'แก้ไขรายการอาหาร' : "เพิ่มเมนูใหม่" }  </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { formName === "updateMenu" && (<>
   <Form>

   <Row>
       <Col md={12} xs={12}>
           <Form.Group>
               <Form.Label>เมนู</Form.Label>
               <Form.Control type="text" placeholder='เมนู'
                   onChange={(e) => setFoodName(e.target.value)}
                   defaultValue={dataMenus?.foodname} />
           </Form.Group>
           <Form.Group>
               <Form.Label>จำนวน</Form.Label>
               <Form.Control type="text" placeholder='เมนู'
                   onChange={(e) => setQuantity(e.target.value)}
                   defaultValue={dataMenus?.quantity} />
           </Form.Group>
           <Form.Group>

               <Form.Label>
                   หมายเหตุ
               </Form.Label>
               <Form.Control type="text"
                   onChange={(e) => setNote(e.target.value)}
                   placeholder='หมายเหตุเพิ่มเติม'
                   defaultValue={dataMenus?.note} />
           </Form.Group>
           <Form.Group>

               <Form.Label>ราคา</Form.Label>
               <Form.Control type="text"
                   onChange={(e) => setPrice(e.target.value)}
                   placeholder='ราคา'
                   defaultValue={dataMenus?.price} />

           </Form.Group>

       </Col>
       <Row>

           <Col md={6} className="text-center">
               <Button
                   className="mt-3"
                   onClick={() => UpdateDetailById()}
                   style={{ float: 'left' }}
                   variant="success">
                   แก้ไขข้อมูล
               </Button>
           </Col>
           <Col md={6}>
               <Button
                   className="mt-3"
                   onClick={handleClose}
                   style={{ float: 'left' }}
                   variant="danger">
                   ยกเลิก
               </Button>
           </Col>
       </Row>

   </Row>
</Form>

</> )}
             

                {/*  ฟอร์มแก้ไขเมนู */}
                {
                    formName === "newMenu" && (<>

                        <Form>

                            <Row>
                                <Col md={12} xs={12}>
                                    <Form.Group>
                                        <Form.Label>เลือกประเภท</Form.Label>
                                        <Form.Control type="text" placeholder='เมนู'
                                            onChange={(e) => setFoodName(e.target.value)}
                                         />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>จำนวน</Form.Label>
                                        <Form.Control type="text" placeholder='เมนู'
                                            onChange={(e) => setQuantity(e.target.value)}
                                            />
                                    </Form.Group>
                                    <Form.Group>

                                        <Form.Label>
                                            หมายเหตุ
                                        </Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder='หมายเหตุเพิ่มเติม'
                                            />
                                    </Form.Group>
                                    <Form.Group>

                                        <Form.Label>ราคา</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder='ราคา'
                                            />

                                    </Form.Group>

                                </Col>
                                <Row>

                                    <Col md={6} className="text-center">
                                        <Button
                                            className="mt-3"
                                            onClick={() => UpdateDetailById()}
                                            style={{ float: 'left' }}
                                            variant="success">
                                            เพิ่มเมนูใหม่
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button
                                            className="mt-3"
                                            onClick={handleClose}
                                            style={{ float: 'left' }}
                                            variant="danger">
                                            ยกเลิก
                                        </Button>
                                    </Col>
                                </Row>

                            </Row>
                        </Form>

                        </> )
                }
            </Modal.Body>

        </Modal>

    </>
    )
}

export default Details;


