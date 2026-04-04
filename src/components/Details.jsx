import React, { useState, useEffect } from "react";
import { Col, Row, ListGroup } from "react-bootstrap";
import axios from "axios";

const Details = (props) => {
    let { bill_ID } = props;
    const [detail, setDetail] = useState([]);

    const getDetail = async () => {
        await axios.get(`${import.meta.env.VITE_API_URL}/billsdetails/${bill_ID}`)
            .then(res => {
                setDetail(res.data);
            })
    }

    useEffect(() => {
        getDetail();
    }, [])

    return (<>

        <ListGroup className="mt-2">
            <Row>

                    <h5>รายละเอียดคำสั่งซื้อ</h5>
                {
                    detail.map((item, index) => {
                        return (<React.Fragment key={index}>
                            <Col md={12}>
                                <ListGroup.Item style={{ border: 'none', margin: '0px', padding: '0px', fontSize: '18px' }}>
                                    <h5> {item.foodname} {item.note}   {item.price} X {item.quantity}  </h5></ListGroup.Item>
                            </Col>
                        </React.Fragment>)
                    })
                }

            </Row>


        </ListGroup>


    </>
    )
}

export default Details;


