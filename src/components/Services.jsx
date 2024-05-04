import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import axios from "axios";
const Services = () => {

    const [Services, setServices] = useState([]);
    const getServices = async () => {
        await axios.get(import.meta.env.VITE_API_URL + '/app/allservices')
            .then(res => {
                setServices(res.data)
            })
    }

    useEffect(() => {
        getServices()
    }, [])

    return (

        <Card>
            <Row>

                <Col md={12}>

                    <Card.Body>
                        <Card.Title className="left-center">
                            จัดการระบบหลังบ้าน  SASI Services

                        </Card.Title>
                    </Card.Body>
                    <Row>
                        <Col md={6}></Col>
                        <Col md={6} ><Button  > + New Services</Button></Col>
                    </Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>pathName</th>
                                <th>Method</th>
                                <th>Model</th>
                                <th>Sql</th>
                                <th>Params</th>
                                <th>Acction</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                Services.map(item => {

                                    return (
                                        <tr>
                                            <td>{item.pathName}</td>
                                            {
                                                item.methods === "GET" && (<td style={{ color: 'green' }}> <b>  {item.methods}</b> </td>)
                                            }

                                            {
                                                item.methods === "POST" && (<td style={{ color: 'blue' }}>  {item.methods} </td>)
                                            }
                                            {
                                                item.methods === "DELETE" && (<td style={{ color: 'red' }}>  {item.methods} </td>)
                                            }
                                            {
                                                item.methods === "PUT" && (<td style={{ color: 'orange' }}>  {item.methods} </td>)
                                            }

                                            <td>{item.dataModel}</td>
                                            <td>{item.queryData}</td>

                                            <td>{item.params}</td>
                                            <td><Button>edit</Button></td>

                                        </tr>
                                    )
                                })
                            }



                        </tbody>
                    </Table>


                </Col>
            </Row>

        </Card>
    )
}

export default Services;