import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button, Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
const Details = (props) => {
    let { bill_ID } = props;
    const [detail, setDetail] = useState([]);
    const getDetail = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/orderDetailId?bill_ID=${bill_ID}`)
            .then(res => {
                setDetail(res.data);
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
                            <Col>
                            <ListGroup.Item>{item.foodname} {item.note}  จำนวน {item.quantity} ราคา {item.price }</ListGroup.Item>
                            </Col>
                        </Row>
                       
                        </> )
                })
            }




        </ListGroup>



    </>
    )
}

export default Details;


