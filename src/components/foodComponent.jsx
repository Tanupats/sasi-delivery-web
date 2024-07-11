import React, { useEffect } from "react";
import { Card, Row, Col, Image, Button } from "react-bootstrap"

export default function FoodComponent({data}) {
    
    const {foodname,Price,code,img} = data;
    useEffect(() => {

    }, []
    )
    return <>

        <Card style={{ padding: '0', marginBottom: '12px' }} key={code}>

            <Card.Body style={{ padding: '0px' }}>
                <Row>

                    <Col md={5}>
                        <Image style={{ width:'100%', height: '100px', objectFit: 'cover' }}
                            src={"https://www.sasirestuarant.com/img/"+img}/>
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