
import { Card, Row, Col, Image, Button } from "react-bootstrap"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export default function FoodComponent({ data }) {

    const { foodname, code, img, status } = data;

    return <>

        <Card className="food-menu-card" key={code}>

            <Card.Body className="food-card-body">
                <Row>
                    <Col md={12} style={{ position: 'relative' }}>
                        <div className="food-image-wrap">
                            <Image
                                className="food-image"
                                src={import.meta.env.VITE_API_URL + '/images/' + img}
                                style={{
                                    filter: status === 1 ? 'none' : 'grayscale(80%) brightness(70%)',
                                }}
                            />

                            {status !== 1 && (
                                <div className="food-out-of-stock">
                                    ของหมด
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className="food-card-title">
                            <h6>{foodname}</h6>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </>
}