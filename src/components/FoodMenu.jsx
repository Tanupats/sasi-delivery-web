import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Image, Button, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AuthData } from "../ContextData";

const FoodMenu = () => {

    const { userid,username } = useParams();

    localStorage.setItem("name",username)
    localStorage.setItem("messangerId",userid)

    const { addTocart } = useContext(AuthData)
    const [menuType, setMenuType] = useState([]);
    const [foods, setFoods] = useState([]);

    const getMenuType = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/getMenuType`)
            .then(res => {
                setMenuType(res.data);
            })
    }

    const getMenuBytypeId = async (id) => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/foodMenuByTypeId?typeId=${id}`)
            .then(res => {
                setFoods(res.data);
            })
    }

    const getFoodMenu = async () => {

        await axios.get(import.meta.env.VITE_API_URL + '/app/foodMenu')
            .then(res => {
                setFoods(res.data);
            })
    }

    useEffect(() => {
        console.log(userid,username)
        getMenuType();
        getFoodMenu();
    }, [])
    return (

        <>
            <Card>
                <Card.Title className="text-center mt-3">  รายการอาหาร</Card.Title>
                <Card.Body>

                    <Row>

                        <Col md={12} className="mb-4">   
                        
                            {
                                menuType.map(item => {

                                    return (
                                       
                                    <Badge 
                                    style={{marginRight:'12px',fontSize:'18px'}}
                                    onClick={()=>getMenuBytypeId(item.id)}
                                    pill bg="primary">
                                     {item.name}  
                                    </Badge>
                                 
                                    )
                                })
                            }

</Col>
                        {
                            foods.map(item => {
                                return (<>


                                    <Col md={6} xs={12}>
                                        <Card style={{ height: '180px', marginBottom: '12px' }}>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={4}
                                                        xs={4}
                                                    >
                                                        <Image style={{ width: "100%", height: '150px', objectFit: 'cover' }}
                                                         src={`${import.meta.env.VITE_API_URL}/files/${item.img}`} />
                                                    </Col>
                                                    <Col md={4} xs={4}>

                                                        <h5>{item.foodname}</h5>
                                                        <h5>{item.Price}฿</h5>

                                                    </Col>
                                                    <Col md={4} xs={4} className="text-center">
                                                        <Button
                                                            onClick={() => addTocart(item)}
                                                            variant="success">
                                                            <AddCircleIcon />
                                                        </Button>
                                                    </Col>
                                                </Row>

                                            </Card.Body>


                                        </Card>

                                    </Col>
                                </>)
                            })
                        }
                    </Row>


                </Card.Body>
            </Card>

        </>)
}

export default FoodMenu;