import React, { useEffect, useState } from "react";
import { httpGet, httpPut } from "../http";
import { Form, Row, Col, Button } from "react-bootstrap";
const Detail = (props) => {
    const { id, getOrderFood } = props;
    const [data, setData] = useState([]);
    const [indexMenu, setIndexMenu] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [note, setNote] = useState(0);
    const token = localStorage.getItem("token")
    const getData = async () => {
        await httpGet(`/billsdetails/${id}`)
            .then(res => {
                setData(res.data)
            })
    }

    const UpdateDetailById = async () => {
        const id = data[indexMenu].id;
        const body = {
            foodname: name,
            price: parseInt(price),
            quantity: parseInt(quantity),
            note: note
        }
        await httpPut(`/billsdetails/${id}`, body, { headers: { 'apikey': token } })
            .then(res => {
                if (res) {
                    getOrderFood();

                }
            })
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        if (indexMenu !== null) {
            setName(data[indexMenu].foodname);
            setPrice(data[indexMenu].price);
            setQuantity(data[indexMenu].quantity);
            setNote(data[indexMenu].note);

        }
    }, [indexMenu])

    return (<>
        {data?.map((item, index) => {
            return (<React.Fragment key={index}>
                {
                    indexMenu === index ? (
                        <Row className="mb-2">
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    เมนู
                                </Form.Label>
                                <Form.Control type="text" onChange={(e) => setName(e.target.value)} value={name}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    จำนวน
                                </Form.Label>
                                <Form.Control type="text" onChange={(e) => setQuantity(e.target.value)} value={quantity}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    ราคา
                                </Form.Label>
                                <Form.Control type="text" onChange={(e) => setPrice(e.target.value)} value={price}></Form.Control>
                            </Form.Group>


                            <Col md={6} className="mt-2"> <Button variant="success" onClick={() => UpdateDetailById()}> บันทึก </Button></Col>
                            <Col md={6} className="mt-2"> <Button variant="danger" onClick={() => setIndexMenu(null)}> ยกเลิก </Button></Col>
                        </Row>
                    ) : (
                        <Row className="mb-2">
                            <Col md={6}>
                                {item.foodname}

                            </Col>
                            <Col md={2}>
                                {item.quantity}

                            </Col>
                            <Col md={2}>

                                {item.price}

                            </Col>
                            <Col md={2}> <Button variant="warning" onClick={() => setIndexMenu(index)}> แก้ไข </Button></Col>
                        </Row>

                    )
                }



            </React.Fragment>)
        })}
    </>)
}

export default Detail;