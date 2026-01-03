
import { Card, Row, Col, Image, Button } from "react-bootstrap"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export default function FoodComponent({ data }) {

    const { foodname, code, img, status } = data;

    return <>

        <Card style={{ padding: 6, marginBottom: '12px', cursor: 'pointer' }} key={code}>

            <Card.Body style={{ padding: '0px' }}>
                <Row>
                    <Col md={12} style={{ position: 'relative' }}>
                        <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                            <Image
                                style={{
                                    width: '100%',
                                    height: '160px',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    filter: status === 1 ? 'none' : 'grayscale(80%) brightness(70%)', // จางลง
                                }}
                                src={import.meta.env.VITE_API_URL + '/images/' + img}
                            />

                            {/* ถ้าของหมดให้แสดงข้อความตรงกลางภาพ */}
                            {status !== 1 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '20px',
                                        backgroundColor: 'rgba(218, 218, 218, 0.3)', // พื้นหลังโปร่งบางๆ
                                        borderRadius: 8,
                                    }}
                                >
                                    ของหมด
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className="text-left p-2">
                            <h6>{foodname}</h6>
                        </div>
                        {/* <Button
                            disabled={status !== 1}
                            style={{
                                backgroundColor: status === 1 ? '#FD720D' : '#ccc',
                                border: 'none',
                                cursor: status === 1 ? 'pointer' : 'not-allowed',
                            }}
                            className="w-100"
                        >
                            <AddCircleOutlineIcon /> ADD
                        </Button> */}
                    </Col>
                </Row>


            </Card.Body>
        </Card>
    </>
}