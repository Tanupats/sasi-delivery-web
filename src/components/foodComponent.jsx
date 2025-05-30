import { useEffect } from "react";
import { Card, Row, Col, Image, Button } from "react-bootstrap"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export default function FoodComponent({ data }) {

    const { foodname, Price, code, img, status } = data;
    useEffect(() => {

    }, []
    )
    return <>

        <Card style={{ padding: 6, marginBottom: '12px', cursor: 'pointer' }} key={code}>

            <Card.Body style={{ padding: '0px' }}>
                <Row>
                    <Col md={12}>
                        <Image style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 8 }}
                            src={import.meta.env.VITE_API_URL + '/images/' + img} />
                    </Col>
                    <Col md={12} >
                        <div className="text-left p-2">
                            {status === 1 ? "" : <p style={{ color: "red" }}> ของหมด </p>}
                            <h6>{foodname}  </h6>
                        </div>
                        <Button style={{ backgroundColor: '#FD720D', border: 'none' }} className="w-100">
                            <AddCircleOutlineIcon />   ADD  </Button>
                    </Col>
                </Row>

            </Card.Body>
        </Card>
    </>
}