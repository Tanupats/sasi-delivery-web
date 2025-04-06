import React, { useEffect } from "react";
import { Card, Row, Col, Image } from "react-bootstrap"

export default function FoodComponent({ data }) {

    const { foodname, Price, code, img } = data;
    useEffect(() => {

    }, []
    )
    return <>

        <Card style={{ padding: '0', marginBottom: '12px',cursor:'pointer' }} key={code}>

            <Card.Body style={{ padding: '0px' }}>
                <Row>
                    <Col md={5}>
                        <Image style={{ width: '100%', height: '100px', objectFit: 'cover',borderRadius:8 }}
                            src={import.meta.env.VITE_API_URL + '/images/' + img} />
                    </Col>
                    <Col md={7} >
                        <div className="text-left p-2">
                            <h6>{foodname} <br /> ฿{Price} </h6>
                        </div>
                    </Col>
                </Row>

            </Card.Body>
        </Card>
    </>
}